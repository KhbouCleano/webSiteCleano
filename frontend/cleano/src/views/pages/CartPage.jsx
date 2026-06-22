// ============================================================
// src/views/pages/CartPage.jsx
// ============================================================
import { useState, useEffect } from "react";
import { useCartController } from "../../controllers/useCartController";
import useAppStore from "../../store/useAppStore";

const FONT_FAMILY = "'Raleway', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

const CartPage = () => {
  const { cartItems, handleRemove, handleQtyChange, clearCart,
          subtotal, shipping, total, count } = useCartController();
  const navigate = useAppStore((s) => s.navigate);

  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 480);
      setIsTablet(window.innerWidth <= 768 && window.innerWidth > 480);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Prix fixe en TND
  const FIXED_PRICE_TND = 15;
  const safeSubtotal = cartItems.reduce((s, { qty }) => s + FIXED_PRICE_TND * qty, 0);
  const safeShipping = safeSubtotal >= 35 ? 0 : 4.99;
  const safeTotal = safeSubtotal + safeShipping;

  const isResponsive = isMobile || isTablet;

  return (
    <div className="page-enter" style={{ fontFamily: FONT_FAMILY, minHeight: "100vh", background: "#F8F9FF" }}>

      {/* Header de la page avec image de fond */}
      <div style={{
        position: "relative",
        padding: isMobile ? "30px 0 40px" : (isTablet ? "35px 0 45px" : "40px 0 50px"),
        color: "#fff",
        marginTop: "calc(-1 * var(--header-h, 80px))",
        paddingTop: `calc(var(--header-h, 80px) + ${isMobile ? 30 : 40}px)`,
        overflow: "hidden",
                  height:"39rem",

      }}>
        {/* Image de fond du bannier */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: "url('/pannier.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          zIndex: 0,
        }} />

        {/* Overlay dégradé avec densité de couleur réduite */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "linear-gradient(135deg, rgba(27,37,89,0.5) 0%, rgba(42,58,143,0.4) 45%, rgba(231,57,139,0.3) 100%)",
          zIndex: 1,
        }} />

        {/* Contenu du header */}
        <div className="container" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 2 }}>
          <h1 style={{
            fontFamily: FONT_FAMILY,
            fontSize: isMobile ? 28 : (isTablet ? 32 : 36),
            fontWeight: 900,
            marginBottom: 8,
            letterSpacing: "-.02em",
            textShadow: "0 2px 10px rgba(0,0,0,0.2)",
          }}>Mon Panier</h1>
          <p style={{
            color: "rgba(255,255,255,0.9)",
            fontSize: isMobile ? 13 : 15,
            fontFamily: FONT_FAMILY,
            textShadow: "0 1px 5px rgba(0,0,0,0.15)",
          }}>
            {cartItems.length} article{cartItems.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Image du panier en dessous du bannier - position relative */}
      <div style={{
        position: "relative",
        top:"-5rem",
        right:"-28rem",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        marginTop: "-40px",
        marginBottom: "20px",
        zIndex: 10,
      }}>
        <div style={{
          position: "relative",
          width: isMobile ? "120px" : (isTablet ? "160px" : "200px"),
          height: isMobile ? "120px" : (isTablet ? "160px" : "200px"),
          borderRadius: "50%",
          background: "linear-gradient(135deg, #fff, #F8F9FF)",
          boxShadow: "0 10px 30px rgba(231,57,139,0.2), 0 0 0 8px rgba(255,255,255,0.9)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}>
          <img
            src="/pannier01.png"
            alt="Panier"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container" style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: isMobile ? "32px 16px 60px" : (isTablet ? "40px 20px 70px" : "48px 24px 80px")
      }}>
        {cartItems.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: isMobile ? "40px 20px" : "80px 0",
            background: "#fff",
            borderRadius: 24,
            border: "1px solid #E8EAF6",
            boxShadow: "0 4px 24px rgba(27,37,89,0.05)"
          }}>
            <div style={{ fontSize: isMobile ? 48 : 64, marginBottom: 20 }}>🛒</div>
            <h2 style={{ fontSize: isMobile ? 18 : 22, fontWeight: 700, marginBottom: 12, color: "#1B2559" }}>
              Votre panier est vide
            </h2>
            <p style={{ fontSize: isMobile ? 13 : 14, color: "#8892B0", marginBottom: 28 }}>
              Ajoutez des produits depuis notre catalogue
            </p>
            <button
              className="btn btn-primary"
              onClick={() => navigate("products")}
              style={{
                background: "linear-gradient(135deg, #E7398B, #F472B6)",
                color: "#fff",
                border: "none",
                padding: isMobile ? "10px 24px" : "12px 32px",
                borderRadius: 30,
                fontSize: isMobile ? 13 : 14,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: FONT_FAMILY
              }}
            >
              Découvrir nos produits
            </button>
          </div>
        ) : (
          <div style={{
            display: "flex",
            flexDirection: isResponsive ? "column" : "row",
            gap: isMobile ? 24 : 32,
            alignItems: "flex-start",
          }}>
            {/* Liste des articles */}
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              flex: isResponsive ? "none" : 1,
              width: isResponsive ? "100%" : "auto"
            }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingBottom: 12,
                borderBottom: "1px solid #E8EAF6",
                flexWrap: "wrap",
                gap: 10
              }}>
                <h2 style={{ fontSize: isMobile ? 16 : 18, fontWeight: 700, color: "#1B2559" }}>
                  Articles ({cartItems.length})
                </h2>
                <button
                  style={{
                    fontSize: isMobile ? 12 : 13,
                    color: "#E7398B",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: FONT_FAMILY,
                    fontWeight: 500
                  }}
                  onClick={clearCart}
                >
                  Vider le panier
                </button>
              </div>

              {cartItems.map(({ product, qty }) => (
                <div key={product.id} style={{
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  gap: isMobile ? 12 : 16,
                  padding: isMobile ? 16 : 20,
                  background: "#fff",
                  borderRadius: 20,
                  border: "1px solid #E8EAF6",
                  boxShadow: "0 2px 12px rgba(27,37,89,0.04)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}>
                  <img
                    src={product.img || product.image}
                    alt={product.name}
                    style={{
                      width: isMobile ? 80 : 100,
                      height: isMobile ? 80 : 100,
                      borderRadius: 12,
                      objectFit: "cover",
                      background: "#F8F9FF",
                      alignSelf: isMobile ? "center" : "flex-start"
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: isMobile ? 14 : 16, fontWeight: 700, marginBottom: 4, color: "#1B2559" }}>
                      {product.name}
                    </h3>
                    {product.subtitle && (
                      <p style={{ fontSize: isMobile ? 10 : 11, fontWeight: 600, color: "#E7398B", marginBottom: 10, textTransform: "uppercase", letterSpacing: ".06em" }}>
                        {product.subtitle}
                      </p>
                    )}
                    <p style={{ fontSize: isMobile ? 16 : 18, fontWeight: 800, color: "#E7398B", marginBottom: 12 }}>
                      {FIXED_PRICE_TND.toFixed(2)} TND
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        border: "1px solid #E8EAF6",
                        borderRadius: 12,
                        overflow: "hidden",
                        background: "#F8F9FF"
                      }}>
                        <button
                          onClick={() => handleQtyChange(product.id, qty - 1)}
                          style={{
                            width: isMobile ? 32 : 36,
                            height: isMobile ? 32 : 36,
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            fontSize: isMobile ? 16 : 18,
                            fontWeight: 600,
                            color: "#1B2559"
                          }}
                        >−</button>
                        <span style={{ width: isMobile ? 32 : 40, textAlign: "center", fontWeight: 600, color: "#1B2559" }}>
                          {qty}
                        </span>
                        <button
                          onClick={() => handleQtyChange(product.id, qty + 1)}
                          style={{
                            width: isMobile ? 32 : 36,
                            height: isMobile ? 32 : 36,
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            fontSize: isMobile ? 16 : 18,
                            fontWeight: 600,
                            color: "#E7398B"
                          }}
                        >+</button>
                      </div>
                      <button
                        onClick={() => handleRemove(product)}
                        style={{
                          fontSize: isMobile ? 11 : 12,
                          color: "#8892B0",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontFamily: FONT_FAMILY,
                          transition: "color 0.2s"
                        }}
                        onMouseEnter={e => e.target.style.color = "#E7398B"}
                        onMouseLeave={e => e.target.style.color = "#8892B0"}
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                  {!isMobile && (
                    <div style={{
                      fontSize: 18,
                      fontWeight: 800,
                      color: "#1B2559",
                      whiteSpace: "nowrap",
                      alignSelf: "center"
                    }}>
                      {(FIXED_PRICE_TND * qty).toFixed(2)} TND
                    </div>
                  )}
                  {isMobile && (
                    <div style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginTop: 8,
                      paddingTop: 8,
                      borderTop: "1px solid #E8EAF6"
                    }}>
                      <div style={{
                        fontSize: 16,
                        fontWeight: 800,
                        color: "#1B2559"
                      }}>
                        {(FIXED_PRICE_TND * qty).toFixed(2)} TND
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Résumé de la commande */}
            <div style={{
              background: "#fff",
              borderRadius: 24,
              padding: isMobile ? 20 : 28,
              border: "1px solid #E8EAF6",
              position: isResponsive ? "relative" : "sticky",
              top: isResponsive ? "auto" : 100,
              boxShadow: "0 8px 32px rgba(27,37,89,0.06)",
              width: isResponsive ? "100%" : "360px",
              flexShrink: 0
            }}>
              <h2 style={{ fontSize: isMobile ? 16 : 18, fontWeight: 700, marginBottom: 20, color: "#1B2559" }}>
                Récapitulatif
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 24 }}>
                <Row label="Sous-total" value={`${safeSubtotal.toFixed(2)} TND`} isMobile={isMobile} />
                <Row label="Livraison" value={safeShipping === 0 ? "Gratuite 🎉" : `${safeShipping.toFixed(2)} TND`} isMobile={isMobile} />
                <div style={{ height: 1, background: "#E8EAF6", margin: "4px 0" }} />
                <Row label="Total" value={`${safeTotal.toFixed(2)} TND`} bold isMobile={isMobile} />
              </div>

              {/* Barre de progression livraison gratuite */}
              {safeShipping > 0 && (
                <div style={{ marginBottom: 24, padding: "12px 14px", background: "#F8F9FF", borderRadius: 12, border: "1px solid #E8EAF6" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontSize: isMobile ? 10 : 11, color: "#8892B0" }}>Livraison gratuite dès 35 TND</span>
                    <span style={{ fontSize: isMobile ? 10 : 11, fontWeight: 700, color: "#E7398B" }}>
                      {Math.min((safeSubtotal / 35) * 100, 100).toFixed(0)}%
                    </span>
                  </div>
                  <div style={{ height: 5, borderRadius: 10, background: "#E8EAF6", overflow: "hidden" }}>
                    <div style={{
                      height: "100%",
                      background: "linear-gradient(90deg, #E7398B, #F472B6)",
                      borderRadius: 10,
                      width: `${Math.min((safeSubtotal / 35) * 100, 100)}%`,
                      transition: "width 0.8s ease-out"
                    }} />
                  </div>
                  <p style={{ fontSize: isMobile ? 10 : 11, color: "#8892B0", marginTop: 8 }}>
                    Encore {Math.max(0, 35 - safeSubtotal).toFixed(2)} TND pour la livraison gratuite
                  </p>
                </div>
              )}

              <button
                className="btn btn-accent"
                style={{
                  width: "100%",
                  justifyContent: "center",
                  padding: isMobile ? "12px" : "14px",
                  background: "linear-gradient(135deg, #E7398B, #F472B6)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 16,
                  fontSize: isMobile ? 13 : 14,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: FONT_FAMILY,
                  boxShadow: "0 6px 20px rgba(231,57,139,0.35)",
                  transition: "transform 0.2s, box-shadow 0.2s"
                }}
                onClick={() => navigate("checkout")}
                onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 10px 28px rgba(231,57,139,0.45)" }}
                onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 6px 20px rgba(231,57,139,0.35)" }}
              >
                Passer la commande →
              </button>

              <button
                className="btn btn-ghost"
                style={{
                  width: "100%",
                  justifyContent: "center",
                  marginTop: 12,
                  padding: isMobile ? "10px" : "12px",
                  background: "transparent",
                  color: "#1B2559",
                  border: "1px solid #E8EAF6",
                  borderRadius: 16,
                  fontSize: isMobile ? 12 : 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: FONT_FAMILY,
                  transition: "background 0.2s"
                }}
                onClick={() => navigate("products")}
                onMouseEnter={e => e.target.style.background = "#F8F9FF"}
                onMouseLeave={e => e.target.style.background = "transparent"}
              >
                ← Continuer mes achats
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Row = ({ label, value, bold, isMobile }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <span style={{
      fontSize: bold ? (isMobile ? 14 : 15) : (isMobile ? 12 : 13),
      color: bold ? "#1B2559" : "#8892B0",
      fontWeight: bold ? 700 : 400,
      fontFamily: FONT_FAMILY
    }}>{label}</span>
    <span style={{
      fontSize: bold ? (isMobile ? 18 : 20) : (isMobile ? 13 : 14),
      fontWeight: bold ? 800 : 600,
      color: bold ? "#E7398B" : "#1B2559",
      fontFamily: FONT_FAMILY
    }}>{value}</span>
  </div>
);

export default CartPage;