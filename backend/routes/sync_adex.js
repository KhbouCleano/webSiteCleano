    'use strict';
// backend/routes/sync_adex.js
// Synchronisation entre la DB locale et ADEX
// GET  /api/sync/adex          → sync tous les colis ADEX → DB
// GET  /api/sync/adex/status   → état de la dernière sync
// POST /api/sync/adex/import   → importer les colis ADEX manquants dans DB

const express    = require('express');
const router     = express.Router();
const https      = require('https');
const sequelize  = require('../config/database');
const { QueryTypes } = require('sequelize');

const ADEX_HOST = 'my.adex.tn';
const ADEX_USER = '55777400';
const ADEX_PASS = 'd813b214-8126-4fb4-a51d-52a18733de1e';
const agent     = new https.Agent({ rejectUnauthorized: false });

// Mapping statut ADEX → statut local
const ADEX_TO_LOCAL_STATUS = {
  'en attente':              'pending',
  'à enlever':               'pending',
  'ramassé':                 'processing',
  'enlevé':                  'processing',
  'au dépôt':                'shipped',
  'en cours de livraison':   'shipped',
  'livré':                   'delivered',
  'retour dépôt':            'cancelled',
  'retour expéditeur':       'cancelled',
  'retour':                  'cancelled',
  'reporté':                 'processing',
};

function normalizeAdexStatus(etat) {
  return ADEX_TO_LOCAL_STATUS[(etat ?? '').toLowerCase().trim()] ?? 'pending';
}

// ── Helper ADEX POST ──────────────────────────────────────────
function adexPost(path, payload) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(payload);
    const buf  = Buffer.from(body, 'utf8');
    const opts = {
      hostname: ADEX_HOST, path, method: 'POST',
      agent, timeout: 20000,
      headers: {
        'Content-Type':   'application/json',
        'Accept':         'application/json',
        'Content-Length': buf.length,
        'User-Agent':     'Mozilla/5.0',
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
    req.on('timeout', () => { req.destroy(); reject(new Error('ADEX timeout')); });
    req.on('error', reject);
    req.write(buf);
    req.end();
  });
}

// ── Récupérer tous les colis ADEX (via ListColis sur nos trackings DB) ─
async function fetchAllAdexColis() {
  // 1. Récupérer tous les tracking_adex de la DB
  const dbOrders = await sequelize.query(
    `SELECT id, tracking_adex, adex_status, status
     FROM orders
     WHERE tracking_adex IS NOT NULL AND tracking_adex != ''`,
    { type: QueryTypes.SELECT }
  );

  if (dbOrders.length === 0) return { dbOrders: [], adexMap: {} };

  // 2. Appeler ListColis avec tous les codes en une fois (séparés par ;)
  const codes   = dbOrders.map(o => o.tracking_adex).join(';');
  const result  = await adexPost('/api/rest/StColis/ListColis', {
    Utilisateur: ADEX_USER,
    Pass:        ADEX_PASS,
    codeBar:     codes,
  });

  const adexMap = {};
  const colisList = result.body?.result_content?.colis ?? [];
  for (const colis of colisList) {
    if (colis.code) adexMap[colis.code] = colis;
  }

  // Si ListColis ne fonctionne pas (ancien endpoint), fallback getColis un par un
  if (colisList.length === 0 && dbOrders.length <= 10) {
    for (const order of dbOrders) {
      try {
        const r = await adexPost('/api/rest/StColis/getColis', {
          Utilisateur: ADEX_USER,
          Pass:        ADEX_PASS,
          codeBar:     order.tracking_adex,
        });
        if (r.body?.result_content?.code) {
          adexMap[order.tracking_adex] = r.body.result_content;
        }
      } catch (_) {}
    }
  }

  return { dbOrders, adexMap };
}

// ── GET /api/sync/adex ────────────────────────────────────────
// Synchronise les statuts ADEX → DB pour toutes les commandes
router.get('/adex', async (req, res) => {
  const startTime = Date.now();
  const results = {
    updated:   [],
    unchanged: [],
    errors:    [],
    total:     0,
  };

  try {
    const { dbOrders, adexMap } = await fetchAllAdexColis();
    results.total = dbOrders.length;

    for (const order of dbOrders) {
      const adexData = adexMap[order.tracking_adex];

      if (!adexData) {
        results.errors.push({
          id:       order.id,
          tracking: order.tracking_adex,
          reason:   'Non trouvé dans ADEX',
        });
        continue;
      }

      const newAdexStatus  = adexData.etat ?? adexData.etat_cmd ?? null;
      const newLocalStatus = normalizeAdexStatus(newAdexStatus);
      const hasChanged     = newAdexStatus !== order.adex_status || newLocalStatus !== order.status;

      if (hasChanged) {
        try {
          await sequelize.query(
            `UPDATE orders
             SET adex_status = :adex_status,
                 status      = :status,
                 updated_at  = NOW()
             WHERE id = :id`,
            {
              replacements: {
                adex_status: newAdexStatus,
                status:      newLocalStatus,
                id:          order.id,
              },
              type: QueryTypes.UPDATE,
            }
          );
          results.updated.push({
            id:              order.id,
            tracking:        order.tracking_adex,
            old_adex_status: order.adex_status,
            new_adex_status: newAdexStatus,
            old_status:      order.status,
            new_status:      newLocalStatus,
          });
        } catch (err) {
          results.errors.push({ id: order.id, tracking: order.tracking_adex, reason: err.message });
        }
      } else {
        results.unchanged.push({ id: order.id, tracking: order.tracking_adex, status: order.adex_status });
      }
    }

    // Enregistrer la date de dernière sync
    await sequelize.query(
      `INSERT INTO sync_logs (type, result, created_at)
       VALUES ('adex_sync', :result, NOW())
       ON CONFLICT DO NOTHING`,
      { replacements: { result: JSON.stringify({ ...results, duration_ms: Date.now() - startTime }) }, type: QueryTypes.INSERT }
    ).catch(() => {}); // Non bloquant si table n'existe pas

    res.json({
      success:     true,
      duration_ms: Date.now() - startTime,
      summary: {
        total:     results.total,
        updated:   results.updated.length,
        unchanged: results.unchanged.length,
        errors:    results.errors.length,
      },
      details: results,
    });

  } catch (err) {
    console.error('❌ Sync ADEX:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── POST /api/sync/adex/import ────────────────────────────────
// Importe dans la DB les colis ADEX qui n'y sont pas encore
// (cas où des commandes ont été créées directement sur ADEX)
router.post('/adex/import', async (req, res) => {
  // Les codes ADEX à importer (fournis manuellement ou récupérés d'ADEX)
  const { codes = [] } = req.body;

  if (!codes.length) {
    return res.status(400).json({ error: 'Fournir un tableau "codes" de numéros de suivi ADEX' });
  }

  const imported = [];
  const errors   = [];

  for (const code of codes) {
    try {
      // Vérifier si déjà en DB
      const [existing] = await sequelize.query(
        'SELECT id FROM orders WHERE tracking_adex = :code',
        { replacements: { code }, type: QueryTypes.SELECT }
      );
      if (existing) {
        errors.push({ code, reason: 'Déjà en DB (id: ' + existing.id + ')' });
        continue;
      }

      // Récupérer depuis ADEX
      const r = await adexPost('/api/rest/StColis/getColis', {
        Utilisateur: ADEX_USER, Pass: ADEX_PASS, codeBar: code,
      });
      const colis = r.body?.result_content;
      if (!colis) {
        errors.push({ code, reason: 'Non trouvé dans ADEX' });
        continue;
      }

      const localStatus = normalizeAdexStatus(colis.etat);

      // Insérer dans orders
      await sequelize.query(
        `INSERT INTO orders
           (user_id, total, status, tracking_adex, url_bl_adex, adex_status,
            adex_client_name, nom_cli, adr_cli, tel_cli, confirmed,
            adex_created_at, created_at, updated_at)
         VALUES
           (NULL, :total, :status, :tracking, :url_bl, :adex_status,
            :client_name, :client_name, :adresse, :tel1, false,
            :adex_at, NOW(), NOW())`,
        {
          replacements: {
            total:       parseFloat(colis.prix)  || 0,
            status:      localStatus,
            tracking:    code,
            url_bl:      `https://my.adex.tn/api/rest/StColis/printColis/${code}`,
            adex_status: colis.etat ?? 'En Attente',
            client_name: colis.client  ?? null,
            adresse:     colis.adresse ?? null,
            tel1:        colis.tel1    ?? null,
            adex_at:     colis.date_creation ?? new Date().toISOString(),
          },
          type: QueryTypes.INSERT,
        }
      );

      imported.push({
        code,
        client: colis.client,
        etat:   colis.etat,
        total:  colis.prix,
      });

    } catch (err) {
      errors.push({ code, reason: err.message });
    }
  }

  res.json({
    success:  true,
    imported: imported.length,
    errors:   errors.length,
    details:  { imported, errors },
  });
});

// ── GET /api/sync/adex/diff ───────────────────────────────────
// Affiche les différences entre DB et ADEX (sans modifier)
router.get('/adex/diff', async (req, res) => {
  try {
    const { dbOrders, adexMap } = await fetchAllAdexColis();
    const diffs = [];

    for (const order of dbOrders) {
      const adexData      = adexMap[order.tracking_adex];
      const adexStatus    = adexData?.etat ?? null;
      const localStatus   = normalizeAdexStatus(adexStatus);

      diffs.push({
        order_id:        order.id,
        tracking:        order.tracking_adex,
        db_adex_status:  order.adex_status,
        adex_status:     adexStatus,
        db_status:       order.status,
        local_status:    localStatus,
        in_sync:         adexStatus === order.adex_status && localStatus === order.status,
        needs_update:    adexStatus !== order.adex_status || localStatus !== order.status,
      });
    }

    res.json({
      total:       diffs.length,
      in_sync:     diffs.filter(d => d.in_sync).length,
      needs_update:diffs.filter(d => d.needs_update).length,
      not_in_adex: diffs.filter(d => !adexMap[d.tracking]).length,
      diffs,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
