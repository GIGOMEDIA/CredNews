import { router } from 'expo-router';

import { Article } from '@/types/article';

export function openArticle(article: Article) {
  router.push({
    pathname: '/article/[id]',
    params: {
      id: article.id,
      content: article.content,
      description: article.description,
      imageUrl: article.imageUrl ?? '',
      publishedAt: article.publishedAt,
      source: article.source.name,
      title: article.title,
      url: article.url,
    },
  });
}
