// ============================================================
// src/views/components/cart/CartDrawer.jsx
// ============================================================
import { motion, AnimatePresence } from "framer-motion";
import { useCartController } from "../../../controllers/useCartController";
import useAppStore from "../../../store/useAppStore";

const C = {
  navy:      "#1B2559",
  magenta:   "#E7398B",
  rose:      "#F472B6",
  lavender:  "#E8EAF6",
  muted:     "#8892B0",
  offwhite:  "#F8F9FF",
  white:     "#FFFFFF",
  success:   "#10B981",
  danger:    "#e7398b",
};

const FIXED_PRICE_TND = 15;

const safePrice = (_p) => FIXED_PRICE_TND;

/* ══════════════════════════════════════════
   MAIN DRAWER
══════════════════════════════════════════ */
const CartDrawer = () => {
  const {
    cartItems, cartOpen, closeCart,
    handleRemove, handleQtyChange,
    subtotal, shipping, total, count,
  } = useCartController();
  const navigate = useAppStore((s) => s.navigate);

  const safeSubtotal = cartItems.reduce((s, { qty }) => s + FIXED_PRICE_TND * qty, 0);
  const safeShipping = safeSubtotal >= 35 ? 0 : 4.99;
  const safeTotal    = safeSubtotal + safeShipping;
  const progress     = Math.min((safeSubtotal / 35) * 100, 100);

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeCart}
            style={{
              position: "fixed", inset: 0, zIndex: 200,
              background: "rgba(15,20,50,0.65)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 60, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.94 }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            style={{
              position: "fixed", inset: 0, zIndex: 201,
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: "20px 16px",
              pointerEvents: "none",
            }}
          >
            <div style={{
              pointerEvents: "auto",
              width: "100%",
              maxWidth: 920,
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              borderRadius: "28px",
              overflow: "hidden",
              background: C.offwhite,
              boxShadow: "0 48px 120px rgba(15,20,50,0.30), 0 16px 40px rgba(231,57,139,0.15)",
              border: `1px solid rgba(255,255,255,0.9)`,
            }}>

              {/* ── TOP ACCENT BAR ── */}
              <div style={{
                height: 4,
                background: `linear-gradient(90deg, ${C.magenta}, ${C.rose}, #a78bfa, ${C.magenta})`,
                backgroundSize: "200% 100%",
                animation: "shimmer 3s linear infinite",
                flexShrink: 0,
              }} />

              {/* ── HEADER ── */}
              <div style={{
                padding: "24px 32px 20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexShrink: 0,
                background: C.white,
                borderBottom: `1px solid ${C.lavender}`,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  {/* Logo cart */}
                  <div style={{
                    width: 48, height: 48,
                    borderRadius: 16,
                    background: `linear-gradient(135deg, ${C.magenta} 0%, ${C.rose} 100%)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: `0 8px 24px ${C.magenta}40`,
                    flexShrink: 0,
                  }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                      stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="9" cy="21" r="1"/>
                      <circle cx="20" cy="21" r="1"/>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                    </svg>
                  </div>

                  <div>
                    <h2 style={{
                      fontFamily: "'Raleway', sans-serif",
                      fontSize: 22, fontWeight: 900,
                      color: C.navy, margin: 0,
                      letterSpacing: "-.03em",
                    }}>
                      Mon Panier
                    </h2>
                    <p style={{
                      fontSize: 12, color: C.muted,
                      fontFamily: "'Rubik', sans-serif",
                      margin: 0, fontWeight: 500,
                      letterSpacing: ".04em",
                      textTransform: "uppercase",
                    }}>
                      {count} article{count !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.08, backgroundColor: C.lavender }}
                  whileTap={{ scale: 0.92 }}
                  onClick={closeCart}
                  style={{
                    width: 40, height: 40, borderRadius: 12,
                    background: C.lavender,
                    border: "none",
                    cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: C.navy,
                  }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </motion.button>
              </div>

              {/* ── BODY ── */}
              <div style={{
                display: "grid",
                gridTemplateColumns: cartItems.length > 0 ? "1fr 310px" : "1fr",
                flex: 1,
                overflow: "hidden",
                minHeight: 0,
              }} className="cart-body-grid">

                {/* ── ITEMS LIST ── */}
                <div style={{
                  overflowY: "auto",
                  padding: "24px 28px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  background: C.offwhite,
                }} className="cart-items-list">
                  {cartItems.length === 0 ? (
                    <EmptyCart onClose={closeCart} onNavigate={() => { closeCart(); navigate("products"); }} />
                  ) : cartItems.map(({ product, qty }, i) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                    >
                      <CartItem
                        product={product}
                        qty={qty}
                        onRemove={handleRemove}
                        onQtyChange={handleQtyChange}
                      />
                    </motion.div>
                  ))}
                </div>

                {/* ── SUMMARY ── */}
                {cartItems.length > 0 && (
                  <div style={{
                    borderLeft: `1px solid ${C.lavender}`,
                    padding: "28px 24px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 20,
                    background: C.white,
                    flexShrink: 0,
                    overflowY: "auto",
                  }} className="cart-summary">
                    {/* Titre */}
                    <div>
                      <p style={{
                        fontSize: 10, fontWeight: 700,
                        color: C.muted, margin: 0,
                        letterSpacing: ".12em",
                        textTransform: "uppercase",
                        fontFamily: "'Rubik', sans-serif",
                      }}>Récapitulatif</p>
                      <div style={{
                        height: 2, width: 32,
                        background: `linear-gradient(90deg, ${C.magenta}, ${C.rose})`,
                        borderRadius: 2, marginTop: 6,
                      }} />
                    </div>

                    {/* Lignes prix */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                      <PriceRow label="Sous-total" value={`${safeSubtotal.toFixed(2)} TND`} />
                      <PriceRow
                        label="Livraison"
                        value={safeShipping === 0 ? "Gratuite" : `${safeShipping.toFixed(2)} TND`}
                        valueColor={safeShipping === 0 ? C.success : C.navy}
                      />

                      {/* Barre progression livraison */}
                      {safeShipping > 0 && (
                        <div style={{ padding: "12px 14px", background: C.offwhite, borderRadius: 12, border: `1px solid ${C.lavender}` }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                            <span style={{ fontSize: 11, color: C.muted, fontFamily: "'Rubik', sans-serif" }}>
                              Livraison gratuite dès 35 TND
                            </span>
                            <span style={{ fontSize: 11, fontWeight: 700, color: C.magenta, fontFamily: "'Rubik', sans-serif" }}>
                              {progress.toFixed(0)}%
                            </span>
                          </div>
                          <div style={{
                            height: 5, borderRadius: 10,
                            background: C.lavender, overflow: "hidden",
                          }}>
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                              style={{
                                height: "100%",
                                background: `linear-gradient(90deg, ${C.magenta}, ${C.rose})`,
                                borderRadius: 10,
                              }}
                            />
                          </div>
                          <p style={{
                            fontSize: 11, color: C.muted,
                            fontFamily: "'Rubik', sans-serif",
                            margin: "6px 0 0",
                          }}>
                            Encore {Math.max(0, 35 - safeSubtotal).toFixed(2)} TND pour la livraison gratuite
                          </p>
                        </div>
                      )}

                      <div style={{ height: 1, background: C.lavender }} />

                      {/* Total */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                        <span style={{
                          fontSize: 15, fontWeight: 700,
                          color: C.navy, fontFamily: "'Raleway', sans-serif",
                        }}>Total</span>
                        <span style={{
                          fontSize: 24, fontWeight: 900,
                          color: C.navy, fontFamily: "'Raleway', sans-serif",
                          letterSpacing: "-.02em",
                        }} className="total-amount">{safeTotal.toFixed(2)} TND</span>
                      </div>
                    </div>

                    {/* Trust badges */}
                    <div style={{
                      display: "flex", flexDirection: "column", gap: 0,
                      borderRadius: 14, overflow: "hidden",
                      border: `1px solid ${C.lavender}`,
                    }}>
                      {[
                        { icon: <LockIcon />, label: "Paiement sécurisé" },
                        { icon: <TruckIcon />, label: "Livraison 24-48h" },
                        { icon: <ReturnIcon />, label: "Retours gratuits" },
                      ].map(({ icon, label }, i, arr) => (
                        <div key={label} style={{
                          display: "flex", alignItems: "center", gap: 10,
                          padding: "10px 14px",
                          background: C.white,
                          borderBottom: i < arr.length - 1 ? `1px solid ${C.lavender}` : "none",
                        }}>
                          <span style={{ color: C.magenta, flexShrink: 0 }}>{icon}</span>
                          <span style={{
                            fontSize: 12, color: C.navy,
                            fontFamily: "'Rubik', sans-serif",
                            fontWeight: 500,
                          }}>{label}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA Buttons */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: "auto" }}>
                      <motion.button
                        whileHover={{ scale: 1.02, filter: "brightness(1.06)" }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => { closeCart(); navigate("checkout"); }}
                        style={{
                          background: `linear-gradient(135deg, ${C.magenta} 0%, ${C.rose} 100%)`,
                          color: "#fff", border: "none", borderRadius: 14,
                          padding: "15px", fontSize: 14, fontWeight: 700,
                          fontFamily: "'Poppins', sans-serif", cursor: "pointer",
                          boxShadow: `0 8px 28px ${C.magenta}45`,
                          letterSpacing: ".02em",
                        }}>
                        Passer la commande
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.01, background: C.lavender }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => { closeCart(); navigate("cart"); }}
                        style={{
                          background: C.offwhite,
                          color: C.navy,
                          border: `1px solid ${C.lavender}`,
                          borderRadius: 14, padding: "12px",
                          fontSize: 13, fontWeight: 600,
                          fontFamily: "'Poppins', sans-serif", cursor: "pointer",
                          transition: "background .2s",
                        }}>
                        Voir le panier complet
                      </motion.button>

                      <button
                        onClick={closeCart}
                        style={{
                          background: "none", border: "none",
                          color: C.muted, fontSize: 12,
                          fontFamily: "'Rubik', sans-serif",
                          cursor: "pointer", padding: "6px",
                          display: "flex", alignItems: "center",
                          justifyContent: "center", gap: 5,
                        }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <path d="M19 12H5M12 19l-7-7 7-7"/>
                        </svg>
                        Continuer mes achats
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          <style>{`
            @keyframes shimmer {
              0%   { background-position: 0% 0%; }
              100% { background-position: 200% 0%; }
            }

            /* ── RESPONSIVE STYLES ── */

            /* Tablette : ≤ 768px */
            @media (max-width: 768px) {
              .cart-body-grid {
                grid-template-columns: 1fr !important;
                overflow-y: auto !important;
              }

              .cart-items-list {
                max-height: 50vh !important;
                padding: 20px !important;
              }

              .cart-summary {
                border-left: none !important;
                border-top: 1px solid ${C.lavender} !important;
                padding: 24px 20px !important;
                max-height: 45vh !important;
              }

              .total-amount {
                font-size: 20px !important;
              }
            }

            /* Mobile : ≤ 480px */
            @media (max-width: 480px) {
              .cart-body-grid {
                grid-template-columns: 1fr !important;
              }

              .cart-items-list {
                padding: 16px !important;
                gap: 10px !important;
              }

              .cart-summary {
                padding: 20px 16px !important;
                gap: 16px !important;
              }

              .total-amount {
                font-size: 18px !important;
              }
            }

            /* Petit mobile : ≤ 380px */
            @media (max-width: 380px) {
              .cart-items-list {
                padding: 12px !important;
              }

              .cart-summary {
                padding: 16px 12px !important;
              }
            }
          `}</style>
        </>
      )}
    </AnimatePresence>
  );
};

/* ══════════════════════════════════════════
   EMPTY CART
══════════════════════════════════════════ */
const EmptyCart = ({ onNavigate }) => (
  <div style={{
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    padding: "80px 32px", gap: 20, textAlign: "center",
  }} className="empty-cart">
    <div style={{
      width: 80, height: 80, borderRadius: 24,
      background: C.lavender,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
        stroke={C.muted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1"/>
        <circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
      </svg>
    </div>
    <div>
      <p style={{
        fontSize: 18, fontWeight: 800, color: C.navy,
        fontFamily: "'Raleway', sans-serif", margin: "0 0 6px",
      }}>Panier vide</p>
      <p style={{
        fontSize: 13, color: C.muted,
        fontFamily: "'Rubik', sans-serif", margin: 0,
      }}>Vous n'avez pas encore ajouté d'articles.</p>
    </div>
    <motion.button
      whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
      onClick={onNavigate}
      style={{
        background: `linear-gradient(135deg, ${C.magenta}, ${C.rose})`,
        color: "#fff", border: "none", borderRadius: 14,
        padding: "12px 28px", fontSize: 14, fontWeight: 700,
        fontFamily: "'Poppins', sans-serif", cursor: "pointer",
        boxShadow: `0 6px 22px ${C.magenta}40`,
      }}>
      Découvrir nos produits
    </motion.button>
  </div>
);

/* ══════════════════════════════════════════
   CART ITEM
══════════════════════════════════════════ */
const CartItem = ({ product, qty, onRemove, onQtyChange }) => {
  const price = FIXED_PRICE_TND;
  return (
    <div style={{
      display: "flex", gap: 14,
      padding: "16px",
      borderRadius: 16,
      background: C.white,
      border: `1px solid ${C.lavender}`,
      boxShadow: "0 2px 12px rgba(27,37,89,0.05)",
    }} className="cart-item">
      {/* Image */}
      <div style={{
        width: 76, height: 76, borderRadius: 12,
        background: product.color ? `${product.color}12` : C.lavender,
        border: `1px solid ${C.lavender}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, overflow: "hidden",
      }}>
        <img
          src={product.img || product.image}
          alt={product.name}
          style={{ width: "76%", height: "76%", objectFit: "contain" }}
        />
      </div>

      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <p style={{
            fontSize: 14, fontWeight: 800,
            color: C.navy, margin: "0 0 2px",
            fontFamily: "'Raleway', sans-serif",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>{product.name}</p>
          {product.subtitle && (
            <p style={{
              fontSize: 10, fontWeight: 700,
              color: product.color || C.magenta,
              fontFamily: "'Rubik', sans-serif",
              textTransform: "uppercase", letterSpacing: ".06em",
              margin: 0,
            }}>{product.subtitle}</p>
          )}
        </div>

        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: "space-between", marginTop: 10,
          flexWrap: "wrap",
          gap: 8,
        }} className="cart-item-actions">
          <QtyControl
            qty={qty}
            color={product.color}
            onDec={() => onQtyChange(product.id, qty - 1)}
            onInc={() => onQtyChange(product.id, qty + 1)}
          />

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{
              fontSize: 16, fontWeight: 900,
              color: C.navy, fontFamily: "'Raleway', sans-serif",
            }}>
              {(price * qty).toFixed(2)} TND
            </span>
            <motion.button
              whileHover={{ scale: 1.1, background: "#fecaca" }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onRemove(product)}
              style={{
                width: 30, height: 30, borderRadius: 9,
                background: "#fee2e2", border: "none",
                cursor: "pointer", color: C.danger,
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background .15s",
              }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6M9 6V4h6v2"/>
              </svg>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════
   QTY CONTROL
══════════════════════════════════════════ */
const QtyControl = ({ qty, onDec, onInc, color }) => (
  <div style={{
    display: "inline-flex", alignItems: "center",
    border: `1px solid ${C.lavender}`,
    borderRadius: 10, overflow: "hidden",
    background: C.offwhite,
  }}>
    <button onClick={onDec} style={{
      width: 32, height: 32, border: "none",
      background: "transparent", cursor: "pointer",
      fontSize: 16, fontWeight: 700, color: C.navy,
      display: "flex", alignItems: "center", justifyContent: "center",
      transition: "background .15s",
    }}
      onMouseEnter={e => e.currentTarget.style.background = C.lavender}
      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
    >−</button>

    <span style={{
      minWidth: 32, textAlign: "center",
      fontSize: 14, fontWeight: 800,
      color: C.navy, fontFamily: "'Raleway', sans-serif",
      borderLeft: `1px solid ${C.lavender}`,
      borderRight: `1px solid ${C.lavender}`,
      padding: "0 4px", lineHeight: "32px",
    }}>{qty}</span>

    <button onClick={onInc} style={{
      width: 32, height: 32, border: "none",
      background: "transparent", cursor: "pointer",
      fontSize: 16, fontWeight: 700,
      color: color || C.magenta,
      display: "flex", alignItems: "center", justifyContent: "center",
      transition: "background .15s",
    }}
      onMouseEnter={e => e.currentTarget.style.background = `${color || C.magenta}15`}
      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
    >+</button>
  </div>
);

/* ══════════════════════════════════════════
   PRICE ROW
══════════════════════════════════════════ */
const PriceRow = ({ label, value, valueColor }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <span style={{
      fontSize: 13, color: C.muted,
      fontFamily: "'Rubik', sans-serif", fontWeight: 400,
    }}>{label}</span>
    <span style={{
      fontSize: 14, fontWeight: 700,
      color: valueColor || C.navy,
      fontFamily: "'Rubik', sans-serif",
    }}>{value}</span>
  </div>
);

/* ══════════════════════════════════════════
   ICONS SVG (sans emoji)
══════════════════════════════════════════ */
const LockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const TruckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13" rx="1"/>
    <path d="M16 8h4l3 5v3h-7V8z"/>
    <circle cx="5.5" cy="18.5" r="2.5"/>
    <circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
);
const ReturnIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
    <path d="M3 3v5h5"/>
  </svg>
);

export default CartDrawer;