import AsyncStorage from '@react-native-async-storage/async-storage';

export type CacheEntry<T> = {
  data: T;
  cachedAt: string;
};

const key = (name: string) => `crednews:${name}`;

export const cacheService = {
  async get<T>(name: string): Promise<CacheEntry<T> | null> {
    const cached = await AsyncStorage.getItem(key(name));

    if (!cached) {
      return null;
    }

    try {
      return JSON.parse(cached) as CacheEntry<T>;
    } catch {
      await AsyncStorage.removeItem(key(name));
      return null;
    }
  },

  async set<T>(name: string, data: T): Promise<CacheEntry<T>> {
    const entry = {
      data,
      cachedAt: new Date().toISOString(),
    };

    await AsyncStorage.setItem(key(name), JSON.stringify(entry));

    return entry;
  },

  async remove(name: string): Promise<void> {
    await AsyncStorage.removeItem(key(name));
  },

  async clearNewsCache(): Promise<void> {
    const keys = await AsyncStorage.getAllKeys();
    const newsKeys = keys.filter((storageKey) =>
      storageKey.startsWith(key('news:')),
    );

    await Promise.all(
      newsKeys.map((storageKey) => AsyncStorage.removeItem(storageKey)),
    );
  },
};
