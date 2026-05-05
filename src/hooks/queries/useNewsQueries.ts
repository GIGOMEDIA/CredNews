import { useQuery } from '@tanstack/react-query';

import { newsService } from '@/services/newsService';
import { queryKeys } from '@/services/queryClient';
import { ArticleCollection, NewsCategory } from '@/types/article';

const FIVE_MINUTES = 5 * 60 * 1000;
const FIFTEEN_MINUTES = 15 * 60 * 1000;

export function useHeadlinesQuery(
  category: NewsCategory,
  personalizedQuery: string,
) {
  const trimmed = personalizedQuery.trim();
  const isPersonalized = category === 'general' && trimmed.length > 1;

  return useQuery<ArticleCollection, Error>({
    enabled: true,
    queryKey: isPersonalized
      ? queryKeys.news.personalized(trimmed.toLowerCase())
      : queryKeys.news.headlines(category),
    queryFn: ({ signal }) =>
      isPersonalized
        ? newsService.searchArticles(trimmed, { signal })
        : newsService.getTopHeadlines(category, { signal }),
    staleTime: FIVE_MINUTES,
    gcTime: FIFTEEN_MINUTES * 4,
  });
}

export function useSearchQuery(query: string) {
  const trimmed = query.trim();
  const enabled = trimmed.length >= 2;

  return useQuery<ArticleCollection, Error>({
    enabled,
    queryKey: queryKeys.news.search(trimmed),
    queryFn: ({ signal }) => newsService.searchArticles(trimmed, { signal }),
    staleTime: FIVE_MINUTES,
    gcTime: FIFTEEN_MINUTES * 4,
  });
}