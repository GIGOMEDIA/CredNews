import { doc, getDoc } from 'firebase/firestore';

import { db } from '@/config/firestore';
import { withTimeout } from '@/utils/async';

export type UserProfile = {
  uid: string;
  verified: boolean;
};

const profileDoc = (uid: string) => doc(db, 'users', uid);
const PROFILE_TIMEOUT_MS = 5000;

const cache = new Map<string, UserProfile>();

export const userProfileService = {
  async getProfile(uid: string): Promise<UserProfile> {
    const cached = cache.get(uid);
    if (cached) {
      return cached;
    }

    try {
      const snap = await withTimeout(
        getDoc(profileDoc(uid)),
        PROFILE_TIMEOUT_MS,
        'Could not load profile quickly enough.',
      );
      const data = snap.exists() ? snap.data() : null;
      const profile: UserProfile = {
        uid,
        verified: Boolean(data?.verified),
      };
      cache.set(uid, profile);
      return profile;
    } catch {
      return { uid, verified: false };
    }
  },

  invalidate(uid: string) {
    cache.delete(uid);
  },
};
