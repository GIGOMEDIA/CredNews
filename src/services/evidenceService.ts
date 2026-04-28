import { evidenceApi } from '@/api/evidenceApi';
import { Evidence, MAX_IMAGE_BYTES } from '@/types/evidence';
import { withTimeout } from '@/utils/async';

import { cacheService } from './cacheService';
import {
  pendingActionsService,
  PendingEvidenceImage,
  PendingEvidenceLink,
  PendingEvidenceNote,
} from './pendingActionsService';
import { userProfileService } from './userProfileService';

const cacheKey = (articleId: string) => `evidence:${articleId}`;
const WRITE_TIMEOUT_MS = 15000;
const IMAGE_UPLOAD_TIMEOUT_MS = 25000;

const toMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'Could not reach the evidence service.';
};

type AuthorContext = {
  uid: string;
  email: string;
};

const buildAuthor = async (user: AuthorContext) => {
  const profile = await userProfileService.getProfile(user.uid);
  return {
    authorEmail: user.email,
    authorUid: user.uid,
    authorVerified: profile.verified,
  };
};

export const evidenceService = {
  async getCachedEvidence(articleId: string): Promise<Evidence[]> {
    const cached = await cacheService.get<Evidence[]>(cacheKey(articleId));
    return cached?.data ?? [];
  },

  subscribe(
    articleId: string,
    callback: (items: Evidence[]) => void,
    onError?: (error: Error) => void,
  ) {
    return evidenceApi.subscribe(
      articleId,
      (items) => {
        callback(items);
        void cacheService.set(cacheKey(articleId), items);
      },
      onError,
    );
  },

  async postLink({
    articleId,
    user,
    url,
    caption,
    isOnline,
  }: {
    articleId: string;
    user: AuthorContext;
    url: string;
    caption: string;
    isOnline: boolean;
  }): Promise<{ pending: boolean; queueId?: string; error?: string }> {
    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      return { error: 'Add a URL first.', pending: false };
    }

    const author = await buildAuthor(user);
    const payload = {
      ...author,
      caption: caption.trim(),
      url: trimmedUrl,
    };

    if (!isOnline) {
      const queued = await pendingActionsService.enqueueEvidenceLink({
        articleId,
        payload,
      });
      return { pending: true, queueId: queued.id };
    }

    try {
      await withTimeout(
        evidenceApi.postLink(articleId, payload),
        WRITE_TIMEOUT_MS,
      );
      return { pending: false };
    } catch (error) {
      const queued = await pendingActionsService.enqueueEvidenceLink({
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

  async postNote({
    articleId,
    user,
    caption,
    isOnline,
  }: {
    articleId: string;
    user: AuthorContext;
    caption: string;
    isOnline: boolean;
  }): Promise<{ pending: boolean; queueId?: string; error?: string }> {
    const trimmed = caption.trim();
    if (!trimmed) {
      return { error: 'Note cannot be empty.', pending: false };
    }

    const author = await buildAuthor(user);
    const payload = { ...author, caption: trimmed };

    if (!isOnline) {
      const queued = await pendingActionsService.enqueueEvidenceNote({
        articleId,
        payload,
      });
      return { pending: true, queueId: queued.id };
    }

    try {
      await withTimeout(
        evidenceApi.postNote(articleId, payload),
        WRITE_TIMEOUT_MS,
      );
      return { pending: false };
    } catch (error) {
      const queued = await pendingActionsService.enqueueEvidenceNote({
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

  async postImage({
    articleId,
    user,
    localUri,
    fileSize,
    caption,
    isOnline,
  }: {
    articleId: string;
    user: AuthorContext;
    localUri: string;
    fileSize?: number;
    caption: string;
    isOnline: boolean;
  }): Promise<{ pending: boolean; queueId?: string; error?: string }> {
    if (!localUri) {
      return { error: 'Pick an image first.', pending: false };
    }

    if (typeof fileSize === 'number' && fileSize > MAX_IMAGE_BYTES) {
      return {
        error: 'Image is over 2 MB. Pick a smaller one.',
        pending: false,
      };
    }

    const author = await buildAuthor(user);
    const payload = {
      ...author,
      caption: caption.trim(),
      localUri,
    };

    if (!isOnline) {
      const queued = await pendingActionsService.enqueueEvidenceImage({
        articleId,
        payload,
      });
      return { pending: true, queueId: queued.id };
    }

    try {
      await withTimeout(
        evidenceApi.uploadImage(articleId, payload),
        IMAGE_UPLOAD_TIMEOUT_MS,
      );
      return { pending: false };
    } catch (error) {
      const queued = await pendingActionsService.enqueueEvidenceImage({
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

  async remove(
    articleId: string,
    evidenceId: string,
    storagePath?: string,
  ): Promise<void> {
    await evidenceApi.remove(articleId, evidenceId, storagePath);
  },

  async replayPending(): Promise<{ succeeded: number; failed: number }> {
    return pendingActionsService.replay({
      async evidenceImage(action: PendingEvidenceImage) {
        await evidenceApi.uploadImage(action.articleId, action.payload);
      },
      async evidenceLink(action: PendingEvidenceLink) {
        await evidenceApi.postLink(action.articleId, action.payload);
      },
      async evidenceNote(action: PendingEvidenceNote) {
        await evidenceApi.postNote(action.articleId, action.payload);
      },
    });
  },
};
