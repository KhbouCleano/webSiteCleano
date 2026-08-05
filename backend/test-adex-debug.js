'use strict';
// backend/test-adex-debug.js
// node test-adex-debug.js

const https = require('https');

const ADEX_HOST = 'my.adex.tn';
const ADEX_USER = '55777400';
const ADEX_PWD  = '2026';

function req(method, path, body, headers) {
  return new Promise((resolve) => {
    const buf = body ? Buffer.from(body, 'utf8') : null;
    const opts = {
      hostname: ADEX_HOST, path, method,
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', ...headers,
        ...(buf ? { 'Content-Length': buf.length } : {}) },
    };
    const r = https.request(opts, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: d }));
    });
    r.on('error', e => resolve({ status: 0, headers: {}, body: e.message }));
    if (buf) r.write(buf);
    r.end();
  });
}

// Extraire tous les cookies comme objet
function parseCookiesObj(setCookieHeader) {
  if (!setCookieHeader) return {};
  const cookies = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];
  const obj = {};
  for (const c of cookies) {
    const [kv] = c.split(';');
    const idx  = kv.indexOf('=');
    const k    = kv.slice(0, idx).trim();
    const v    = kv.slice(idx + 1).trim();
    obj[k] = v;
  }
  return obj;
}

function cookiesToString(obj) {
  return Object.entries(obj).map(([k,v]) => `${k}=${v}`).join('; ');
}

// Décoder le XSRF-TOKEN (URL-encoded base64)
function decodeXsrf(token) {
  return decodeURIComponent(token);
}

async function main() {
  console.log('🔐 ADEX Login + API test\n');

  // ── Étape 1 : GET /login ─────────────────────────────────
  console.log('── Étape 1 : GET /login');
  const lp = await req('GET', '/login', null, {});
  let cookies = parseCookiesObj(lp.headers['set-cookie']);
  console.log(`   Status: ${lp.status}`);
  console.log(`   Cookies reçus:`, Object.keys(cookies));

  // Le CSRF vient du cookie XSRF-TOKEN
  const xsrfRaw = cookies['XSRF-TOKEN'];
  const xsrfDecoded = xsrfRaw ? decodeXsrf(xsrfRaw) : null;
  console.log(`   XSRF-TOKEN: ${xsrfDecoded?.slice(0, 40)}...`);

  // ── Étape 2 : POST /login ─────────────────────────────────
  console.log('\n── Étape 2 : POST /login');
  const loginBody = `_token=${encodeURIComponent(xsrfDecoded ?? '')}&login=${ADEX_USER}&password=${ADEX_PWD}&remember=1`;
  const lr = await req('POST', '/login', loginBody, {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Cookie': cookiesToString(cookies),
    'Referer': `https://${ADEX_HOST}/login`,
    'X-XSRF-TOKEN': xsrfDecoded ?? '',
    'Accept': 'text/html,application/xhtml+xml',
  });
  console.log(`   Status: ${lr.status}`);
  console.log(`   Location: ${lr.headers.location ?? 'aucune'}`);

  // Fusionner les nouveaux cookies
  const newCookies = parseCookiesObj(lr.headers['set-cookie']);
  cookies = { ...cookies, ...newCookies };
  console.log(`   Cookies après login:`, Object.keys(cookies));

  if (lr.status !== 302 && lr.status !== 200) {
    console.log(`   ❌ Login échoué (${lr.status})`);
    console.log(`   Body: ${lr.body.slice(0, 300)}`);
    return;
  }

  // ── Étape 3 : GET /dashboard ou redirect ──────────────────
  const redirectTo = lr.headers.location ?? '/dashboard';
  console.log(`\n── Étape 3 : GET ${redirectTo}`);
  const dp = await req('GET', redirectTo, null, {
    'Cookie': cookiesToString(cookies),
    'Referer': `https://${ADEX_HOST}/login`,
  });
  console.log(`   Status: ${dp.status}`);
  const newCookies2 = parseCookiesObj(dp.headers['set-cookie']);
  cookies = { ...cookies, ...newCookies2 };

  // Nouveau XSRF après login
  const xsrfAuth = cookies['XSRF-TOKEN'] ? decodeXsrf(cookies['XSRF-TOKEN']) : xsrfDecoded;
  console.log(`   XSRF après login: ${xsrfAuth?.slice(0, 40)}...`);

  // ── Étape 4 : GET /colis/create ──────────────────────────
  console.log('\n── Étape 4 : GET /colis/create');
  const cp = await req('GET', '/colis/create', null, {
    'Cookie': cookiesToString(cookies),
    'Referer': `https://${ADEX_HOST}/dashboard`,
  });
  console.log(`   Status: ${cp.status}`);
  const newCookies3 = parseCookiesObj(cp.headers['set-cookie']);
  cookies = { ...cookies, ...newCookies3 };
  const xsrfFinal = cookies['XSRF-TOKEN'] ? decodeXsrf(cookies['XSRF-TOKEN']) : xsrfAuth;

  // ── Étape 5 : POST /colis ────────────────────────────────
  console.log('\n── Étape 5 : POST /colis (formulaire web)');
  const colisBody = [
    `_token=${encodeURIComponent(xsrfFinal ?? '')}`,
    `nom_cli=Test+API`, `tel_cli=98000000`, `tel_cli2=`, `tel_cli3=`,
    `ville_cli=23`, `adr_cli=12+Rue+Tunis`,
    `ContenuColis=Test+produit`, `ttc_cmd=25.000`,
    `nbr_colis=1`, `type_colis_tab=0`, `echange_cmd=0`,
    `fragile=0`, `code_barres_ext=TEST-001`, `commentaire_cmd=Test`,
    `ancienne_commande_echange=`, `produit_arecevoir=`,
  ].join('&');

  const cr = await req('POST', '/colis', colisBody, {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Cookie': cookiesToString(cookies),
    'Referer': `https://${ADEX_HOST}/colis/create`,
    'X-XSRF-TOKEN': xsrfFinal ?? '',
    'Accept': 'text/html,application/json,*/*',
  });
  console.log(`   Status: ${cr.status}`);
  console.log(`   Location: ${cr.headers.location ?? 'aucune'}`);
  console.log(`   Response: ${cr.body.slice(0, 800)}`);

  // ── Étape 6 : test /adexapi/Add_colis avec session ────────
  console.log('\n── Étape 6 : POST /adexapi/Add_colis avec session authentifiée');
  const apiBody = JSON.stringify({
    nom_cli: 'Test API', ville_cli: '23', ContenuColis: 'Test produit',
    nbr_colis: 1, type_colis_tab: '0', adr_cli: '12 Rue Tunis',
    tel_cli: '98000000', tel_cli2: '', tel_cli3: '',
    ttc_cmd: 25.000, echange_cmd: 0,
    ancienne_commande_echange: '', produit_arecevoir: '',
    commentaire_cmd: 'Test', code_barres_ext: 'TEST-001', fragile: 0,
  });

  const ar = await req('POST', '/adexapi/Add_colis', apiBody, {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Cookie': cookiesToString(cookies),
    'X-XSRF-TOKEN': xsrfFinal ?? '',
    'USER': ADEX_USER,
    'PWD':  ADEX_PWD,
    'Referer': `https://${ADEX_HOST}/colis/create`,
  });
  console.log(`   Status: ${ar.status}`);
  console.log(`   Response: ${ar.body.slice(0, 600)}`);
}

main().catch(console.error);