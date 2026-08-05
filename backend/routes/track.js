'use strict';
const express = require('express');
const router  = express.Router();
const https   = require('https');

const ADEX_HOST = 'my.adex.tn';
const ADEX_USER = '55777400';
const ADEX_PASS = 'd813b214-8126-4fb4-a51d-52a18733de1e';
const agent = new https.Agent({ rejectUnauthorized: false });

function adexPost(path, payload) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(payload);
    const buf  = Buffer.from(body, 'utf8');
    const opts = {
      hostname: ADEX_HOST, path, method: 'POST', agent, timeout: 15000, // ↑ un peu plus long
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
    req.on('timeout', () => { req.destroy(); reject(new Error('ADEX_TIMEOUT')); });
    req.on('error', (e) => reject(e)); // garde l'objet Error complet (code, message, stack)
    req.write(buf);
    req.end();
  });
}

// petite pause entre 2 tentatives, pour ne pas re-taper l'API instantanément
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function adexPostWithRetry(path, payload, attempts = 3) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      return await adexPost(path, payload);
    } catch (err) {
      lastErr = err;
      // 👇 log complet : code réseau + message + stack, plus la payload envoyée
      console.warn(
        `⚠️ ADEX tentative ${i + 1}/${attempts} échouée — code: ${err.code || 'N/A'}, message: "${err.message || '(vide)'}"`
      );
      if (i < attempts - 1) await sleep(800 * (i + 1)); // 800ms, puis 1600ms...
    }
  }
  throw lastErr;
}

const ETAT_MAP = {
  "En Attente":            { pct: 0,   label: "Confirmée",        color: "#10B981" },
  "Enlevé":                { pct: 25,  label: "Colis enlevé",     color: "#F59E0B" },
  "Au Dépôt":              { pct: 45,  label: "Au dépôt",         color: "#F59E0B" },
  "En Cours de Livraison": { pct: 75,  label: "En cours",         color: "#E7398B" },
  "Livré":                 { pct: 100, label: "Livrée",           color: "#10B981" },
  "Retour Dépôt":          { pct: 30,  label: "Retour au dépôt",  color: "#EF4444" },
  "Retour Expéditeur":     { pct: 10,  label: "Retournée",        color: "#EF4444" },
};

function mapEtat(etatText) {
  return ETAT_MAP[etatText] || { pct: 0, label: etatText || "En attente", color: "#8892B0" };
}

router.get('/:code', async (req, res) => {
  try {
    const result = await adexPostWithRetry('/api/rest/StColis/getColis', {
      Utilisateur: ADEX_USER,
      Pass:        ADEX_PASS,
      codeBar:     req.params.code,
    });

    if (result.status !== 200) {
      console.error('❌ ADEX getColis status non-200:', result.status, result.body);
      return res.status(result.status).json({ error: 'Erreur ADEX', raw: result.body });
    }

    const d = result.body?.result_content || result.body;
    const statusInfo = mapEtat(d?.etat);

    return res.json({
      code: d?.code, reference: d?.reference, client: d?.client,
      adresse: d?.adresse, ville: d?.ville, etat_brut: d?.etat,
      pct: statusInfo.pct, label: statusInfo.label, color: statusInfo.color,
      date_creation: d?.date_creation, agence_actuelle: d?.agence_actuelle, raw: d,
    });
  } catch (err) {
    console.error('❌ GET /api/track/:code —', err.code || '', err.message, '\n', err.stack);
    return res.status(500).json({ error: 'Erreur communication ADEX', detail: err.message || err.code || 'inconnue' });
  }
});

module.exports = router;