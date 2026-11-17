const http = require('http');

async function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port: 3000,
        path,
        method: options.method || 'GET',
        headers: options.headers || {},
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            resolve({
              statusCode: res.statusCode,
              headers: res.headers,
              body: data ? JSON.parse(data) : null,
              rawBody: data,
            });
          } catch {
            resolve({
              statusCode: res.statusCode,
              headers: res.headers,
              body: null,
              rawBody: data,
            });
          }
        });
      }
    );
    req.on('error', reject);
    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

async function run() {
  console.log('Testing endpoints...\n');

  // Test 1: Reset DB
  console.log('1. Calling POST /api/reset...');
  const resetRes = await request('/api/reset', { method: 'POST' });
  console.log('Status:', resetRes.statusCode, resetRes.body);

  // Test 2: GET /feed
  console.log('\n2. Calling GET /feed (testing rewrite & direct route)...');
  const feedRes = await request('/feed');
  console.log('Status:', feedRes.statusCode);
  console.log('Profiles returned:', feedRes.body?.profiles?.length);
  if (feedRes.body?.profiles?.length < 30) {
    throw new Error('Expected >= 30 profiles in feed');
  }

  // Check privacy
  const sample = feedRes.body.profiles[0];
  console.log('Sample profile fields:', Object.keys(sample));
  if ('hasLikedCurrentUser' in sample) {
    throw new Error('Privacy breach! hasLikedCurrentUser present in feed output');
  }
  console.log('✅ Privacy verified: hasLikedCurrentUser NOT leaked in public feed.');

  // Test 3: POST /swipe with PASS
  console.log('\n3. Calling POST /swipe (Action: pass on prof_01)...');
  const passRes = await request('/swipe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: { profileId: 'prof_01', action: 'pass' },
  });
  console.log('Status:', passRes.statusCode, passRes.body);
  if (passRes.body?.isMatch !== false) {
    throw new Error('Pass should not be a match');
  }

  // Test 4: Verify prof_01 never appears again in GET /feed
  console.log('\n4. Checking GET /feed to verify swiped profile never appears again...');
  const feedAfterPass = await request('/feed');
  const foundProf1 = feedAfterPass.body?.profiles?.some((p) => p.id === 'prof_01');
  if (foundProf1) {
    throw new Error('Profile prof_01 was swiped on but still in feed!');
  }
  console.log('✅ Verified: prof_01 successfully excluded from subsequent feed.');

  // Test 5: POST /swipe with LIKE on mutual match candidate (prof_02)
  console.log('\n5. Calling POST /swipe (Action: like on prof_02 - mutual match candidate)...');
  const likeRes = await request('/swipe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: { profileId: 'prof_02', action: 'like' },
  });
  console.log('Status:', likeRes.statusCode, likeRes.body);
  if (likeRes.body?.isMatch !== true) {
    throw new Error('prof_02 should have produced a mutual match!');
  }
  console.log(`🎉 Match confirmed: ${likeRes.body.match?.profile?.name}`);

  // Test 6: GET /matches
  console.log('\n6. Calling GET /matches...');
  const matchesRes = await request('/matches');
  console.log('Status:', matchesRes.statusCode);
  console.log('Matches count:', matchesRes.body?.matches?.length);
  const matched = matchesRes.body?.matches?.find((m) => m.profileId === 'prof_02');
  if (!matched) {
    throw new Error('Expected prof_02 in matches list');
  }
  console.log('✅ GET /matches successfully returned mutual match:', matched.profile.name);

  // Test 7: Clean reset for user
  console.log('\n7. Final cleanup: Resetting demo state...');
  await request('/api/reset', { method: 'POST' });
  const finalFeed = await request('/feed');
  console.log('Final feed reset count:', finalFeed.body?.profiles?.length);
  console.log('\n🌟 ALL 7 INTEGRATION & ENDPOINT CHECKS PASSED PERFECTLY!');
}

run().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
