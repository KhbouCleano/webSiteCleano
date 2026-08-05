'use strict';
// backend/import_adex_to_orders.js
// node import_adex_to_orders.js

require('dotenv').config();
const https     = require('https');
const sequelize = require('./config/database');
const { QueryTypes } = require('sequelize');

const ADEX_HOST = 'my.adex.tn';
const ADEX_USER = '55777400';
const ADEX_PASS = 'd813b214-8126-4fb4-a51d-52a18733de1e';
const agent     = new https.Agent({ rejectUnauthorized: false });

function adexPost(path, payload) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(payload);
    const buf  = Buffer.from(body, 'utf8');
    const opts = {
      hostname: ADEX_HOST, path, method: 'POST',
      agent, timeout: 20000,
      headers: {
        'Content-Type': 'application/json', 'Accept': 'application/json',
        'Content-Length': buf.length, 'User-Agent': 'Mozilla/5.0',
      },
    };
    const req = https.request(opts, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, body: data }); }
      });
    });
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
    req.on('error', reject);
    req.write(buf);
    req.end();
  });
}

function mapEtat(etat) {
  const e = (etat ?? '').toLowerCase();
  if (e.includes('livr') && !e.includes('cours')) return 'delivered';
  if (e.includes('cours de livraison'))            return 'shipped';
  if (e.includes('dépôt') || e.includes('depot')) return 'processing';
  if (e.includes('ramassé') || e.includes('enlevé')) return 'processing';
  if (e.includes('retour'))                        return 'cancelled';
  return 'pending';
}

async function main() {
  console.log('🔄 Import des colis ADEX vers orders...\n');
  await sequelize.authenticate();
  console.log('✅ DB connectée\n');

  // ── Vérifier les colonnes réelles de la table orders ─────
  const cols = await sequelize.query(
    `SELECT column_name FROM information_schema.columns WHERE table_name = 'orders' ORDER BY ordinal_position`,
    { type: QueryTypes.SELECT }
  );
  const colNames = cols.map(c => c.column_name);
  console.log('📋 Colonnes orders:', colNames.join(', '), '\n');

  const hasUpdatedAt      = colNames.includes('updated_at');
  const hasAdexClientName = colNames.includes('adex_client_name');
  const hasAdexCreatedAt  = colNames.includes('adex_created_at');
  const hasUrlBl          = colNames.includes('url_bl_adex');

  // ── Ajouter les colonnes manquantes ───────────────────────
  if (!hasAdexClientName) {
    await sequelize.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS adex_client_name VARCHAR(200) DEFAULT NULL`);
    console.log('✅ Colonne adex_client_name ajoutée');
  }
  if (!hasUpdatedAt) {
    await sequelize.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW()`);
    console.log('✅ Colonne updated_at ajoutée');
  }

  // ── Codes ADEX à importer ─────────────────────────────────
  const ALL_CODES = [
    '26062702157962', '26062702157930',
    '26062602156157', '26062602156064',
    '26062402147259', '26062402146963',
    '26062202140013', '26062002133137',
    '26061902131115', '26061902131095',
    '26061802126230',
  ];

  console.log(`\n📦 Récupération de ${ALL_CODES.length} colis depuis ADEX...\n`);

  const allColis = [];

  // getColis un par un (ListColis avait des problèmes)
  for (const code of ALL_CODES) {
    try {
      const r = await adexPost('/api/rest/StColis/getColis', {
        Utilisateur: ADEX_USER, Pass: ADEX_PASS, codeBar: code,
      });
      if (r.body?.result_type === 'success' && r.body?.result_content) {
        const c = r.body.result_content;
        allColis.push({
          code:    c.code ?? code,
          client:  c.client ?? '',
          prix:    parseFloat(c.prix ?? 0),
          etat:    c.etat ?? 'En Attente',
          date:    c.date_creation ?? new Date().toISOString(),
          url_bl:  `https://my.adex.tn/api/rest/StColis/printColis/${code}?Utilisateur=${ADEX_USER}&Pass=${ADEX_PASS}`,
        });
        console.log(`  ✅ ${code} — ${c.client} — ${c.etat}`);
      } else {
        console.log(`  ⚠️ ${code} — ${r.body?.result_code ?? 'non trouvé'}`);
      }
    } catch (err) {
      console.log(`  ❌ ${code}: ${err.message}`);
    }
    await new Promise(r => setTimeout(r, 300));
  }

  console.log(`\n✅ ${allColis.length} colis récupérés\n`);
  console.log('💾 Insertion dans orders...\n');

  let inserted = 0, updated = 0, errors = 0;

  for (const c of allColis) {
    try {
      // Vérifier si déjà existant
      const [existing] = await sequelize.query(
        'SELECT id FROM orders WHERE tracking_adex = :code',
        { replacements: { code: c.code }, type: QueryTypes.SELECT }
      );

      if (existing) {
        // Mettre à jour le statut
        await sequelize.query(
          `UPDATE orders SET adex_status = :etat, adex_client_name = :client WHERE tracking_adex = :code`,
          { replacements: { etat: c.etat, client: c.client, code: c.code }, type: QueryTypes.UPDATE }
        );
        updated++;
        console.log(`  🔄 MàJ: ${c.code} — ${c.etat}`);
      } else {
        // Construire l'INSERT dynamiquement selon les colonnes disponibles
        const fields = ['user_id', 'total', 'status', 'tracking_adex', 'adex_status', 'adex_client_name', 'created_at'];
        const values = ['NULL', ':total', ':status', ':tracking', ':adex_status', ':client', ':created_at'];
        const replacements = {
          total:       c.prix,
          status:      mapEtat(c.etat),
          tracking:    c.code,
          adex_status: c.etat,
          client:      c.client,
          created_at:  c.date,
        };

        if (hasUrlBl) {
          fields.push('url_bl_adex');
          values.push(':url_bl');
          replacements.url_bl = c.url_bl;
        }
        if (hasAdexCreatedAt) {
          fields.push('adex_created_at');
          values.push(':adex_at');
          replacements.adex_at = c.date;
        }
        if (hasUpdatedAt) {
          fields.push('updated_at');
          values.push('NOW()');
        }

        const sql = `INSERT INTO orders (${fields.join(', ')}) VALUES (${values.join(', ')})`;
        await sequelize.query(sql, { replacements, type: QueryTypes.INSERT });
        inserted++;
        console.log(`  💾 Inséré: ${c.code} — ${c.client} — ${c.etat} — ${c.prix} TND`);
      }
    } catch (err) {
      errors++;
      console.log(`  ❌ Erreur ${c.code}: ${err.message}`);
    }
  }

  console.log(`\n✅ Import terminé:`);
  console.log(`   Insérés  : ${inserted}`);
  console.log(`   MàJ      : ${updated}`);
  console.log(`   Erreurs  : ${errors}`);

  const [count] = await sequelize.query(
    'SELECT COUNT(*) AS total FROM orders',
    { type: QueryTypes.SELECT }
  );
  console.log(`\n📊 Total orders en DB: ${count.total}`);
  await sequelize.close();
  process.exit(0);
}

main().catch(err => {
  console.error('❌ Erreur fatale:', err.message);
  process.exit(1);
});