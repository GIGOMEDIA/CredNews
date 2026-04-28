import { Article } from '@/types/article';
import { cacheService } from './cacheService';

const BOOKMARKS_CACHE_KEY = 'bookmarks';

const sortByNewest = (articles: Article[]) =>
  articles.sort(
    (first, second) =>
      new Date(second.publishedAt).getTime() -
      new Date(first.publishedAt).getTime(),
  );

export const bookmarkService = {
  async getBookmarks(): Promise<Article[]> {
    const cached = await cacheService.get<Article[]>(BOOKMARKS_CACHE_KEY);

    return cached?.data ?? [];
  },

  async isBookmarked(articleId: string): Promise<boolean> {
    const bookmarks = await this.getBookmarks();

    return bookmarks.some((article) => article.id === articleId);
  },

  async addBookmark(article: Article): Promise<Article[]> {
    const bookmarks = await this.getBookmarks();
    const exists = bookmarks.some((item) => item.id === article.id);
    const nextBookmarks = exists ? bookmarks : sortByNewest([article, ...bookmarks]);

    await cacheService.set(BOOKMARKS_CACHE_KEY, nextBookmarks);

    return nextBookmarks;
  },

  async removeBookmark(articleId: string): Promise<Article[]> {
    const bookmarks = await this.getBookmarks();
    const nextBookmarks = bookmarks.filter((article) => article.id !== articleId);

    await cacheService.set(BOOKMARKS_CACHE_KEY, nextBookmarks);

    return nextBookmarks;
  },

  async clearBookmarks(): Promise<void> {
    await cacheService.remove(BOOKMARKS_CACHE_KEY);
  },

  async toggleBookmark(article: Article): Promise<Article[]> {
    const bookmarked = await this.isBookmarked(article.id);

    return bookmarked
      ? this.removeBookmark(article.id)
      : this.addBookmark(article);
  },
};
