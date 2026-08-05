'use strict';
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const User   = require('../models/User');

const sign = (user) => jwt.sign(
  { id: user.id, email: user.email, role: user.role },
  process.env.JWT_SECRET || 'cleano_secret',
  { expiresIn: '7d' }
);

exports.register = async (req, res) => {
  try {
    const { name, email, password, accountType, companyName, estimatedVolume } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ error: 'Tous les champs sont requis' });

    if (password.length < 6)
      return res.status(400).json({ error: 'Mot de passe min 6 caracteres' });

    // Validation du type de compte
    const validTypes = ['particulier', 'grossiste'];
    const finalAccountType = validTypes.includes(accountType) ? accountType : 'particulier';

    // Si grossiste, on exige le nom de l'entreprise
    if (finalAccountType === 'grossiste' && !companyName)
      return res.status(400).json({ error: 'Le nom de l\'entreprise est requis pour un compte professionnel' });

    const exists = await User.findOne({ where: { email: email.toLowerCase() } });
    if (exists) return res.status(409).json({ error: 'Email deja utilise' });

    const hashed = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashed,
      accountType: finalAccountType,
      companyName: finalAccountType === 'grossiste' ? companyName : null,
      estimatedVolume: finalAccountType === 'grossiste' ? (estimatedVolume || null) : null,
    });

    res.status(201).json({
      message: 'Compte cree',
      token: sign(user),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        accountType: user.accountType,
        companyName: user.companyName,
        estimatedVolume: user.estimatedVolume,
      }
    });
  } catch(err) { res.status(500).json({ error: err.message }); }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email et mot de passe requis' });

    const user = await User.findOne({ where: { email: email.toLowerCase() } });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });

    res.json({
      message: 'Connexion reussie',
      token: sign(user),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        accountType: user.accountType,
        companyName: user.companyName,
        estimatedVolume: user.estimatedVolume,
      }
    });
  } catch(err) { res.status(500).json({ error: err.message }); }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email', 'role', 'accountType', 'companyName', 'estimatedVolume']
    });
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouve' });
    res.json({ user });
  } catch(err) { res.status(500).json({ error: err.message }); }
};