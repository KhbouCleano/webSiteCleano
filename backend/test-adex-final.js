'use strict';
// node test-adex-final.js

const https = require('https');

const payload = {
  Utilisateur:      '55777400',
  Pass:             'd813b214-8126-4fb4-a51d-52a18733de1e',
  reference:        'TEST-001',
  client:           'Khbou Clean Test',
  adresse:          'Kalaa Kbira Ahl Jmi3',
  ville:            'Tunis',
  gouvernorat:      'Tunis',
  nb_pieces:        1,
  prix:             50.000,
  tel1:             '26701326',
  tel2:             '',
  designation:      'Produit test',
  commentaire:      'Test API',
  type:             'FIX',
  type_colis_tab:   '0',
  fragile:          0,
  autorisation_ouv: 0,
  autorisation_chq: 0,
  echange:          0,
};

const body = JSON.stringify(payload);
const buf  = Buffer.from(body, 'utf8');

const opts = {
  hostname: 'my.adex.tn',
  path:     '/api/rest/StColis/AjouterVColis',
  method:   'POST',
  timeout:  15000,
  // Désactiver la vérification SSL si nécessaire
  rejectUnauthorized: false,
  headers: {
    'Content-Type':   'application/json',
    'Accept':         'application/json',
    'Content-Length': buf.length,
    'User-Agent':     'Mozilla/5.0',
  },
};

console.log('📦 POST https://my.adex.tn/api/rest/StColis/AjouterVColis\n');

const req = https.request(opts, (res) => {
  let data = '';
  console.log(`← Status: ${res.statusCode}`);
  console.log(`← Headers:`, res.headers);
  res.on('data', c => data += c);
  res.on('end', () => {
    console.log('\n← Response:', data);
  });
});

req.on('timeout', () => {
  console.error('❌ TIMEOUT — le serveur ne répond pas dans les 15 secondes');
  req.destroy();
});

req.on('error', (e) => {
  console.error('❌ Erreur réseau:', e.message);
  console.error('   Code:', e.code);
  console.error('   Stack:', e.stack?.split('\n')[1]);
});

req.write(buf);
req.end();