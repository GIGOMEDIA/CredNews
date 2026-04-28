import { newsApi, NewsApiError } from '@/api/newsApi';
import { ArticleCollection, NewsCategory } from '@/types/article';

export type FetchNewsOptions = {
  signal?: AbortSignal;
};

export const newsErrorMessage = (error: unknown): string => {
  if (error instanceof NewsApiError) {
    if (error.status === 401 || error.status === 403) {
      return 'News API access failed. Please check your API key.';
    }

    if (error.status === 429) {
      return 'News API rate limit reached. Please try again later.';
    }

    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Unable to load news right now.';
};

export const newsService = {
  getTopHeadlines(
    category: NewsCategory = 'general',
    options?: FetchNewsOptions,
  ): Promise<ArticleCollection> {
    return newsApi.getTopHeadlines(category, options);
  },

  searchArticles(
    query: string,
    options?: FetchNewsOptions,
  ): Promise<ArticleCollection> {
    const trimmedQuery = query.trim();

    if (trimmedQuery.length < 2) {
      throw new NewsApiError('Enter at least 2 characters to search news.');
    }

    return newsApi.searchArticles(trimmedQuery, options);
  },
};
