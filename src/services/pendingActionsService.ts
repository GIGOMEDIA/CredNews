import AsyncStorage from '@react-native-async-storage/async-storage';

import { CommentVerdict, VoteValue } from '@/types/comment';

const STORAGE_KEY = 'crednews:pendingActions';

type AuthorPayload = {
  authorUid: string;
  authorEmail: string;
  authorVerified: boolean;
};

export type PendingComment = {
  id: string;
  type: 'comment';
  articleId: string;
  queuedAt: string;
  payload: AuthorPayload & {
    text: string;
    verdict: CommentVerdict | null;
  };
};

export type PendingVote = {
  id: string;
  type: 'vote';
  articleId: string;
  queuedAt: string;
  payload: {
    authorUid: string;
    commentId: string;
    vote: VoteValue;
  };
};

export type PendingEvidenceLink = {
  id: string;
  type: 'evidence-link';
  articleId: string;
  queuedAt: string;
  payload: AuthorPayload & {
    url: string;
    caption: string;
  };
};

export type PendingEvidenceNote = {
  id: string;
  type: 'evidence-note';
  articleId: string;
  queuedAt: string;
  payload: AuthorPayload & {
    caption: string;
  };
};

export type PendingEvidenceImage = {
  id: string;
  type: 'evidence-image';
  articleId: string;
  queuedAt: string;
  payload: AuthorPayload & {
    caption: string;
    localUri: string;
  };
};

export type PendingAction =
  | PendingComment
  | PendingVote
  | PendingEvidenceLink
  | PendingEvidenceNote
  | PendingEvidenceImage;

export type PendingActionHandlers = {
  comment: (action: PendingComment) => Promise<void>;
  vote: (action: PendingVote) => Promise<void>;
  evidenceLink: (action: PendingEvidenceLink) => Promise<void>;
  evidenceNote: (action: PendingEvidenceNote) => Promise<void>;
  evidenceImage: (action: PendingEvidenceImage) => Promise<void>;
};

const makeId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;

const readAll = async (): Promise<PendingAction[]> => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PendingAction[]) : [];
  } catch {
    return [];
  }
};

const writeAll = async (actions: PendingAction[]): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(actions));
};

let isReplaying = false;

export const pendingActionsService = {
  async enqueueComment(
    action: Omit<PendingComment, 'id' | 'queuedAt' | 'type'>,
  ): Promise<PendingComment> {
    const entry: PendingComment = {
      ...action,
      id: makeId(),
      queuedAt: new Date().toISOString(),
      type: 'comment',
    };

    const actions = await readAll();
    actions.push(entry);
    await writeAll(actions);

    return entry;
  },

  async enqueueVote(
    action: Omit<PendingVote, 'id' | 'queuedAt' | 'type'>,
  ): Promise<PendingVote> {
    const actions = await readAll();
    // Collapse multiple pending votes from the same user on the same comment.
    const filtered = actions.filter(
      (existing) =>
        !(
          existing.type === 'vote' &&
          existing.payload.commentId === action.payload.commentId &&
          existing.payload.authorUid === action.payload.authorUid
        ),
    );

    const entry: PendingVote = {
      ...action,
      id: makeId(),
      queuedAt: new Date().toISOString(),
      type: 'vote',
    };

    filtered.push(entry);
    await writeAll(filtered);

    return entry;
  },

  async enqueueEvidenceLink(
    action: Omit<PendingEvidenceLink, 'id' | 'queuedAt' | 'type'>,
  ): Promise<PendingEvidenceLink> {
    const entry: PendingEvidenceLink = {
      ...action,
      id: makeId(),
      queuedAt: new Date().toISOString(),
      type: 'evidence-link',
    };

    const actions = await readAll();
    actions.push(entry);
    await writeAll(actions);

    return entry;
  },

  async enqueueEvidenceNote(
    action: Omit<PendingEvidenceNote, 'id' | 'queuedAt' | 'type'>,
  ): Promise<PendingEvidenceNote> {
    const entry: PendingEvidenceNote = {
      ...action,
      id: makeId(),
      queuedAt: new Date().toISOString(),
      type: 'evidence-note',
    };

    const actions = await readAll();
    actions.push(entry);
    await writeAll(actions);

    return entry;
  },

  async enqueueEvidenceImage(
    action: Omit<PendingEvidenceImage, 'id' | 'queuedAt' | 'type'>,
  ): Promise<PendingEvidenceImage> {
    const entry: PendingEvidenceImage = {
      ...action,
      id: makeId(),
      queuedAt: new Date().toISOString(),
      type: 'evidence-image',
    };

    const actions = await readAll();
    actions.push(entry);
    await writeAll(actions);

    return entry;
  },

  async getForArticle(articleId: string): Promise<PendingAction[]> {
    const actions = await readAll();
    return actions.filter((action) => action.articleId === articleId);
  },

  async remove(actionId: string): Promise<void> {
    const actions = await readAll();
    const filtered = actions.filter((action) => action.id !== actionId);
    await writeAll(filtered);
  },

  async clear(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEY);
  },

  async replay(handlers: Partial<PendingActionHandlers>): Promise<{
    succeeded: number;
    failed: number;
  }> {
    if (isReplaying) {
      return { failed: 0, succeeded: 0 };
    }

    isReplaying = true;
    let succeeded = 0;
    let failed = 0;

    try {
      const actions = await readAll();
      const remaining: PendingAction[] = [];

      for (const action of actions) {
        try {
          let handled = false;
          switch (action.type) {
            case 'comment':
              if (handlers.comment) {
                await handlers.comment(action);
                handled = true;
              }
              break;
            case 'vote':
              if (handlers.vote) {
                await handlers.vote(action);
                handled = true;
              }
              break;
            case 'evidence-link':
              if (handlers.evidenceLink) {
                await handlers.evidenceLink(action);
                handled = true;
              }
              break;
            case 'evidence-note':
              if (handlers.evidenceNote) {
                await handlers.evidenceNote(action);
                handled = true;
              }
              break;
            case 'evidence-image':
              if (handlers.evidenceImage) {
                await handlers.evidenceImage(action);
                handled = true;
              }
              break;
          }

          if (handled) {
            succeeded += 1;
          } else {
            // No handler registered for this action type — leave in queue.
            remaining.push(action);
          }
        } catch {
          failed += 1;
          remaining.push(action);
        }
      }

      await writeAll(remaining);
    } finally {
      isReplaying = false;
    }

    return { failed, succeeded };
  },
};
