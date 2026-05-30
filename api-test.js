// End-to-end API smoke test for Focus-Learn
// Run: node api-test.js
const BASE = 'http://localhost:5000/api/v1';

let pass = 0, fail = 0;
const results = [];

function record(name, ok, info = '') {
  if (ok) { pass++; results.push(`PASS  ${name} ${info}`); }
  else    { fail++; results.push(`FAIL  ${name} ${info}`); }
}

async function req(method, path, { token, body } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(BASE + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  let data = null;
  const text = await res.text();
  try { data = JSON.parse(text); } catch { data = text; }
  return { status: res.status, data };
}

async function reqRoot(method, url) {
  const res = await fetch(url, { method });
  return { status: res.status, text: await res.text() };
}

(async () => {
  console.log('=== Focus-Learn API smoke test ===\n');

  // 1. Health
  const health = await reqRoot('GET', 'http://localhost:5000/');
  record('GET / (health)', health.status === 200, `status=${health.status}`);

  // 2. Auth - register two users (random emails)
  const stamp = Date.now();
  const userA = { username: `userA_${stamp}`, email: `a_${stamp}@test.com`, password: 'pass1234' };
  const userB = { username: `userB_${stamp}`, email: `b_${stamp}@test.com`, password: 'pass1234' };

  const rA = await req('POST', '/users/register', { body: userA });
  record('POST /users/register (A)', rA.status === 201, `status=${rA.status} body=${JSON.stringify(rA.data)}`);
  const rB = await req('POST', '/users/register', { body: userB });
  record('POST /users/register (B)', rB.status === 201, `status=${rB.status}`);

  // Duplicate register should fail with 400
  const rDup = await req('POST', '/users/register', { body: userA });
  record('POST /users/register duplicate -> 400', rDup.status === 400, `status=${rDup.status}`);

  // 3. Login
  const lA = await req('POST', '/users/login', { body: { email: userA.email, password: userA.password } });
  record('POST /users/login (A)', lA.status === 200 && lA.data.token, `status=${lA.status}`);
  const tokenA = lA.data.token;

  const lB = await req('POST', '/users/login', { body: { email: userB.email, password: userB.password } });
  record('POST /users/login (B)', lB.status === 200 && lB.data.token, `status=${lB.status}`);
  const tokenB = lB.data.token;

  // Wrong password
  const lBad = await req('POST', '/users/login', { body: { email: userA.email, password: 'wrong' } });
  record('POST /users/login wrong pwd -> 400', lBad.status === 400, `status=${lBad.status}`);

  // 4. Auth protection - profile without token
  const profNoAuth = await req('GET', '/users/profile');
  record('GET /users/profile no token -> 401', profNoAuth.status === 401, `status=${profNoAuth.status}`);

  // Profile with token
  const prof = await req('GET', '/users/profile', { token: tokenA });
  record('GET /users/profile (A)', prof.status === 200 && prof.data.email === userA.email, `status=${prof.status}`);

  // 5. Public users route should be disabled
  const usersList = await req('GET', '/users/');
  record('GET /users/ (was removed) -> 404', usersList.status === 404, `status=${usersList.status}`);

  // 6. Journeys CRUD - user A creates a public journey
  const jCreate = await req('POST', '/journeys', {
    token: tokenA,
    body: { title: 'Journey A1', description: 'A1 desc', is_public: true },
  });
  record('POST /journeys (A, public)', jCreate.status === 201 && jCreate.data.id, `status=${jCreate.status}`);
  const journeyId = jCreate.data.id;

  // Private journey by A
  const jPriv = await req('POST', '/journeys', {
    token: tokenA,
    body: { title: 'A Private', description: 'private', is_public: false },
  });
  record('POST /journeys (A, private)', jPriv.status === 201, `status=${jPriv.status}`);
  const privJourneyId = jPriv.data.id;

  // List A's journeys
  const jList = await req('GET', '/journeys', { token: tokenA });
  record('GET /journeys (A)', jList.status === 200 && Array.isArray(jList.data) && jList.data.length >= 2, `count=${jList.data?.length}`);

  // Get journey by id (A)
  const jGet = await req('GET', `/journeys/${journeyId}`, { token: tokenA });
  record('GET /journeys/:id (A own)', jGet.status === 200 && jGet.data.id === journeyId, `status=${jGet.status}`);

  // IDOR check: B tries to read A's private journey -> should 404
  const jIdor = await req('GET', `/journeys/${privJourneyId}`, { token: tokenB });
  record('GET /journeys/:id IDOR (B reading A private) -> 404', jIdor.status === 404, `status=${jIdor.status}`);

  // B can read A's public journey
  const jPubByB = await req('GET', `/journeys/${journeyId}`, { token: tokenB });
  record('GET /journeys/:id (B reading A public)', jPubByB.status === 200, `status=${jPubByB.status}`);

  // Update journey (A)
  const jUpd = await req('PUT', `/journeys/${journeyId}`, {
    token: tokenA,
    body: { title: 'Journey A1 updated', description: 'A1 desc updated', is_public: true },
  });
  record('PUT /journeys/:id (A)', jUpd.status === 200, `status=${jUpd.status}`);

  // 7. Public journeys
  const pub = await req('GET', '/journeys/public');
  record('GET /journeys/public', pub.status === 200 && Array.isArray(pub.data), `count=${pub.data?.length}`);

  // 8. Fork: B forks A's public journey
  const fork = await req('POST', `/journeys/${journeyId}/fork`, { token: tokenB });
  record('POST /journeys/:id/fork (B forks A public)', fork.status === 201 && fork.data.journeyId, `status=${fork.status}`);

  // B tries to fork A's PRIVATE journey -> should fail (500 from our model error)
  const forkPriv = await req('POST', `/journeys/${privJourneyId}/fork`, { token: tokenB });
  record('POST /journeys/:id/fork private -> error', forkPriv.status >= 400, `status=${forkPriv.status}`);

  // 9. Chapters - create under A's public journey
  const cCreate = await req('POST', `/journeys/${journeyId}/chapters`, {
    token: tokenA,
    body: { title: 'Chapter 1', description: 'c1', video_link: 'https://www.youtube.com/watch?v=abc', chapter_no: 1 },
  });
  record('POST /journeys/:jid/chapters', cCreate.status === 201, `status=${cCreate.status}`);
  const chapterId = cCreate.data.id;

  // List chapters
  const cList = await req('GET', `/journeys/${journeyId}/chapters`, { token: tokenA });
  record('GET /journeys/:jid/chapters', cList.status === 200 && Array.isArray(cList.data), `count=${cList.data?.length}`);

  // Get chapter by id
  const cGet = await req('GET', `/journeys/chapters/${chapterId}`, { token: tokenA });
  record('GET /journeys/chapters/:id', cGet.status === 200 && cGet.data.id === chapterId, `status=${cGet.status}`);

  // Update chapter
  const cUpd = await req('PUT', `/journeys/chapters/${chapterId}`, {
    token: tokenA,
    body: { title: 'Chapter 1 updated', description: 'c1u', video_link: 'https://www.youtube.com/watch?v=abc', chapter_no: 1 },
  });
  record('PUT /journeys/chapters/:id', cUpd.status === 200, `status=${cUpd.status}`);

  // Mark complete
  const cComp = await req('PUT', `/journeys/chapters/isComplete/${chapterId}`, {
    token: tokenA,
    body: { is_completed: true },
  });
  record('PUT /journeys/chapters/isComplete/:id', cComp.status === 200, `status=${cComp.status}`);

  // 10. Notes
  const nCreate = await req('POST', `/journeys/${journeyId}/chapters/${chapterId}/notes`, {
    token: tokenA,
    body: { content: 'first note' },
  });
  record('POST notes create', nCreate.status === 201 && nCreate.data.noteId, `status=${nCreate.status}`);
  const noteId = nCreate.data.noteId;

  const nByCh = await req('GET', `/chapters/${chapterId}/notes`, { token: tokenA });
  record('GET notes by chapter', nByCh.status === 200 && Array.isArray(nByCh.data) && nByCh.data.length >= 1, `count=${nByCh.data?.length}`);

  const nByJ = await req('GET', `/journeys/${journeyId}/notes`, { token: tokenA });
  record('GET notes by journey', nByJ.status === 200, `count=${nByJ.data?.length}`);

  const nGet = await req('GET', `/notes/${noteId}`, { token: tokenA });
  record('GET /notes/:id', nGet.status === 200 && nGet.data.id === noteId, `status=${nGet.status}`);

  const nUpd = await req('PUT', `/notes/${noteId}`, { token: tokenA, body: { content: 'updated note' } });
  record('PUT /notes/:id', nUpd.status === 200, `status=${nUpd.status}`);

  const nDel = await req('DELETE', `/notes/${noteId}`, { token: tokenA });
  record('DELETE /notes/:id', nDel.status === 200, `status=${nDel.status}`);

  // 11. Cleanup: delete chapter then journey (A)
  const cDel = await req('DELETE', `/journeys/chapters/${chapterId}`, { token: tokenA });
  record('DELETE /journeys/chapters/:id', cDel.status === 200, `status=${cDel.status}`);

  const jDel = await req('DELETE', `/journeys/${journeyId}`, { token: tokenA });
  record('DELETE /journeys/:id', jDel.status === 200, `status=${jDel.status}`);

  const jDelPriv = await req('DELETE', `/journeys/${privJourneyId}`, { token: tokenA });
  record('DELETE /journeys/:id (private)', jDelPriv.status === 200, `status=${jDelPriv.status}`);

  // 12. Playlist endpoint - expect 400 because YT_KEY is placeholder
  const pl = await req('POST', '/journeys/playlist', {
    token: tokenA,
    body: { playlistId: 'PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf', is_public: true },
  });
  record('POST /journeys/playlist (YT_KEY unset -> 400 expected)', pl.status === 400, `status=${pl.status} body=${JSON.stringify(pl.data)}`);

  // ---- Summary ----
  console.log(results.join('\n'));
  console.log(`\n=== SUMMARY: ${pass} passed, ${fail} failed ===`);
  process.exit(fail === 0 ? 0 : 1);
})().catch(e => {
  console.error('Test runner crashed:', e);
  process.exit(2);
});
