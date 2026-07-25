/**
 * Ranthambore Curator — Node.js API regression suite (no Python, keeps backend 100% JS).
 * Run: node /app/backend/tests/api_test.js
 * Focus: httpOnly-cookie admin auth (security fix), all admin GET endpoints,
 *        public booking/inquiry flows, validation & 404 handling.
 */
const fs = require('fs');
const path = require('path');

function readEnv(file, key) {
  const raw = fs.readFileSync(file, 'utf8');
  const m = raw.match(new RegExp(`^${key}=(.*)$`, 'm'));
  return m ? m[1].trim().replace(/^"|"$/g, '') : null;
}

const BASE_URL = (readEnv('/app/frontend/.env', 'REACT_APP_BACKEND_URL') || '').replace(/\/$/, '');
const ADMIN_PIN = readEnv('/app/backend/.env', 'ADMIN_PIN');
if (!BASE_URL) throw new Error('REACT_APP_BACKEND_URL missing from /app/frontend/.env');
if (!ADMIN_PIN) throw new Error('ADMIN_PIN missing from /app/backend/.env');

const API = `${BASE_URL}/api`;
const results = [];
let cookieJar = '';

function record(name, ok, detail) {
  results.push({ name, ok, detail: detail || '' });
  console.log(`${ok ? 'PASS' : 'FAIL'} :: ${name}${detail ? ' :: ' + detail : ''}`);
}

async function check(name, fn) {
  try {
    const detail = await fn();
    record(name, true, detail);
  } catch (e) {
    record(name, false, e.message);
  }
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

async function req(method, url, { body, useCookie = false, headers = {} } = {}) {
  const h = { ...headers };
  if (body) h['Content-Type'] = 'application/json';
  if (useCookie && cookieJar) h['Cookie'] = cookieJar;
  const res = await fetch(url, { method, headers: h, body: body ? JSON.stringify(body) : undefined, redirect: 'manual' });
  let json = null;
  const text = await res.text();
  try { json = JSON.parse(text); } catch { /* non-json */ }
  return { status: res.status, json, text, headers: res.headers };
}

// ---------------- Health / public ----------------
async function run() {
  await check('GET /api/ health', async () => {
    const r = await req('GET', `${API}/`);
    assert(r.status === 200, `status ${r.status}`);
    return JSON.stringify(r.json);
  });

  // ---------------- Admin auth: unauthenticated must be 401 ----------------
  for (const ep of ['/admin/session', '/admin/stats', '/admin/bookings', '/admin/inquiries', '/admin/reviews', '/admin/hotels', '/admin/live-feed']) {
    await check(`GET ${ep} without cookie -> 401`, async () => {
      const r = await req('GET', `${API}${ep}`);
      assert(r.status === 401, `expected 401 got ${r.status}`);
    });
  }

  await check('GET /api/admin/session with stale/forged cookie -> 401', async () => {
    const r = await req('GET', `${API}/admin/session`, { headers: { Cookie: 'rtc_admin_token=00000000' } });
    assert(r.status === 401, `expected 401 got ${r.status}`);
  });

  // ---------------- Login: wrong PIN ----------------
  await check('POST /api/admin/login wrong PIN -> 401, no Set-Cookie', async () => {
    const r = await req('POST', `${API}/admin/login`, { body: { pin: '00000000' } });
    assert(r.status === 401, `expected 401 got ${r.status}`);
    const sc = r.headers.get('set-cookie');
    assert(!sc || !sc.includes('rtc_admin_token='), `unexpected Set-Cookie: ${sc}`);
  });

  await check('POST /api/admin/login malformed body -> 422', async () => {
    const r = await req('POST', `${API}/admin/login`, { body: {} });
    assert(r.status === 422, `expected 422 got ${r.status}`);
  });

  // ---------------- Login: correct PIN, cookie flags ----------------
  await check('POST /api/admin/login sets HttpOnly+Secure+SameSite=Strict cookie, no token in body', async () => {
    const r = await req('POST', `${API}/admin/login`, { body: { pin: ADMIN_PIN } });
    assert(r.status === 200, `status ${r.status} body ${r.text}`);
    assert(r.json && r.json.ok === true, `body not {ok:true}: ${r.text}`);
    assert(!('token' in (r.json || {})), `token leaked in body: ${r.text}`);
    const sc = r.headers.get('set-cookie') || '';
    assert(/rtc_admin_token=/.test(sc), `no rtc_admin_token cookie: ${sc}`);
    assert(/HttpOnly/i.test(sc), `HttpOnly missing: ${sc}`);
    assert(/Secure/i.test(sc), `Secure missing: ${sc}`);
    assert(/SameSite=Strict/i.test(sc), `SameSite=Strict missing: ${sc}`);
    cookieJar = sc.split(';')[0];
    return sc;
  });

  // NEW (iteration 3): cookie value must be an opaque random token, NOT the PIN.
  await check('Admin cookie value is an opaque random token (not the ADMIN_PIN)', async () => {
    const value = cookieJar.split('=')[1] || '';
    assert(value !== ADMIN_PIN, `cookie value IS the raw ADMIN_PIN: ${value}`);
    assert(!value.includes(ADMIN_PIN), `cookie value contains the ADMIN_PIN: ${value}`);
    assert(/^[0-9a-f]{32,}$/i.test(value), `cookie value is not a long random hex token: ${value}`);
    return `len=${value.length}`;
  });

  await check('Two logins issue different opaque tokens', async () => {
    const r = await req('POST', `${API}/admin/login`, { body: { pin: ADMIN_PIN } });
    assert(r.status === 200, `status ${r.status} body ${r.text}`);
    const other = (r.headers.get('set-cookie') || '').split(';')[0];
    assert(other && other !== cookieJar, `tokens identical across logins: ${other}`);
    return 'distinct tokens';
  });

  await check('Raw ADMIN_PIN as cookie value is rejected -> 401', async () => {
    const r = await req('GET', `${API}/admin/session`, { headers: { Cookie: `rtc_admin_token=${ADMIN_PIN}` } });
    assert(r.status === 401, `status ${r.status} (PIN-as-cookie still authenticates!)`);
  });

  await check('GET /api/admin/session with cookie -> 200 {ok:true} and slides cookie', async () => {
    const r = await req('GET', `${API}/admin/session`, { useCookie: true });
    assert(r.status === 200, `status ${r.status}`);
    assert(r.json && r.json.ok === true, `body ${r.text}`);
    const sc = r.headers.get('set-cookie') || '';
    assert(/rtc_admin_token=/.test(sc), 'sliding session cookie not refreshed');
  });

  // ---------------- Authenticated admin GETs ----------------
  const adminGets = [
    ['/admin/stats', (j) => assert(typeof j === 'object' && j !== null, 'stats not object')],
    ['/admin/bookings', (j) => assert(Array.isArray(j), 'bookings not array')],
    ['/admin/inquiries', (j) => assert(Array.isArray(j), 'inquiries not array')],
    ['/admin/reviews', (j) => assert(Array.isArray(j), 'reviews not array')],
    ['/admin/hotels', (j) => assert(Array.isArray(j), 'hotels not array')],
    ['/admin/live-feed', (j) => assert(j !== null, 'live-feed empty')],
  ];
  for (const [ep, validate] of adminGets) {
    await check(`GET ${ep} with cookie -> 200`, async () => {
      const r = await req('GET', `${API}${ep}`, { useCookie: true });
      assert(r.status === 200, `status ${r.status} body ${r.text.slice(0, 200)}`);
      validate(r.json);
      assert(!/"_id"/.test(r.text), 'MongoDB _id leaked in response');
      return Array.isArray(r.json) ? `${r.json.length} rows` : 'ok';
    });
  }

  // ---------------- Public flows ----------------
  let bookingRef = null;
  await check('POST /api/bookings (public) -> 200 with booking_ref', async () => {
    const r = await req('POST', `${API}/bookings`, {
      body: {
        date: '2026-12-01', shift: 'morning', vehicle: 'Gypsy', guests: 2,
        full_name: 'TEST_QA Cookie', email: 'qa-test@example.com', whatsapp: '9999999999'
      }
    });
    assert(r.status === 200 || r.status === 201, `status ${r.status} body ${r.text.slice(0, 300)}`);
    bookingRef = (r.json && (r.json.booking_ref || r.json.ref)) || null;
    assert(bookingRef, `no booking_ref in ${r.text.slice(0, 200)}`);
    return bookingRef;
  });

  await check('New booking is visible in GET /api/admin/bookings', async () => {
    const r = await req('GET', `${API}/admin/bookings`, { useCookie: true });
    assert(r.status === 200, `status ${r.status}`);
    assert(r.json.some((b) => b.ref === bookingRef || b.booking_ref === bookingRef), `booking ${bookingRef} not persisted`);
  });

  await check('POST /api/inquiries (public) -> success', async () => {
    const r = await req('POST', `${API}/inquiries`, {
      body: { name: 'TEST_QA Cookie', email: 'qa-test@example.com', phone: '9999999999', type: 'contact', message: 'TEST_ automated regression' }
    });
    assert(r.status === 200 || r.status === 201, `status ${r.status} body ${r.text.slice(0, 300)}`);
    return JSON.stringify(r.json).slice(0, 120);
  });

  await check('POST /api/bookings validation error -> 422', async () => {
    const r = await req('POST', `${API}/bookings`, { body: { name: '' } });
    assert(r.status === 422, `expected 422 got ${r.status}`);
  });

  for (const ep of ['/reviews', '/hotels', '/images']) {
    await check(`GET ${ep} (public) -> 200`, async () => {
      const r = await req('GET', `${API}${ep}`);
      assert(r.status === 200, `status ${r.status}`);
      assert(!/"_id"/.test(r.text), 'MongoDB _id leaked');
    });
  }

  // ---------------- Logout ----------------
  await check('POST /api/admin/logout clears cookie', async () => {
    const r = await req('POST', `${API}/admin/logout`, { useCookie: true });
    assert(r.status === 200, `status ${r.status}`);
    const sc = r.headers.get('set-cookie') || '';
    assert(/rtc_admin_token=;/.test(sc) || /Expires=Thu, 01 Jan 1970/i.test(sc), `cookie not cleared: ${sc}`);
    return sc;
  });

  await check('Replaying the OLD cookie after logout -> 401 (server-side invalidation)', async () => {
    const r = await req('GET', `${API}/admin/session`, { useCookie: true });
    assert(r.status === 401, `status ${r.status} - old cookie still authenticates after logout`);
  });

  await check('Old cookie also rejected on a data endpoint after logout -> 401', async () => {
    const r = await req('GET', `${API}/admin/bookings`, { useCookie: true });
    assert(r.status === 401, `status ${r.status}`);
  });

  // ---------------- CORS allowlist (hit Express directly, bypass ingress) ----------------
  const DIRECT = 'http://localhost:8001/api';
  await check('CORS: attacker origin is NOT reflected (direct to Express)', async () => {
    const r = await req('GET', `${DIRECT}/`, { headers: { Origin: 'https://evil.example.com' } });
    const acao = r.headers.get('access-control-allow-origin');
    assert(acao !== 'https://evil.example.com', `attacker origin reflected: ${acao}`);
    assert(acao !== '*', `wildcard ACAO with credentials: ${acao}`);
    return `ACAO=${acao}`;
  });

  await check('CORS: configured origin IS allowed with credentials (direct to Express)', async () => {
    const r = await req('GET', `${DIRECT}/`, { headers: { Origin: BASE_URL } });
    const acao = r.headers.get('access-control-allow-origin');
    const acac = r.headers.get('access-control-allow-credentials');
    assert(acao === BASE_URL, `expected ${BASE_URL}, got ${acao}`);
    assert(acac === 'true', `allow-credentials=${acac}`);
    return `ACAO=${acao}`;
  });

  await check('CORS: preflight from attacker origin not approved (direct to Express)', async () => {
    const r = await req('OPTIONS', `${DIRECT}/admin/login`, {
      headers: { Origin: 'https://evil.example.com', 'Access-Control-Request-Method': 'POST' }
    });
    const acao = r.headers.get('access-control-allow-origin');
    assert(acao !== 'https://evil.example.com' && acao !== '*', `preflight reflected: ${acao}`);
    return `status ${r.status} ACAO=${acao}`;
  });

  // ---------------- No Python in backend ----------------
  await check('No .py files under /app/backend', async () => {
    const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
      if (d.name === 'node_modules') return [];
      const p = path.join(dir, d.name);
      return d.isDirectory() ? walk(p) : (p.endsWith('.py') ? [p] : []);
    });
    const py = walk('/app/backend');
    assert(py.length === 0, `python files found: ${py.join(', ')}`);
  });

  const passed = results.filter((r) => r.ok).length;
  console.log(`\n===== ${passed}/${results.length} passed =====`);
  fs.mkdirSync('/app/test_reports/pytest', { recursive: true });
  fs.writeFileSync('/app/test_reports/pytest/node_api_results.json', JSON.stringify(results, null, 2));
  if (passed !== results.length) process.exitCode = 1;
}

run();
