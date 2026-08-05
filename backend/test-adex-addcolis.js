'use strict';
// Copier dans backend/test-adex-debug.js
// puis: node test-adex-debug.js

const https = require('https');

const ADEX_HOST = 'my.adex.tn';
const ADEX_USER = '55777400';
const ADEX_PWD  = '2026';

function post(path, contentType, body) {
  const buf = Buffer.from(body, 'utf8');
  return new Promise((resolve) => {
    const req = https.request({
      hostname: ADEX_HOST, path, method: 'POST',
      headers: { 'Content-Type': contentType, 'Content-Length': buf.length, 'USER': ADEX_USER, 'PWD': ADEX_PWD },
    }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => { console.log(`[${res.statusCode}] ${path} (${contentType.split(';')[0]})`); if (res.statusCode !== 405 && res.statusCode !== 404) console.log('  →', d.slice(0, 200)); resolve(); });
    });
    req.on('error', e => { console.log(`[ERR] ${path}: ${e.message}`); resolve(); });
    req.write(buf); req.end();
  });
}

async function main() {
  console.log('🔍 Test ADEX\n');

  const json = JSON.stringify({ nom_cli:'Test', ville_cli:'23', ContenuColis:'Prod', nbr_colis:1, type_colis_tab:'0', adr_cli:'Tunis', tel_cli:'98000000', tel_cli2:'', tel_cli3:'', ttc_cmd:25.000, echange_cmd:0, ancienne_commande_echange:'', produit_arecevoir:'', commentaire_cmd:'', code_barres_ext:'TEST', fragile:0 });
  const form = 'nom_cli=Test&ville_cli=23&ContenuColis=Prod&nbr_colis=1&type_colis_tab=0&adr_cli=Tunis&tel_cli=98000000&tel_cli2=&tel_cli3=&ttc_cmd=25.000&echange_cmd=0&ancienne_commande_echange=&produit_arecevoir=&commentaire_cmd=&code_barres_ext=TEST&fragile=0';

  const paths = ['/adexapi/Add_colis', '/adexapi/add_colis', '/api/colis', '/colis', '/colis/store'];

  for (const p of paths) {
    await post(p, 'application/json', json);
    await new Promise(r => setTimeout(r, 200));
    await post(p, 'application/x-www-form-urlencoded', form);
    await new Promise(r => setTimeout(r, 200));
  }

  console.log('\n✅ Fin — si tout est 405, ouvre DevTools sur my.adex.tn et soumets un formulaire pour voir la vraie URL');
}

main();