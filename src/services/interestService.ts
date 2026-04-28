import { cacheService } from './cacheService';

const INTERESTS_CACHE_KEY = 'interests';

export type InterestPreferences = {
  country: string;
  interests: string[];
};

const defaultPreferences: InterestPreferences = {
  country: 'Any country',
  interests: [],
};

export const interestService = {
  async getPreferences(): Promise<InterestPreferences> {
    const cached =
      await cacheService.get<InterestPreferences>(INTERESTS_CACHE_KEY);

    return cached?.data ?? defaultPreferences;
  },

  async savePreferences(
    preferences: InterestPreferences,
  ): Promise<InterestPreferences> {
    const normalizedPreferences = {
      country: preferences.country.trim() || defaultPreferences.country,
      interests: Array.from(
        new Set(
          preferences.interests
            .map((interest) => interest.trim())
            .filter(Boolean),
        ),
      ),
    };

    await cacheService.set(INTERESTS_CACHE_KEY, normalizedPreferences);

    return normalizedPreferences;
  },
};
