import { eventsApi } from '@/api/eventsApi';
import {
  EventFilters,
  EventItem,
  EventTimeRange,
  EventType,
} from '@/types/event';
import { newsService } from './newsService';

export type EventFetchResult = {
  events: EventItem[];
  isFallback: boolean;
};

const toEventType = (query: string): Exclude<EventType, 'all'> => {
  const normalized = query.toLowerCase();

  if (normalized.includes('conference')) {
    return 'conference';
  }

  if (normalized.includes('hackathon')) {
    return 'hackathon';
  }

  if (normalized.includes('workshop')) {
    return 'workshop';
  }

  return 'meetup';
};

const toFallbackEvent = (
  article: Awaited<ReturnType<typeof newsService.searchArticles>>['articles'][number],
  filters: EventFilters,
): EventItem => ({
  city: filters.city,
  country: filters.country,
  dateLabel: 'Check organizer',
  description: article.description || article.content || article.source.name,
  id: article.id,
  source: `${article.source.name} / GNews`,
  title: article.title,
  type: toEventType(`${filters.type} ${article.title}`),
  url: article.url,
});

const getFallbackQuery = (filters: EventFilters) => {
  const typeQuery = filters.type === 'all' ? 'events' : filters.type;
  const customQuery = filters.query?.trim();

  return [
    customQuery,
    typeQuery,
    filters.city,
    'conference meetup hackathon workshop',
  ]
    .filter(Boolean)
    .join(' ');
};

export const eventService = {
  async getEvents(filters: EventFilters): Promise<EventFetchResult> {
    try {
      const events = await eventsApi.searchEvents(filters);

      return { events, isFallback: false };
    } catch (eventsError) {
      const fallback = await newsService.searchArticles(
        getFallbackQuery(filters),
      );

      if (fallback.articles.length > 0) {
        return {
          events: fallback.articles.map((article) =>
            toFallbackEvent(article, filters),
          ),
          isFallback: true,
        };
      }

      throw eventsError;
    }
  },
};

export const eventTimeRanges: {
  label: string;
  value: EventTimeRange;
}[] = [
  { label: 'Any time', value: 'anytime' },
  { label: 'Today', value: 'today' },
  { label: 'This week', value: 'thisWeek' },
  { label: 'This month', value: 'thisMonth' },
];
