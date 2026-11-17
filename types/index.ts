export interface Profile {
  id: string;
  name: string;
  age: number;
  photo: string;
  bio: string;
  cityOrCollege: string;
  interests: string[];
  hasLikedCurrentUser: boolean; // Kept strictly internal on server
}

export type PublicProfile = Omit<Profile, 'hasLikedCurrentUser'>;

export type SwipeAction = 'like' | 'pass';

export interface SwipeRecord {
  profileId: string;
  action: SwipeAction;
  timestamp: string;
}

export interface MatchRecord {
  id: string;
  profileId: string;
  profile: PublicProfile;
  matchedAt: string;
}

export interface SwipeResponse {
  success: boolean;
  action: SwipeAction;
  isMatch: boolean;
  match?: MatchRecord;
  message?: string;
}

export interface FeedResponse {
  profiles: PublicProfile[];
  totalRemaining: number;
}

export interface MatchesResponse {
  matches: MatchRecord[];
  totalCount: number;
}
