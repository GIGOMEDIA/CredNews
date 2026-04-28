import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useRef, useState } from 'react';

import { AiProviderError, parsePartialBrief } from '@/api/aiProviders';
import { GeminiApiError } from '@/api/geminiApi';
import {
  aiBriefErrorMessage,
  aiBriefService,
  BriefProgress,
} from '@/services/aiBriefService';
import { queryClient as defaultClient, queryKeys } from '@/services/queryClient';
import { AiBrief } from '@/types/aiBrief';
import { Article } from '@/types/article';

const REVEAL_TICK_MS = 32;
const REVEAL_CHARS_PER_TICK = 1;

const NON_RETRYABLE_STATUSES = new Set([400, 401, 403, 404, 429]);

const shouldRetryBrief = (failureCount: number, error: unknown): boolean => {
  if (error instanceof Error && error.name === 'AbortError') {
    return false;
  }

  if (failureCount >= 1) return false;

  const status =
    error instanceof AiProviderError || error instanceof GeminiApiError
      ? error.status
      : undefined;

  if (status !== undefined && NON_RETRYABLE_STATUSES.has(status)) {
    return false;
  }
  return true;
};

const ONE_HOUR = 60 * 60 * 1000;
const ONE_DAY = 24 * ONE_HOUR;

export type BriefDisplay = {
  isComplete: boolean;
  tldr: string;
  whyItMatters: string[];
};

export function useAiBriefQuery(article: Article) {
  const client = useQueryClient();
  const [streaming, setStreaming] = useState<BriefProgress | null>(null);
  const rawRef = useRef('');
  const revealedLenRef = useRef(0);
  const tickerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const streamFinishedRef = useRef(false);
  const revealResolveRef = useRef<(() => void) | null>(null);

  const stopTicker = useCallback(() => {
    if (tickerRef.current !== null) {
      clearInterval(tickerRef.current);
      tickerRef.current = null;
    }
  }, []);

  const ensureTickerRunning = useCallback(() => {
    if (tickerRef.current !== null) return;
    tickerRef.current = setInterval(() => {
      const total = rawRef.current.length;
      if (revealedLenRef.current < total) {
        revealedLenRef.current = Math.min(
          revealedLenRef.current + REVEAL_CHARS_PER_TICK,
          total,
        );
        setStreaming(
          parsePartialBrief(rawRef.current.slice(0, revealedLenRef.current)),
        );
      }

      if (
        streamFinishedRef.current &&
        revealedLenRef.current >= rawRef.current.length
      ) {
        stopTicker();
        revealResolveRef.current?.();
        revealResolveRef.current = null;
      }
    }, REVEAL_TICK_MS);
  }, [stopTicker]);

  const query = useQuery<AiBrief, Error>({
    enabled: Boolean(article.id),
    queryKey: queryKeys.ai.brief(article.id),
    queryFn: async ({ signal }) => {
      rawRef.current = '';
      revealedLenRef.current = 0;
      streamFinishedRef.current = false;
      stopTicker();
      setStreaming({ tldr: '', whyItMatters: [] });

      const revealComplete = new Promise<void>((resolve) => {
        revealResolveRef.current = resolve;
      });

      const onAbort = () => {
        stopTicker();
        revealResolveRef.current?.();
        revealResolveRef.current = null;
      };
      signal.addEventListener('abort', onAbort);

      try {
        const result = await aiBriefService.generateBrief(article, {
          signal,
          onRawProgress: (rawText) => {
            rawRef.current = rawText;
            ensureTickerRunning();
          },
        });

        streamFinishedRef.current = true;
        ensureTickerRunning();
        await revealComplete;
        return result;
      } finally {
        signal.removeEventListener('abort', onAbort);
        stopTicker();
        setStreaming(null);
      }
    },
    retry: shouldRetryBrief,
    retryDelay: 8000,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: ONE_HOUR,
    gcTime: ONE_DAY * 7,
  });

  const display: BriefDisplay | null = streaming
    ? { isComplete: false, ...streaming }
    : query.data
      ? {
          isComplete: true,
          tldr: query.data.tldr,
          whyItMatters: query.data.whyItMatters,
        }
      : null;

  const regenerate = useCallback(async () => {
    await client.invalidateQueries({
      queryKey: queryKeys.ai.brief(article.id),
      exact: true,
      refetchType: 'none',
    });
    return query.refetch();
  }, [article.id, client, query]);

  return {
    ...query,
    display,
    isStreaming: streaming !== null,
    regenerate,
  };
}

type AskInput = {
  article: Article;
  onRawProgress?: (rawText: string) => void;
  question: string;
};

export function useAskAiMutation() {
  return useMutation({
    mutationFn: ({ article, onRawProgress, question }: AskInput) =>
      aiBriefService.askQuestion(article, question, { onRawProgress }),
  });
}

export function clearAiBriefCache(articleId: string) {
  defaultClient.removeQueries({
    queryKey: queryKeys.ai.brief(articleId),
    exact: true,
  });
}

export { aiBriefErrorMessage };
