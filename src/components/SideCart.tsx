"use client";

import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SideCart() {
  const { isCartOpen, setIsCartOpen, items, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderStatus, setOrderStatus] = useState<"idle" | "success" | "error">("idle");
  const [formData, setFormData] = useState({ name: "", phone: "" });



  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsOrdering(true);
    setOrderStatus("idle");

    try {
      const response = await fetch("/api/quick-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, items, totalPrice }),
      });

      if (response.ok) {
        setOrderStatus("success");
        clearCart();
        setTimeout(() => {
          setIsCartOpen(false);
          setOrderStatus("idle");
        }, 3000);
      } else {
        setOrderStatus("error");
      }
    } catch (error) {
      setOrderStatus("error");
    } finally {
      setIsOrdering(false);
    }
  };

  return (
    <>
      {isCartOpen && (
        <>
          <div 
        onClick={() => setIsCartOpen(false)}
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(4px)",
          zIndex: 10000
        }}
      />
      <div 
        style={{
          position: "fixed",
          top: 0, right: 0, bottom: 0,
          width: "100%", maxWidth: "450px",
          background: "var(--bg)",
          zIndex: 10001,
          boxShadow: "-5px 0 30px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
          animation: "slideIn 0.3s forwards",
          overflowY: "auto"
        }}
      >
        <div style={{ padding: "20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontSize: "1.5rem", margin: 0 }}>Ваш кошик</h2>
          <button 
            onClick={() => setIsCartOpen(false)}
            style={{ background: "transparent", border: "none", fontSize: "1.5rem", cursor: "pointer" }}
          >&times;</button>
        </div>

        <div className="widget_shopping_cart_content" style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
          {items.length === 0 ? (
            <p className="woocommerce-mini-cart__empty-message" style={{ textAlign: "center", marginTop: "50px", color: "var(--text-secondary)" }}>Кошик порожній.</p>
          ) : (
            <>
              <ul className="woocommerce-mini-cart cart_list product_list_widget" style={{ listStyle: "none", margin: 0, padding: "20px", flex: 1 }}>
                {items.map(({ product, quantity }) => (
                  <li className="woocommerce-mini-cart-item mini_cart_item" key={product.id} style={{ display: "flex", gap: "15px", borderBottom: "1px solid var(--border)", paddingBottom: "15px", marginBottom: "15px" }}>
                    <img src={product.image} alt={product.name} style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px" }} />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: "0 0 10px 0", fontSize: "1rem" }}>{product.name}</h4>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "var(--bg-subtle)", borderRadius: "20px", padding: "5px 10px" }}>
                          <button onClick={() => updateQuantity(product.id, quantity - 1)} style={{ border: "none", background: "transparent", cursor: "pointer", fontWeight: "bold" }}>-</button>
                          <span>{quantity}</span>
                          <button onClick={() => updateQuantity(product.id, quantity + 1)} style={{ border: "none", background: "transparent", cursor: "pointer", fontWeight: "bold" }}>+</button>
                        </div>
                        <span style={{ fontWeight: 800 }}>{product.price * quantity} ₴</span>
                      </div>
                    </div>
                    <button onClick={() => removeFromCart(product.id)} style={{ background: "transparent", border: "none", color: "var(--text-secondary)", cursor: "pointer", display: "flex", alignItems: "center" }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>

              <div style={{ padding: "20px", background: "var(--bg-subtle)", borderTop: "1px solid var(--border)" }}>
                <p className="woocommerce-mini-cart__total total" style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", fontSize: "1.2rem", fontWeight: 800 }}>
                  <strong>Разом:</strong>
                  <span className="woocommerce-Price-amount amount"><bdi>{totalPrice}&nbsp;<span className="woocommerce-Price-currencySymbol">₴</span></bdi></span>
                </p>

                {orderStatus === "success" ? (
                  <div style={{ padding: "20px", background: "var(--green)", color: "white", borderRadius: "8px", textAlign: "center", fontWeight: "bold" }}>
                    Замовлення успішно оформлено! Ми вам зателефонуємо.
                  </div>
                ) : (
                  <form onSubmit={handleOrder} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                    <input 
                      type="text" 
                      placeholder="Ваше ім'я" 
                      required 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      style={{ padding: "12px", borderRadius: "8px", border: "1px solid var(--border)" }}
                    />
                    <input 
                      type="tel" 
                      placeholder="Ваш телефон" 
                      required 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      style={{ padding: "12px", borderRadius: "8px", border: "1px solid var(--border)" }}
                    />
                    
                    <div className="woocommerce-mini-cart__buttons buttons" style={{ display: "flex", flexDirection: "column", gap: "10px", margin: 0 }}>
                      <button type="submit" className="button" disabled={isOrdering} style={{ opacity: isOrdering ? 0.7 : 1, padding: "15px", fontSize: "1.1rem", borderRadius: "8px" }}>
                        {isOrdering ? "Відправка..." : "Швидке Замовлення"}
                      </button>
                      <button type="button" className="button checkout wc-forward" style={{ padding: "15px", fontSize: "1.1rem", borderRadius: "8px", background: "var(--bg-subtle)", color: "var(--text)", border: "1px solid var(--border)" }} onClick={() => { setIsCartOpen(false); router.push('/checkout'); }}>
                        Повне Оформлення
                      </button>
                    </div>
                  </form>
                )}
                {orderStatus === "error" && (
                  <p style={{ color: "var(--red)", marginTop: "10px", textAlign: "center" }}>Помилка відправки. Спробуйте ще раз.</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
        </>
      )}
      
      <button 
        className="floating-cart-btn"
        onClick={() => setIsCartOpen(true)}
        style={{
          position: "fixed",
          bottom: "100px",
          right: "30px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: "var(--primary)",
          color: "#fff",
          border: "none",
          boxShadow: "0 10px 25px rgba(232, 93, 4, 0.4)",
          cursor: "pointer",
          zIndex: 9998,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "transform 0.3s ease"
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
        onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        {items.length > 0 && (
          <span style={{
            position: "absolute",
            top: "-5px",
            right: "-5px",
            background: "#ef4444",
            color: "white",
            fontSize: "0.75rem",
            fontWeight: "bold",
            borderRadius: "50%",
            width: "24px",
            height: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "2px solid #fff"
          }}>
            {items.reduce((sum, item) => sum + item.quantity, 0)}
          </span>
        )}
      </button>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @media (max-width: 480px) {
          .floating-cart-btn {
            /* Keep desktop position to align with contact widget */
          }
        }
      `}</style>
    </>
  );
}
