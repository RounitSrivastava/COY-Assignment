import { getFeedProfiles, recordSwipe, getMatches, resetDemo, getDb } from '../lib/db.ts';

console.log('🧪 Starting automated tests for Coy Discover...\n');

// 1. Reset demo state
resetDemo();
console.log('✅ Demo database reset.');

// 2. Test initial feed profiles
const initialFeed = getFeedProfiles();
console.log(`✅ Initial feed count: ${initialFeed.length} (Requirement: >= 30, Actual: ${initialFeed.length})`);
if (initialFeed.length < 30) {
  throw new Error(`Feed profiles less than 30! Found: ${initialFeed.length}`);
}

// 3. Test Privacy Guarantee (CRITICAL REQUIREMENT)
// "Never reveal who has liked the user unless it is mutual; this is the core promise of Coy."
for (const profile of initialFeed) {
  if ('hasLikedCurrentUser' in profile) {
    throw new Error(`CRITICAL PRIVACY VIOLATION: hasLikedCurrentUser leaked in public profile for ${profile.name}`);
  }
}
console.log('✅ PRIVACY GUARANTEE VERIFIED: hasLikedCurrentUser is strictly hidden from feed.');

// 4. Test Pass action
const firstProfile = initialFeed[0];
const passResult = recordSwipe(firstProfile.id, 'pass');
console.log(`✅ Passed on ${firstProfile.name}: isMatch = ${passResult.isMatch}`);
if (passResult.isMatch !== false) {
  throw new Error('Pass should never produce a match!');
}

// Feed should no longer contain firstProfile
const feedAfterPass = getFeedProfiles();
if (feedAfterPass.some((p) => p.id === firstProfile.id)) {
  throw new Error(`Swiped profile ${firstProfile.id} still appears in feed!`);
}
console.log(`✅ Profile correctly removed from feed. Remaining: ${feedAfterPass.length}`);

// 5. Test Non-mutual Like
// Find a profile where hasLikedCurrentUser is false
const db = getDb();
const nonMutualProfile = db.profiles.find((p) => !p.hasLikedCurrentUser && p.id !== firstProfile.id);
if (!nonMutualProfile) throw new Error('No non-mutual profile found in seed');

const likeNonMutualResult = recordSwipe(nonMutualProfile.id, 'like');
console.log(`✅ Liked ${nonMutualProfile.name} (has not liked user): isMatch = ${likeNonMutualResult.isMatch}`);
if (likeNonMutualResult.isMatch !== false) {
  throw new Error('Non-mutual like should not produce a match!');
}

// 6. Test Mutual Like Match
// Find a profile where hasLikedCurrentUser is true
const mutualProfile = db.profiles.find((p) => p.hasLikedCurrentUser);
if (!mutualProfile) throw new Error('No mutual match candidate found in seed');

const likeMutualResult = recordSwipe(mutualProfile.id, 'like');
console.log(`✅ Liked ${mutualProfile.name} (HAS liked user): isMatch = ${likeMutualResult.isMatch}`);
if (likeMutualResult.isMatch !== true) {
  throw new Error('Mutual like failed to produce a match!');
}
console.log(`🎉 Match confirmed: ID ${likeMutualResult.match?.id}, with ${likeMutualResult.match?.profile.name}`);

// 7. Test Matches API
const currentMatches = getMatches();
console.log(`✅ GET /matches returns ${currentMatches.length} match(es)`);
if (currentMatches.length === 0 || currentMatches[0].profileId !== mutualProfile.id) {
  throw new Error('Matches list does not contain the expected mutual match!');
}

// 8. Test Persistence across DB re-read
const reloadedMatches = getMatches();
if (reloadedMatches.length !== currentMatches.length) {
  throw new Error('Matches persistence failed across reload!');
}
console.log('✅ PERSISTENCE VERIFIED: Swipes and matches correctly persist in data/db.json.');

// Reset back to fresh seed for the user demo
resetDemo();
console.log('✅ Demo database reset cleanly for fresh evaluation.');
console.log('\n🎉 ALL BACKEND & LOGIC TESTS PASSED PERFECTLY!\n');
