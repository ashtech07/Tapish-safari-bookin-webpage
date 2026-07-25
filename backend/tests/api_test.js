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

  await check('GET /api/admin/session after logout with old cookie value', async () => {
    // The old cookie string is still a valid credential unless server-side
    // invalidation exists — documents current behaviour.
    const r = await req('GET', `${API}/admin/session`, { useCookie: true });
    return `status ${r.status} (browser would have discarded the cookie)`;
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
