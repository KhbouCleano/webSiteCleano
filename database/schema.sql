-- ============================================================
-- cleano.tn — Schéma Base de Données PostgreSQL
-- Version 1.0 — Avril 2025
-- ============================================================

-- Extension UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- TABLES PRINCIPALES
-- ============================================================

-- Rôles utilisateurs
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,  -- 'client', 'fournisseur', 'admin', 'sous_admin', 'gestionnaire_stock', 'gestionnaire_commandes'
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Utilisateurs
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_id INTEGER REFERENCES roles(id) DEFAULT 1,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    is_email_verified BOOLEAN DEFAULT FALSE,
    google_id VARCHAR(255),
    refresh_token TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Adresses
CREATE TABLE addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    label VARCHAR(50),           -- 'Domicile', 'Bureau', etc.
    full_name VARCHAR(200),
    phone VARCHAR(20),
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    governorate VARCHAR(100),
    postal_code VARCHAR(10),
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Catégories produits (arborescence illimitée)
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    parent_id INTEGER REFERENCES categories(id),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Produits
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id INTEGER REFERENCES categories(id),
    sku VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    price DECIMAL(10,3) NOT NULL,        -- Prix normal (TND)
    price_promo DECIMAL(10,3),           -- Prix promotionnel
    price_supplier DECIMAL(10,3),        -- Prix fournisseur
    stock_quantity INTEGER DEFAULT 0,
    min_stock_alert INTEGER DEFAULT 10,
    weight DECIMAL(8,3),                 -- en kg
    -- Champs SEO
    meta_title VARCHAR(255),
    meta_description TEXT,
    -- Statuts
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    is_new BOOLEAN DEFAULT FALSE,
    -- Usages (Four, Friteuse, Hotte, etc.)
    usage_tags TEXT[],
    -- Images
    main_image VARCHAR(500),
    images TEXT[],
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Dépôts / Entrepôts
CREATE TABLE depots (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(255),
    city VARCHAR(100),
    phone VARCHAR(20),
    is_pickup_point BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Stock par dépôt
CREATE TABLE stock_depot (
    id SERIAL PRIMARY KEY,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    depot_id INTEGER REFERENCES depots(id),
    quantity INTEGER DEFAULT 0,
    UNIQUE(product_id, depot_id)
);

-- Mouvements de stock
CREATE TABLE stock_movements (
    id SERIAL PRIMARY KEY,
    product_id UUID REFERENCES products(id),
    depot_id INTEGER REFERENCES depots(id),
    type VARCHAR(30) NOT NULL,   -- 'entree', 'sortie', 'transfert', 'retour'
    quantity INTEGER NOT NULL,
    reference VARCHAR(100),      -- N° commande ou bon d'entrée
    notes TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Coupons de réduction
CREATE TABLE coupons (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    type VARCHAR(20) NOT NULL,   -- 'percent', 'fixed'
    value DECIMAL(10,3) NOT NULL,
    min_order_amount DECIMAL(10,3),
    max_uses INTEGER,
    uses_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Commandes
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(20) UNIQUE NOT NULL,  -- CLN-2025-000001
    user_id UUID REFERENCES users(id),
    address_id UUID REFERENCES addresses(id),
    depot_id INTEGER REFERENCES depots(id),    -- Pour retrait en magasin
    coupon_id INTEGER REFERENCES coupons(id),
    -- Montants
    subtotal DECIMAL(10,3) NOT NULL,
    discount_amount DECIMAL(10,3) DEFAULT 0,
    shipping_cost DECIMAL(10,3) DEFAULT 0,
    total DECIMAL(10,3) NOT NULL,
    -- Paiement
    payment_method VARCHAR(30),   -- 'livraison', 'en_ligne', 'retrait'
    payment_status VARCHAR(20) DEFAULT 'pending',   -- 'pending', 'paid', 'failed', 'refunded'
    payment_reference VARCHAR(100),
    -- Statut commande
    status VARCHAR(30) DEFAULT 'en_attente',
    -- 'en_attente', 'validee', 'en_preparation', 'expediee', 'en_livraison', 'livree', 'annulee', 'retour_en_cours'
    -- Type client
    order_type VARCHAR(20) DEFAULT 'client',  -- 'client', 'fournisseur'
    -- Notes
    notes TEXT,
    -- Dates
    validated_at TIMESTAMP,
    shipped_at TIMESTAMP,
    delivered_at TIMESTAMP,
    cancelled_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Lignes de commande
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    product_name VARCHAR(255) NOT NULL,  -- Snapshot
    product_sku VARCHAR(100),
    product_image VARCHAR(500),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,3) NOT NULL,
    total_price DECIMAL(10,3) NOT NULL
);

-- Suivi de colis
CREATE TABLE shipments (
    id SERIAL PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    tracking_number VARCHAR(100),
    carrier_name VARCHAR(100),     -- 'Aramex', 'SAV', 'Rapid Express', etc.
    carrier_url VARCHAR(500),
    status VARCHAR(30) DEFAULT 'en_attente',
    estimated_delivery DATE,
    delivered_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Historique des statuts de colis
CREATE TABLE shipment_events (
    id SERIAL PRIMARY KEY,
    shipment_id INTEGER REFERENCES shipments(id) ON DELETE CASCADE,
    status VARCHAR(30) NOT NULL,
    description TEXT,
    location VARCHAR(200),
    agent_name VARCHAR(100),
    occurred_at TIMESTAMP DEFAULT NOW()
);

-- Favoris
CREATE TABLE favorites (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- Avis produits
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    title VARCHAR(100),
    body TEXT,
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Factures
CREATE TABLE invoices (
    id SERIAL PRIMARY KEY,
    invoice_number VARCHAR(30) UNIQUE NOT NULL,  -- FAC-2025-000001
    order_id UUID REFERENCES orders(id),
    user_id UUID REFERENCES users(id),
    pdf_url VARCHAR(500),
    total DECIMAL(10,3) NOT NULL,
    type VARCHAR(20) DEFAULT 'facture',  -- 'facture', 'avoir'
    issued_at TIMESTAMP DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50),    -- 'order_status', 'stock_alert', 'promo'
    title VARCHAR(255),
    body TEXT,
    reference_id VARCHAR(100),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Bannières / Promotions (page d'accueil)
CREATE TABLE banners (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    subtitle VARCHAR(255),
    image_url VARCHAR(500),
    link_url VARCHAR(500),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- INDEX POUR LES PERFORMANCES
-- ============================================================

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_shipments_order ON shipments(order_id);
CREATE INDEX idx_favorites_user ON favorites(user_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);

-- ============================================================
-- DONNÉES INITIALES
-- ============================================================

-- Rôles
INSERT INTO roles (name, description) VALUES
  ('client', 'Client particulier'),
  ('fournisseur', 'Client fournisseur avec tarifs préférentiels'),
  ('admin', 'Super Administrateur — accès total'),
  ('sous_admin', 'Administrateur secondaire — droits limités'),
  ('gestionnaire_stock', 'Gestion des stocks et dépôts uniquement'),
  ('gestionnaire_commandes', 'Gestion des commandes et livraisons');

-- Catégories
INSERT INTO categories (name, slug, description, sort_order) VALUES
  ('Cuisine', 'cuisine', 'Produits de nettoyage pour la cuisine', 1),
  ('Salle de bain', 'salle-de-bain', 'Produits sanitaires et salle de bain', 2),
  ('Vitres & Surfaces', 'vitres-surfaces', 'Nettoyants vitres et surfaces modernes', 3),
  ('Anti-taches', 'anti-taches', 'Détachants et anti-taches', 4),
  ('Multi-usages', 'multi-usages', 'Produits polyvalents', 5);

-- Dépôts
INSERT INTO depots (name, address, city, is_pickup_point, is_active) VALUES
  ('Dépôt Central Tunis', 'Zone Industrielle, Rue de l''Industrie', 'Tunis', TRUE, TRUE),
  ('Dépôt Sfax', 'Zone Industrielle Sfax', 'Sfax', TRUE, TRUE),
  ('Dépôt Sousse', 'Zone Industrielle Sousse', 'Sousse', FALSE, TRUE);

-- Produits Cleano
INSERT INTO products (
    category_id, sku, name, slug, description, short_description,
    price, price_promo, price_supplier,
    stock_quantity, is_active, is_featured, is_new,
    usage_tags, main_image
) VALUES
(
    1, 'CLN-001', 'Super Dégraissant Cuisine',
    'super-degraissant-cuisine',
    'Puissant dégraissant spécialement formulé pour la cuisine. Élimine efficacement les graisses les plus tenaces sur four, friteuse et hotte aspirante. Action rapide et résultats visibles dès la première utilisation.',
    'Mزيل الدهون القوي للمطبخ — Four · Friteuse · Hotte',
    6.900, 5.500, 4.200,
    250, TRUE, TRUE, FALSE,
    ARRAY['Four', 'Friteuse', 'Hotte'],
    '/images/product-degraissant.jpg'
),
(
    4, 'CLN-002', 'Super Anti-Tache Spécial Tissus',
    'super-anti-tache-tissus',
    'Éliminateur de taches ultra-efficace pour tissus délicats. Formule douce sans agression, séchage rapide et résultat impeccable. Idéal pour canapés, tapis et vêtements.',
    'مديد الماع ضذل مقذاليه وني بالذاملة — Petit Trese · Séchage Rapide',
    5.900, NULL, 3.800,
    180, TRUE, FALSE, FALSE,
    ARRAY['Tissus', 'Canapé', 'Tapis'],
    '/images/product-anti-toche-tissu.jpg'
),
(
    2, 'CLN-003', 'Multi-Usage Sanitaire',
    'multi-usage-sanitaire',
    'Nettoyant multi-usage haute performance pour toutes les surfaces sanitaires. Nettoie, désinfecte et parfume en une seule application. Certifié pour éliminer 99.9% des bactéries.',
    'متعدد الاستخدامات للحمام — Nettoyant · Désinfectant · Parfumé',
    4.500, 3.900, 2.800,
    320, TRUE, TRUE, FALSE,
    ARRAY['Salle de bain', 'WC', 'Lavabo', 'Baignoire'],
    '/images/product-multi-usage.jpg'
),
(
    2, 'CLN-004', 'Anti-Calcaire Décapant Surpuissant',
    'anti-calcaire-decapant',
    'Le décapant surpuissant contre le calcaire. Formule concentrée qui dissout instantanément les dépôts calcaires les plus résistants. Résultats spectaculaires sur carrelage, robinetterie et joints.',
    'مزيل للجير — Décapant Surpuissant',
    7.500, 6.500, 5.000,
    150, TRUE, TRUE, TRUE,
    ARRAY['Calcaire', 'Robinetterie', 'Carrelage', 'Joints'],
    '/images/product-anti-calcaire.jpg'
),
(
    3, 'CLN-005', 'Nettoyant Vitres & Surfaces Modernes',
    'nettoyant-vitres-surfaces',
    'Nettoyant professionnel pour vitres, miroirs et surfaces modernes. Anti-traces pour un résultat brillant et cristallin. Séchage ultra-rapide sans auréoles.',
    'شغلف الزجاج والأسطح الحديثة — Anti-Trace · Séchage Rapide',
    5.200, NULL, 3.300,
    200, TRUE, FALSE, FALSE,
    ARRAY['Vitres', 'Miroirs', 'Surfaces modernes'],
    '/images/product-vitres.jpg'
),
(
    4, 'CLN-006', 'Super Anti-Tache Entretien Général',
    'super-anti-tache-general',
    'Le détachant polyvalent pour tous les types de taches et toutes les surfaces. Efficace sur les taches de graisse, d''encre, de café, de vin et bien plus. Formule puissante pour un entretien général impeccable.',
    'صماع الوقع متلق القذارة — Entration Général',
    4.900, 4.200, 3.100,
    275, TRUE, TRUE, TRUE,
    ARRAY['Multi-surfaces', 'Taches graisses', 'Taches café', 'Voiture'],
    '/images/product-anti-toche-general.jpg'
);

-- Stock par dépôt
INSERT INTO stock_depot (product_id, depot_id, quantity)
SELECT p.id, 1, p.stock_quantity * 0.6::int FROM products p;
INSERT INTO stock_depot (product_id, depot_id, quantity)
SELECT p.id, 2, p.stock_quantity * 0.3::int FROM products p;
INSERT INTO stock_depot (product_id, depot_id, quantity)
SELECT p.id, 3, p.stock_quantity * 0.1::int FROM products p;

-- Admin par défaut
INSERT INTO users (role_id, email, password_hash, first_name, last_name, phone, is_active, is_email_verified)
VALUES (
    3,
    'admin@cleano.tn',
    crypt('Admin@Cleano2025!', gen_salt('bf', 12)),
    'Admin',
    'Cleano',
    '+216 00 000 000',
    TRUE, TRUE
);

-- Bannière d'accueil
INSERT INTO banners (title, subtitle, image_url, link_url, sort_order, is_active) VALUES
  ('Propreté & Fraîcheur', 'Des produits puissants pour un intérieur impeccable', '/images/banner-hero.jpg', '/products', 1, TRUE),
  ('Nouveautés 2025', 'Découvrez nos dernières formules innovantes', '/images/banner-new.jpg', '/products?filter=new', 2, TRUE);

-- ============================================================
-- VUES UTILES
-- ============================================================

CREATE VIEW v_products_full AS
SELECT 
    p.*,
    c.name as category_name,
    c.slug as category_slug,
    COALESCE(SUM(sd.quantity), 0) as total_stock,
    COUNT(r.id) as review_count,
    ROUND(AVG(r.rating), 1) as avg_rating
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN stock_depot sd ON p.id = sd.product_id
LEFT JOIN reviews r ON p.id = r.product_id AND r.is_approved = TRUE
GROUP BY p.id, c.name, c.slug;

CREATE VIEW v_order_summary AS
SELECT 
    o.*,
    u.first_name, u.last_name, u.email, u.phone,
    a.address_line1, a.city, a.governorate,
    s.tracking_number, s.carrier_name, s.status as shipment_status,
    COUNT(oi.id) as items_count
FROM orders o
LEFT JOIN users u ON o.user_id = u.id
LEFT JOIN addresses a ON o.address_id = a.id
LEFT JOIN shipments s ON o.id = s.order_id
LEFT JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id, u.first_name, u.last_name, u.email, u.phone,
         a.address_line1, a.city, a.governorate,
         s.tracking_number, s.carrier_name, s.status;

-- Fin du schéma cleano.tn
