import fs from 'fs';
import path from 'path';
import { Profile, PublicProfile, SwipeRecord, MatchRecord, SwipeAction } from '@/types';
import { SEED_PROFILES } from './seedData';

interface DatabaseSchema {
  profiles: Profile[];
  swipes: Record<string, SwipeRecord>;
  matches: MatchRecord[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'db.json');

function sanitizeProfile(profile: Profile): PublicProfile {
  const { hasLikedCurrentUser, ...rest } = profile;
  return rest;
}

export function getDb(): DatabaseSchema {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(DB_PATH)) {
      const initialData: DatabaseSchema = {
        profiles: SEED_PROFILES,
        swipes: {},
        matches: [],
      };
      fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2), 'utf-8');
      return initialData;
    }

    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    const parsed: DatabaseSchema = JSON.parse(raw);
    return parsed;
  } catch (error) {
    console.error('Error reading database, falling back to seed:', error);
    return {
      profiles: SEED_PROFILES,
      swipes: {},
      matches: [],
    };
  }
}

export function saveDb(data: DatabaseSchema): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  // Atomic write via temp file
  const tempPath = `${DB_PATH}.tmp`;
  fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tempPath, DB_PATH);
}

/**
 * Returns unswiped profiles for the feed.
 * Strips out `hasLikedCurrentUser` to ensure Coy's core privacy guarantee.
 */
export function getFeedProfiles(): PublicProfile[] {
  const db = getDb();
  const swipedIds = new Set(Object.keys(db.swipes));

  return db.profiles
    .filter((p) => !swipedIds.has(p.id))
    .map(sanitizeProfile);
}

/**
 * Records a swipe (like or pass).
 * If action is 'like' and the target profile had liked the current user,
 * creates a mutual match!
 */
export function recordSwipe(
  profileId: string,
  action: SwipeAction
): { isMatch: boolean; match?: MatchRecord } {
  const db = getDb();
  const profile = db.profiles.find((p) => p.id === profileId);

  if (!profile) {
    throw new Error(`Profile with id "${profileId}" not found.`);
  }

  // Record the swipe to guarantee they never appear in feed again
  db.swipes[profileId] = {
    profileId,
    action,
    timestamp: new Date().toISOString(),
  };

  let isMatch = false;
  let newMatch: MatchRecord | undefined = undefined;

  // Match only happens when BOTH users have liked each other
  if (action === 'like' && profile.hasLikedCurrentUser) {
    isMatch = true;
    
    // Avoid duplicate match records
    const existingMatch = db.matches.find((m) => m.profileId === profileId);
    if (!existingMatch) {
      newMatch = {
        id: `match_${Date.now()}_${profileId}`,
        profileId,
        profile: sanitizeProfile(profile),
        matchedAt: new Date().toISOString(),
      };
      db.matches.unshift(newMatch);
    } else {
      newMatch = existingMatch;
    }
  }

  saveDb(db);

  return { isMatch, match: newMatch };
}

/**
 * Returns all mutual matches.
 */
export function getMatches(): MatchRecord[] {
  const db = getDb();
  return db.matches || [];
}

/**
 * Resets swipes and matches for easy demo replayability.
 */
export function resetDemo(): void {
  const initialData: DatabaseSchema = {
    profiles: SEED_PROFILES,
    swipes: {},
    matches: [],
  };
  saveDb(initialData);
}
