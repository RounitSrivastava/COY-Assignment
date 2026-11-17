const fs = require('fs');
const path = require('path');

console.log('🧪 Starting direct backend logic test...\n');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_PATH = path.join(DATA_DIR, 'db.json');

// Ensure db exists
if (!fs.existsSync(DB_PATH)) {
  console.log('DB path does not exist yet.');
}

// Read seed profiles directly from TypeScript file via simple regex parse or raw file check
const seedContent = fs.readFileSync(path.join(__dirname, '..', 'lib', 'seedData.ts'), 'utf-8');
const idMatches = seedContent.match(/id:\s*'(prof_\d+)'/g);
console.log(`✅ Seed profiles in code: ${idMatches ? idMatches.length : 0} profiles found (Requirement: >= 30)`);

if (!idMatches || idMatches.length < 30) {
  throw new Error(`Expected at least 30 seeded profiles, found ${idMatches?.length}`);
}

const mutualCandidates = seedContent.match(/hasLikedCurrentUser:\s*true/g);
console.log(`✅ Seed profiles pre-configured to match on like: ${mutualCandidates ? mutualCandidates.length : 0} candidates`);
if (!mutualCandidates || mutualCandidates.length < 5) {
  throw new Error('Expected at least 5 profiles with hasLikedCurrentUser = true');
}

console.log('\n🎉 Seed configuration verification completed successfully!');
