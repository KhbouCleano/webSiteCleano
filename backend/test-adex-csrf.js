'use strict';
// backend/test-adex-csrf.js
// node test-adex-csrf.js

const https = require('https');

const ADEX_HOST = 'my.adex.tn';
const ADEX_USER = '55777400';
const ADEX_PWD  = '2026';

// ── Helper GET ────────────────────────────────────────────────
function httpsGet(path, headers = {}) {
  return new Promise((resolve, reject) => {
    const options = { hostname: ADEX_HOST, path, method: 'GET', headers };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    });
    req.on('error', reject);
    req.end();
  });
}

// ── Helper POST ───────────────────────────────────────────────
function httpsPost(path, body, headers = {}) {
  return new Promise((resolve, reject) => {
    const buf = Buffer.from(body, 'utf8');
    const options = {
      hostname: ADEX_HOST, path, method: 'POST',
      headers: { 'Content-Length': buf.length, ...headers },
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    });
    req.on('error', reject);
    req.write(buf);
    req.end();
  });
}

// ── Extraire CSRF token depuis HTML ──────────────────────────
function extractCsrf(html) {
  const m = html.match(/name=['"_]token['"]\s+(?:value|content)=['"]([\w+/=]+)['"]/i)
         || html.match(/meta\s+name=['""]csrf-token['""\s]+content=['"]([\w+/=]+)['"]/i)
         || html.match(/"_token"\s*:\s*"([^"]+)"/i)
         || html.match(/csrf[_-]token['"]*\s*[:=]\s*['"]([\w+/=]+)['"]/i);
  return m ? m[1] : null;
}

// ── Extraire cookies ──────────────────────────────────────────
function parseCookies(setCookieHeader) {
  if (!setCookieHeader) return '';
  const cookies = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];
  return cookies.map(c => c.split(';')[0]).join('; ');
}

async function main() {
  console.log('🔍 Test ADEX avec CSRF token\n');

  // Étape 1 : récupérer la page de login pour avoir le CSRF + session cookie
  console.log('1. GET /login → récupération CSRF + cookie session...');
  const loginPage = await httpsGet('/login');
  const cookie = parseCookies(loginPage.headers['set-cookie']);
  const csrfLogin = extractCsrf(loginPage.body);
  console.log(`   Status: ${loginPage.status}`);
  console.log(`   Cookie: ${cookie.slice(0, 80)}...`);
  console.log(`   CSRF:   ${csrfLogin ?? 'non trouvé'}`);

  if (!cookie) { console.log('❌ Pas de cookie — arrêt'); return; }

  // Étape 2 : se connecter
  console.log('\n2. POST /login → authentification...');
  const loginBody = `_token=${csrfLogin ?? ''}&login=${ADEX_USER}&password=${ADEX_PWD}&remember=1`;
  const loginRes = await httpsPost('/login', loginBody, {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Cookie': cookie,
    'Referer': `https://${ADEX_HOST}/login`,
    'User-Agent': 'Mozilla/5.0',
  });
  console.log(`   Status: ${loginRes.status}`);
  const sessionCookie = parseCookies(loginRes.headers['set-cookie']) || cookie;
  console.log(`   Redirect: ${loginRes.headers['location'] ?? 'aucune'}`);
  console.log(`   Session cookie: ${sessionCookie.slice(0, 80)}...`);

  // Étape 3 : récupérer le token CSRF pour l'API
  console.log('\n3. GET /adexapi/csrf-token ou /sanctum/csrf-cookie...');
  const csrfRes = await httpsGet('/sanctum/csrf-cookie', {
    'Cookie': sessionCookie,
    'User-Agent': 'Mozilla/5.0',
  });
  console.log(`   Status: ${csrfRes.status}`);
  const csrfCookie = parseCookies(csrfRes.headers['set-cookie']);
  const allCookies = sessionCookie + '; ' + csrfCookie;
  const xsrfToken = csrfRes.headers['set-cookie']
    ?.find(c => c.startsWith('XSRF-TOKEN='))
    ?.split(';')[0]?.replace('XSRF-TOKEN=', '')
    ?.replace(/%3D/g, '=');
  console.log(`   XSRF-TOKEN: ${xsrfToken ?? 'non trouvé'}`);

  // Étape 4 : appel API Add_colis avec auth
  console.log('\n4. POST /adexapi/Add_colis avec session + XSRF...');
  const apiPayload = JSON.stringify({
    nom_cli: 'Test Client', ville_cli: '23',
    ContenuColis: 'Test produit', nbr_colis: 1,
    type_colis_tab: '0', adr_cli: '12 Rue Tunis',
    tel_cli: '98000000', tel_cli2: '', tel_cli3: '',
    ttc_cmd: 25.000, echange_cmd: 0,
    ancienne_commande_echange: '', produit_arecevoir: '',
    commentaire_cmd: 'Test', code_barres_ext: 'TEST-001', fragile: 0,
  });

  const apiRes = await httpsPost('/adexapi/Add_colis', apiPayload, {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Cookie': allCookies,
    'X-XSRF-TOKEN': xsrfToken ?? '',
    'USER': ADEX_USER,
    'PWD':  ADEX_PWD,
    'Referer': `https://${ADEX_HOST}/colis/create`,
    'User-Agent': 'Mozilla/5.0',
  });
  console.log(`   Status: ${apiRes.status}`);
  console.log(`   Response: ${apiRes.body.slice(0, 500)}`);
}

main().catch(console.error);
