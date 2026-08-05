'use strict';
// node test-adex-final.js

const https = require('https');

const payload = JSON.stringify({
  Utilisateur:  '55777400',
  Pass:         'd813b214-8126-4fb4-a51d-52a18733de1e',
  reference:    'TEST-001',
  client:       'Khbou Clean Test',
  adresse:      'Kalaa Kbira Ahl Jmi3',
  code_postal:  '',
  nb_pieces:    1,
  prix:         50.000,
  tel1:         '26701326',
  tel2:         '',
  designation:  'Produit test',
  commentaire:  'Test API',
  type:         'FIX',
  echange:      0,
});

const buf = Buffer.from(payload, 'utf8');
const options = {
  hostname: 'my.adex.tn',
  path:     '/api/rest/StColis/AjouterColis',
  method:   'POST',
  headers: {
    'Content-Type':   'application/json',
    'Accept':         'application/json',
    'Content-Length': buf.length,
    'User-Agent':     'Mozilla/5.0',
  },
};

console.log('📦 Test AjouterColis →', options.hostname + options.path);
console.log('Payload:', JSON.stringify(JSON.parse(payload), null, 2));

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    console.log(`\n← Status: ${res.statusCode}`);
    console.log('← Response:', data);
  });
});

req.on('error', e => console.error('❌ Erreur:', e.message));
req.write(buf);
req.end();
