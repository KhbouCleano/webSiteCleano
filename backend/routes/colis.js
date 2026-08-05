'use strict';
// backend/routes/colis.js

const express = require('express');
const router  = express.Router();

// Mock data si pas de modèle Colis encore
let colisData = [
  { id: 1, order_id: 1001, client_name: "Ahmed Ben Ali",  address: "12 Rue Habib Bourguiba, Tunis", tracking_number: "TN123456789", carrier: "ADEX",        status: "livre",        estimated_date: "2024-03-05", created_at: "2024-03-01" },
  { id: 2, order_id: 1002, client_name: "Fatma Trabelsi", address: "45 Av. de la Liberté, Sfax",   tracking_number: "TN987654321", carrier: "ADEX",          status: "en_livraison", estimated_date: "2024-03-08", created_at: "2024-03-05" },
  { id: 3, order_id: 1003, client_name: "Mohamed Gharbi", address: "7 Rue du Commerce, Sousse",    tracking_number: "TN456789123", carrier: "DHL",            status: "en_transit",   estimated_date: "2024-03-12", created_at: "2024-03-10" },
  { id: 4, order_id: 1004, client_name: "Ahmed Ben Ali",  address: "12 Rue Habib Bourguiba, Tunis", tracking_number: "TN321654987", carrier: "Rapid Post",    status: "preparation",  estimated_date: "2024-03-15", created_at: "2024-03-12" },
];
let nextId = 5;

// GET /api/colis
router.get('/', (req, res) => {
  res.json({ colis: colisData, total: colisData.length });
});

// GET /api/colis/:id
router.get('/:id', (req, res) => {
  const item = colisData.find(c => c.id === parseInt(req.params.id));
  if (!item) return res.status(404).json({ error: 'Colis non trouvé' });
  res.json(item);
});

// POST /api/colis
router.post('/', (req, res) => {
  const newColis = {
    id: nextId++,
    ...req.body,
    created_at: new Date().toISOString().slice(0, 10),
  };
  colisData.push(newColis);
  res.status(201).json(newColis);
});

// PUT /api/colis/:id
router.put('/:id', (req, res) => {
  const idx = colisData.findIndex(c => c.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Colis non trouvé' });
  colisData[idx] = { ...colisData[idx], ...req.body };
  res.json(colisData[idx]);
});

// DELETE /api/colis/:id
router.delete('/:id', (req, res) => {
  const idx = colisData.findIndex(c => c.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Colis non trouvé' });
  colisData.splice(idx, 1);
  res.json({ success: true });
});

module.exports = router;
