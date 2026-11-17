import fs from 'fs';
import path from 'path';
import { Profile, PublicProfile, SwipeRecord, MatchRecord, SwipeAction } from '@/types';
import { SEED_PROFILES } from './seedData';

interface DbData {
  profiles: Profile[];
  swipes: Record<string, SwipeRecord>;
  matches: MatchRecord[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Strip hasLikedCurrentUser so client never sees it
function toPublicProfile(profile: Profile): PublicProfile {
  const { hasLikedCurrentUser, ...publicData } = profile;
  return publicData;
}

export function getDb(): DbData {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(DB_FILE)) {
      const initial: DbData = {
        profiles: SEED_PROFILES,
        swipes: {},
        matches: [],
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }

    const content = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(content) as DbData;
  } catch (err) {
    console.error('Failed reading db.json, using seed fallback', err);
    return {
      profiles: SEED_PROFILES,
      swipes: {},
      matches: [],
    };
  }
}

export function saveDb(data: DbData) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  const tmpFile = `${DB_FILE}.tmp`;
  fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tmpFile, DB_FILE);
}

export function getFeedProfiles(): PublicProfile[] {
  const db = getDb();
  const swipedSet = new Set(Object.keys(db.swipes));

  return db.profiles
    .filter((p) => !swipedSet.has(p.id))
    .map(toPublicProfile);
}

export function recordSwipe(profileId: string, action: SwipeAction) {
  const db = getDb();
  const target = db.profiles.find((p) => p.id === profileId);

  if (!target) {
    throw new Error(`Profile ${profileId} not found`);
  }

  db.swipes[profileId] = {
    profileId,
    action,
    timestamp: new Date().toISOString(),
  };

  let isMatch = false;
  let newMatch: MatchRecord | undefined;

  // Mutual match only triggers if both like each other
  if (action === 'like' && target.hasLikedCurrentUser) {
    isMatch = true;

    const existing = db.matches.find((m) => m.profileId === profileId);
    if (!existing) {
      newMatch = {
        id: `match_${Date.now()}_${profileId}`,
        profileId,
        profile: toPublicProfile(target),
        matchedAt: new Date().toISOString(),
      };
      db.matches.unshift(newMatch);
    } else {
      newMatch = existing;
    }
  }

  saveDb(db);
  return { isMatch, match: newMatch };
}

export function getMatches(): MatchRecord[] {
  const db = getDb();
  return db.matches || [];
}

export function resetDemo() {
  const fresh: DbData = {
    profiles: SEED_PROFILES,
    swipes: {},
    matches: [],
  };
  saveDb(fresh);
}
