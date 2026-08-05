'use strict';
// backend/routes/adex.js

const express   = require('express');
const router    = express.Router();
const https     = require('https');
const sequelize = require('../config/database');
const { QueryTypes } = require('sequelize');

const ADEX_HOST = 'my.adex.tn';
const ADEX_USER = '55777400';
const ADEX_PASS = 'd813b214-8126-4fb4-a51d-52a18733de1e';
const agent     = new https.Agent({ rejectUnauthorized: false });

let _ordersColumnsCache = null;
async function getOrdersColumns() {
  if (_ordersColumnsCache) return _ordersColumnsCache;
  const cols = await sequelize.query(
    `SELECT column_name FROM information_schema.columns WHERE table_name = 'orders'`,
    { type: QueryTypes.SELECT }
  );
  _ordersColumnsCache = cols.map(c => c.column_name);
  return _ordersColumnsCache;
}

function adexPost(path, payload) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(payload);
    const buf  = Buffer.from(body, 'utf8');
    const opts = {
      hostname: ADEX_HOST, path, method: 'POST',
      agent, timeout: 15000,
      headers: {
        'Content-Type': 'application/json', 'Accept': 'application/json',
        'Content-Length': buf.length, 'User-Agent': 'Mozilla/5.0',
      },
    };
    console.log(`→ ADEX POST https://${ADEX_HOST}${path}`);
    const req = https.request(opts, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        console.log(`← ADEX ${res.statusCode}:`, data.slice(0, 300));
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

const VILLES = {
  "1":"Ariana","2":"Beja","3":"Ben Arous","4":"Bizerte",
  "5":"Gabes","6":"Gafsa","7":"Jendouba","8":"Kairouan",
  "9":"Kasserine","10":"Kebili","11":"Le Kef","12":"Mahdia",
  "13":"Mannouba","14":"Medenine","15":"Monastir","16":"Nabeul",
  "17":"Sfax","18":"Sidi Bouzid","19":"Siliana","20":"Sousse",
  "21":"Tataouine","22":"Tozeur","23":"Tunis","24":"Zaghouan",
};

// ── Nettoie un numéro de téléphone pour l'API ADEX ──────────────
// L'API exige 8 chiffres exactement. Retire l'indicatif tunisien
// (+216, 216, ou 00216) et tous les caractères non numériques.
function cleanPhone(raw) {
  if (!raw) return '';
  let digits = String(raw).replace(/\D/g, ''); // garde uniquement les chiffres
  // retire un préfixe international tunisien éventuel (216)
  if (digits.length > 8 && digits.startsWith('216')) {
    digits = digits.slice(3);
  }
  // si toujours plus long que 8 (ex: 00216...), on retente après avoir retiré les 00
  if (digits.length > 8 && digits.startsWith('00216')) {
    digits = digits.slice(5);
  }
  return digits.slice(-8); // garde les 8 derniers chiffres au cas où
}

let _lastAddColisRequest = null;

// ── POST /api/adex/add_colis ──────────────────────────────────
router.post('/add_colis', async (req, res) => {
  console.log('📦 ADEX add_colis reçu:', req.body);
  _lastAddColisRequest = { receivedAt: new Date().toISOString(), body: req.body };
  try {
    const f         = req.body;
    const villeNom  = VILLES[String(f.ville_cli)] ?? 'Tunis';
    const nbPieces  = parseInt(f.nbr_colis) || 1;
    const taille    = f.type_colis_tab ?? '0';
    const typeColis = Array(nbPieces).fill(taille).join('/');

    const tel1 = cleanPhone(f.tel_cli);
    const tel2 = cleanPhone(f.tel_cli2);

    if (tel1.length !== 8) {
      return res.status(400).json({
        error: `Numéro de téléphone invalide après nettoyage: "${f.tel_cli}" → "${tel1}" (doit faire 8 chiffres).`,
      });
    }

    const payload = {
      Utilisateur:      ADEX_USER,
      Pass:             ADEX_PASS,
      reference:        f.code_barres_ext || `CMD-${Date.now()}`,
      client:           f.nom_cli         || '',
      adresse:          f.adr_cli         || '',
      ville:            villeNom,
      gouvernorat:      villeNom,
      nb_pieces:        nbPieces,
      prix:             parseFloat(f.ttc_cmd) > 0 ? parseFloat(f.ttc_cmd) : 0.001,
      tel1:             tel1,
      tel2:             tel2,
      designation:      f.ContenuColis    || '',
      commentaire:      f.commentaire_cmd || '',
      type:             'FIX',
      type_colis_tab:   typeColis,
      fragile:          parseInt(f.fragile) || 0,
      autorisation_ouv: 0,
      autorisation_chq: 0,
      echange:          parseInt(f.echange_cmd) || 0,
      ...(parseInt(f.echange_cmd) === 1 ? { produit_arecevoir: f.produit_arecevoir || '' } : {}),
    };

    const result = await adexPost('/api/rest/StColis/AjouterVColis', payload);
    const d = result.body;

    if (result.status === 200 && d.success === 1) {

      // ── Sauvegarde dans orders — colonnes détectées dynamiquement ──
      try {
        const cols = await getOrdersColumns();
        console.log('📋 Colonnes orders disponibles:', cols.join(', '));

        const fields = [];
        const values = [];
        const replacements = {};

        // user_id toujours NULL pour les colis créés sans commande
        if (cols.includes('user_id')) { fields.push('user_id'); values.push('NULL'); }

        if (cols.includes('total'))               { fields.push('total');               values.push(':total');               replacements.total = parseFloat(f.ttc_cmd) || 0; }
        if (cols.includes('status'))              { fields.push('status');              values.push(':status');              replacements.status = 'pending'; }
        if (cols.includes('tracking_adex'))       { fields.push('tracking_adex');       values.push(':tracking');            replacements.tracking = d.num_suivi_cmd; }
        if (cols.includes('url_bl_adex'))         { fields.push('url_bl_adex');         values.push(':url_bl');              replacements.url_bl = d.url_bl ?? null; }
        if (cols.includes('adex_status'))         { fields.push('adex_status');         values.push(':adex_status');         replacements.adex_status = d.etat_cmd ?? 'En attente'; }
        if (cols.includes('adex_client_name'))    { fields.push('adex_client_name');    values.push(':adex_client_name');    replacements.adex_client_name = f.nom_cli || null; }
        // ── Téléphone et adresse du client (utilisés par /api/orders/clients) ──
        if (cols.includes('adex_client_phone'))   { fields.push('adex_client_phone');   values.push(':adex_client_phone');   replacements.adex_client_phone = tel1 || null; }
        if (cols.includes('adex_client_address')) { fields.push('adex_client_address'); values.push(':adex_client_address'); replacements.adex_client_address = f.adr_cli || null; }
        if (cols.includes('adex_created_at'))     { fields.push('adex_created_at');     values.push('NOW()'); }
        if (cols.includes('created_at'))          { fields.push('created_at');          values.push('NOW()'); }
        if (cols.includes('updated_at'))          { fields.push('updated_at');          values.push('NOW()'); }
        if (cols.includes('confirmed'))           { fields.push('confirmed');           values.push('false'); }

        let savedOrderId = null;

        if (f.order_id && cols.includes('id')) {
          // Lier à une commande existante → UPDATE au lieu de INSERT
          const updateSets = [];
          if (cols.includes('tracking_adex'))       updateSets.push('tracking_adex = :tracking');
          if (cols.includes('url_bl_adex'))         updateSets.push('url_bl_adex = :url_bl');
          if (cols.includes('adex_status'))         updateSets.push('adex_status = :adex_status');
          if (cols.includes('adex_client_phone'))   updateSets.push('adex_client_phone = :adex_client_phone');
          if (cols.includes('adex_client_address')) updateSets.push('adex_client_address = :adex_client_address');
          if (cols.includes('adex_created_at'))     updateSets.push('adex_created_at = NOW()');
          if (cols.includes('updated_at'))          updateSets.push('updated_at = NOW()');

          await sequelize.query(
            `UPDATE orders SET ${updateSets.join(', ')} WHERE id = :order_id`,
            { replacements: { ...replacements, order_id: f.order_id }, type: QueryTypes.UPDATE }
          );
          savedOrderId = f.order_id;
          console.log(`✅ Order #${f.order_id} mis à jour — tracking: ${d.num_suivi_cmd}`);
        } else {
          const sql = `INSERT INTO orders (${fields.join(', ')}) VALUES (${values.join(', ')}) RETURNING id`;
          console.log('📝 SQL INSERT:', sql);
          const [inserted] = await sequelize.query(sql, { replacements, type: QueryTypes.SELECT });
          savedOrderId = inserted?.id ?? null;
          console.log(`✅ Nouvelle commande créée en DB (#${savedOrderId}) — tracking: ${d.num_suivi_cmd}`);
        }

        // ── Rattacher les produits commandés + décrémenter le stock ──
        // f.produits vient du front (CheckoutPage / AdexModal) :
        // [{ id, name, qty, price }, ...]
        const produits = Array.isArray(f.produits) ? f.produits : [];
        _lastAddColisRequest.savedOrderId  = savedOrderId;
        _lastAddColisRequest.produitsRecus = produits.length;
        _lastAddColisRequest.produitsSauves = 0;
        if (savedOrderId && produits.length > 0) {
          for (const p of produits) {
            const qty = parseInt(p.qty) || 1;

            // 1) Historiser la ligne de commande (indépendant du stock ci-dessous)
            try {
              await sequelize.query(
                `INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, created_at)
                 VALUES (:order_id, :product_id, :product_name, :quantity, :unit_price, NOW())`,
                {
                  replacements: {
                    order_id:     savedOrderId,
                    product_id:   p.id ?? null,
                    product_name: p.name ?? '',
                    quantity:     qty,
                    unit_price:   parseFloat(p.price) || 0,
                  },
                  type: QueryTypes.INSERT,
                }
              );
              _lastAddColisRequest.produitsSauves++;
            } catch (itemErr) {
              console.error('❌ Insertion order_items échouée (as-tu bien exécuté create_order_items.sql ?):', itemErr.message);
              _lastAddColisRequest.orderItemsError = itemErr.message;
            }

            // 2) Décrémenter le stock — indépendant de l'étape 1 ci-dessus
            if (p.id) {
              const t = await sequelize.transaction();
              try {
                const [product] = await sequelize.query(
                  'SELECT id, stock FROM products WHERE id = :id FOR UPDATE',
                  { replacements: { id: p.id }, type: QueryTypes.SELECT, transaction: t }
                );
                if (product) {
                  const stockBefore = product.stock;
                  const stockAfter  = Math.max(0, stockBefore - qty);
                  await sequelize.query(
                    'UPDATE products SET stock = :stock WHERE id = :id',
                    { replacements: { stock: stockAfter, id: p.id }, type: QueryTypes.UPDATE, transaction: t }
                  );
                  await sequelize.query(
                    `INSERT INTO stock_movements (product_id, type, quantity, stock_before, stock_after, note, created_at)
                     VALUES (:product_id, 'sortie', :quantity, :stock_before, :stock_after, :note, NOW())`,
                    {
                      replacements: {
                        product_id: p.id, quantity: qty,
                        stock_before: stockBefore, stock_after: stockAfter,
                        note: `Vente — commande ADEX ${d.num_suivi_cmd}`,
                      },
                      type: QueryTypes.INSERT, transaction: t,
                    }
                  );
                  console.log(`📉 Stock produit #${p.id}: ${stockBefore} → ${stockAfter}`);
                } else {
                  console.warn(`⚠️ Produit #${p.id} introuvable — stock non décrémenté`);
                }
                await t.commit();
              } catch (stockErr) {
                await t.rollback();
                console.error(`❌ Décrément stock produit #${p.id} échoué:`, stockErr.message);
              }
            } else {
              console.warn(`⚠️ Produit "${p.name}" reçu sans id — stock non décrémenté (le front doit envoyer product.id)`);
            }
          }
        }
      } catch (dbErr) {
        console.error('❌ DB save failed:', dbErr.message);
        console.error(dbErr);
        _lastAddColisRequest.dbError = dbErr.message;
      }

      res.json({
        num_suivi_cmd: d.num_suivi_cmd,
        url_bl:        d.url_bl,
        etat_cmd:      d.etat_cmd,
        date_cmd:      d.date_cmd,
        raw:           d,
      });
    } else {
      res.status(400).json({ error: d.result_content ?? d.message ?? 'Erreur ADEX', raw: d });
    }
  } catch (err) {
    console.error('❌ ADEX add_colis:', err.message);
    res.status(500).json({ error: 'Erreur communication ADEX', detail: err.message });
  }
});

// ── POST /api/adex/track_status ───────────────────────────────
router.post('/track_status', async (req, res) => {
  try {
    const result = await adexPost('/api/rest/StColis/getColis', {
      Utilisateur: ADEX_USER, Pass: ADEX_PASS, codeBar: req.body.num_suivi_cmd,
    });
    res.status(result.status).json(result.body);
  } catch (err) {
    res.status(500).json({ error: 'Erreur ADEX', detail: err.message });
  }
});

// ── POST /api/adex/track_history ─────────────────────────────
router.post('/track_history', async (req, res) => {
  try {
    const result = await adexPost('/api/rest/StColis/historiqueColis', {
      Utilisateur: ADEX_USER, Pass: ADEX_PASS, codeBar: req.body.num_suivi_cmd,
    });
    res.status(result.status).json(result.body);
  } catch (err) {
    res.status(500).json({ error: 'Erreur ADEX', detail: err.message });
  }
});

// ── POST /api/adex/list_villes ────────────────────────────────
router.post('/list_villes', async (req, res) => {
  try {
    const result = await adexPost('/api/rest/StColis/listVilles', { Utilisateur: ADEX_USER, Pass: ADEX_PASS });
    res.status(result.status).json(result.body);
  } catch (err) {
    res.status(500).json({ error: 'Erreur ADEX', detail: err.message });
  }
});

// ── POST /api/adex/supprimer_colis ───────────────────────────
router.post('/supprimer_colis', async (req, res) => {
  try {
    const result = await adexPost('/api/rest/StColis/supprimerColis', {
      Utilisateur: ADEX_USER, Pass: ADEX_PASS, codeBar: req.body.codeBar,
    });
    res.status(result.status).json(result.body);
  } catch (err) {
    res.status(500).json({ error: 'Erreur ADEX', detail: err.message });
  }
});

// ── GET /api/adex/debug/last — DIAGNOSTIC TEMPORAIRE ──────────
// Ouvre http://<serveur>:3000/api/adex/debug/last dans le navigateur
// pour voir EXACTEMENT ce que le front a envoyé lors du dernier essai.
// ⚠️ À supprimer une fois le problème résolu.
router.get('/debug/last', (req, res) => {
  if (!_lastAddColisRequest) {
    return res.json({ message: "Aucune requête add_colis reçue depuis le dernier redémarrage du serveur. Passe une commande test puis recharge cette page." });
  }
  res.json(_lastAddColisRequest);
});

// ── GET /api/adex/debug/compare — DIAGNOSTIC TEMPORAIRE ───────
// Prend tous les tracking_adex présents dans TA table orders,
// interroge ADEX (ListColis) pour ces mêmes codes, et te dit
// si un des champs (statut, désignation) diffère.
// ⚠️ Ne peut PAS lister les colis créés directement sur my.adex.tn
// (l'API ADEX n'offre pas de "liste tous mes colis" — seulement
// ListColis avec des codes précis). Pour ceux-là, il faut comparer
// les codes un par un manuellement entre les deux pages.
// ⚠️ À supprimer une fois le problème résolu.
router.get('/debug/compare', async (req, res) => {
  try {
    const localOrders = await sequelize.query(
      `SELECT id, tracking_adex, total, adex_status FROM orders WHERE tracking_adex IS NOT NULL ORDER BY created_at DESC LIMIT 50`,
      { type: QueryTypes.SELECT }
    );
    if (localOrders.length === 0) {
      return res.json({ message: 'Aucune commande avec tracking_adex trouvée dans ta base.' });
    }
    const codes = localOrders.map(o => o.tracking_adex).join(';');
    const result = await adexPost('/api/rest/StColis/ListColis', {
      Utilisateur: ADEX_USER, Pass: ADEX_PASS, codeBar: codes,
    });
    const adexColis = result.body?.result_content?.colis ?? [];
    const adexByCode = {};
    for (const c of adexColis) adexByCode[c.code] = c;

    const comparison = localOrders.map(o => {
      const adex = adexByCode[o.tracking_adex];
      return {
        order_id: o.id,
        tracking_adex: o.tracking_adex,
        trouve_chez_adex: !!adex,
        statut_local: o.adex_status,
        statut_adex: adex?.etat ?? null,
        designation_adex: adex?.designation ?? null,
        prix_local: o.total,
        prix_adex: adex?.prix ?? null,
      };
    });

    res.json({
      nb_commandes_locales_verifiees: localOrders.length,
      nb_trouves_chez_adex: comparison.filter(c => c.trouve_chez_adex).length,
      nb_introuvables_chez_adex: comparison.filter(c => !c.trouve_chez_adex).length,
      comparison,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/adex/manifest — Valider le manifeste du jour ────
// Regroupe tous les colis "En Attente" chez ADEX et retourne un PDF
// (bordereau + BLs) prêt à imprimer.
router.post('/manifest', async (req, res) => {
  try {
    const result = await adexPost('/api/rest/StColis/demanderEnlevement', {
      Utilisateur: ADEX_USER, Pass: ADEX_PASS,
    });
    if (result.body?.result_type === 'success') {
      res.json({ url: result.body.result_content });
    } else {
      res.status(400).json({ error: result.body?.result_content ?? result.body?.message ?? 'Erreur manifeste', raw: result.body });
    }
  } catch (err) {
    res.status(500).json({ error: 'Erreur communication ADEX', detail: err.message });
  }
});

// ── POST /api/adex/sync — Synchronise nos commandes avec ADEX ─
// ⚠️ Limite de l'API ADEX : il n'existe aucun endpoint "liste tous mes
// colis par date" — seulement ListColis avec des codes déjà connus.
// Cette synchro ne peut donc PAS découvrir des colis créés uniquement
// chez ADEX (jamais enregistrés dans notre base). Elle fait, pour les
// commandes locales du jour qui ont un tracking_adex :
//   1) Récupère leur état réel chez ADEX (ListColis, par lots de 40)
//   2) UPDATE la ligne locale si le colis existe toujours chez ADEX
//   3) DELETE la ligne locale si ADEX ne connaît plus ce code
router.post('/sync', async (req, res) => {
  try {
    const scope = req.body?.scope ?? 'today'; // 'today' | 'all'

    let localOrders;
    if (scope === 'all') {
      // ── Toutes les commandes ayant un tracking ADEX, peu importe la date ──
      localOrders = await sequelize.query(
        `SELECT id, tracking_adex FROM orders
         WHERE tracking_adex IS NOT NULL AND tracking_adex != ''`,
        { type: QueryTypes.SELECT }
      );
    } else {
      const now = new Date();
      const startOfDay = req.body?.date_from
        ? new Date(req.body.date_from)
        : new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
      const endOfDay = req.body?.date_to
        ? new Date(req.body.date_to)
        : new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

      localOrders = await sequelize.query(
        `SELECT id, tracking_adex FROM orders
         WHERE tracking_adex IS NOT NULL AND tracking_adex != ''
         AND created_at BETWEEN :start AND :end`,
        { replacements: { start: startOfDay.toISOString(), end: endOfDay.toISOString() }, type: QueryTypes.SELECT }
      );
    }

    if (localOrders.length === 0) {
      return res.json({ message: 'Aucune commande avec tracking ADEX sur cette période.', total_verifies: 0, updated: 0, deleted: 0 });
    }

    // ── Appelle ADEX par lots de 40 codes (marge de sécurité) ──
    const BATCH = 40;
    const codes = localOrders.map(o => o.tracking_adex);
    let adexColisAll = [];
    for (let i = 0; i < codes.length; i += BATCH) {
      const batch = codes.slice(i, i + BATCH).join(';');
      const result = await adexPost('/api/rest/StColis/ListColis', {
        Utilisateur: ADEX_USER, Pass: ADEX_PASS, codeBar: batch,
      });
      const colis = result.body?.result_content?.colis ?? [];
      adexColisAll = adexColisAll.concat(colis);
    }
    const adexByCode = {};
    for (const c of adexColisAll) adexByCode[c.code] = c;

    let updated = 0, deleted = 0;
    const details = [];
    for (const o of localOrders) {
      const adex = adexByCode[o.tracking_adex];
      if (adex) {
        await sequelize.query(
          `UPDATE orders SET
             adex_status = :etat,
             total = :prix,
             adex_client_name = COALESCE(:client, adex_client_name),
             adex_client_address = COALESCE(:adresse, adex_client_address),
             updated_at = NOW()
           WHERE id = :id`,
          {
            replacements: {
              etat: adex.etat ?? null,
              prix: parseFloat(adex.prix) || 0,
              client: adex.client ?? null,
              adresse: adex.adresse ?? null,
              id: o.id,
            },
            type: QueryTypes.UPDATE,
          }
        );
        updated++;
        details.push({ order_id: o.id, tracking_adex: o.tracking_adex, action: 'updated', etat: adex.etat });
      } else {
        await sequelize.query('DELETE FROM orders WHERE id = :id', { replacements: { id: o.id }, type: QueryTypes.DELETE });
        deleted++;
        details.push({ order_id: o.id, tracking_adex: o.tracking_adex, action: 'deleted' });
      }
    }

    res.json({ message: 'Synchronisation terminée', total_verifies: localOrders.length, updated, deleted, details });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/adex/print/:code — Redirige vers le PDF du BL ────
// Évite d'exposer Utilisateur/Pass côté frontend : le lien cliqué par
// l'admin pointe ici, et le backend redirige vers l'URL ADEX complète.
router.get('/print/:code', (req, res) => {
  const url = `https://${ADEX_HOST}/api/rest/StColis/printColis/${encodeURIComponent(req.params.code)}?Utilisateur=${ADEX_USER}&Pass=${ADEX_PASS}`;
  res.redirect(url);
});

// ── GET /api/adex/test ────────────────────────────────────────
router.get('/test', (req, res) => {
  res.json({ status: 'OK', endpoint: `https://${ADEX_HOST}/api/rest/StColis/AjouterVColis` });
});

module.exports = router;