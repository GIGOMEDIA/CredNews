import { commentsApi } from '@/api/commentsApi';
import { Comment, CommentVerdict, VoteValue } from '@/types/comment';
import { withTimeout } from '@/utils/async';

import { cacheService } from './cacheService';
import {
  pendingActionsService,
  PendingComment,
  PendingVote,
} from './pendingActionsService';
import { userProfileService } from './userProfileService';

const cacheKey = (articleId: string) => `comments:${articleId}`;
const WRITE_TIMEOUT_MS = 12000;

const toMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'Could not reach the community service.';
};

export const commentsService = {
  async getCachedComments(articleId: string): Promise<Comment[]> {
    const cached = await cacheService.get<Comment[]>(cacheKey(articleId));
    return cached?.data ?? [];
  },

  async cacheComments(articleId: string, comments: Comment[]): Promise<void> {
    await cacheService.set(cacheKey(articleId), comments);
  },

  subscribe(
    articleId: string,
    callback: (comments: Comment[]) => void,
    onError?: (error: Error) => void,
  ) {
    return commentsApi.subscribe(
      articleId,
      (comments) => {
        callback(comments);
        void cacheService.set(cacheKey(articleId), comments);
      },
      onError,
    );
  },

  async hydrateMyVotes(
    articleId: string,
    comments: Comment[],
    uid: string,
  ): Promise<Comment[]> {
    return commentsApi.hydrateMyVotes(articleId, comments, uid);
  },

  async postComment({
    articleId,
    user,
    text,
    verdict,
    isOnline,
  }: {
    articleId: string;
    user: { uid: string; email: string };
    text: string;
    verdict: CommentVerdict | null;
    isOnline: boolean;
  }): Promise<{ pending: boolean; queueId?: string; error?: string }> {
    const trimmed = text.trim();
    if (!trimmed) {
      return { error: 'Comment cannot be empty.', pending: false };
    }

    const profile = await userProfileService.getProfile(user.uid);
    const payload = {
      authorEmail: user.email,
      authorUid: user.uid,
      authorVerified: profile.verified,
      text: trimmed,
      verdict,
    };

    if (!isOnline) {
      const queued = await pendingActionsService.enqueueComment({
        articleId,
        payload,
      });
      return { pending: true, queueId: queued.id };
    }

    try {
      await withTimeout(
        commentsApi.postComment(articleId, payload),
        WRITE_TIMEOUT_MS,
      );
      return { pending: false };
    } catch (error) {
      const queued = await pendingActionsService.enqueueComment({
        articleId,
        payload,
      });
      return {
        error: toMessage(error),
        pending: true,
        queueId: queued.id,
      };
    }
  },

  async voteOnComment({
    articleId,
    commentId,
    user,
    nextVote,
    isOnline,
  }: {
    articleId: string;
    commentId: string;
    user: { uid: string };
    nextVote: VoteValue;
    isOnline: boolean;
  }): Promise<{
    pending: boolean;
    myVote: VoteValue | null;
    queueId?: string;
    error?: string;
  }> {
    if (!isOnline) {
      const queued = await pendingActionsService.enqueueVote({
        articleId,
        payload: {
          authorUid: user.uid,
          commentId,
          vote: nextVote,
        },
      });
      return { myVote: nextVote, pending: true, queueId: queued.id };
    }

    try {
      const result = await withTimeout(
        commentsApi.voteOnComment(articleId, commentId, user.uid, nextVote),
        WRITE_TIMEOUT_MS,
      );
      return { myVote: result.myVote, pending: false };
    } catch (error) {
      const queued = await pendingActionsService.enqueueVote({
        articleId,
        payload: {
          authorUid: user.uid,
          commentId,
          vote: nextVote,
        },
      });
      return {
        error: toMessage(error),
        myVote: nextVote,
        pending: true,
        queueId: queued.id,
      };
    }
  },

  async replayPending(): Promise<{ succeeded: number; failed: number }> {
    return pendingActionsService.replay({
      async comment(action: PendingComment) {
        await commentsApi.postComment(action.articleId, action.payload);
      },
      async vote(action: PendingVote) {
        await commentsApi.voteOnComment(
          action.articleId,
          action.payload.commentId,
          action.payload.authorUid,
          action.payload.vote,
        );
      },
    });
  },
};
