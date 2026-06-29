"use client";

import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart, setIsCartOpen } = useCart();
  const router = useRouter();

  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetch('/api/admin/products')
      .then(r => r.json())
      .then(data => {
        setProduct(data.find((p: Product) => p.id === params.id) || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return <div className="container" style={{ padding: "100px 20px", textAlign: "center" }}>Завантаження...</div>;
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: "100px 20px", textAlign: "center" }}>
        <h2>Товар не знайдено</h2>
        <button onClick={() => router.push("/")} className="button" style={{ marginTop: "20px" }}>Повернутися</button>
      </div>
    );
  }

  const handleBuy = () => {
    addToCart({
      ...product,
      price: product.price
    }, quantity);
    setIsCartOpen(true);
  };

  return (
    <div className="container" style={{ padding: "60px 20px" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "40px" }}>
        
        {/* Product Image */}
        <div style={{ flex: "1 1 45%", background: "var(--bg-subtle)", borderRadius: "24px", padding: "20px" }}>
          <img 
            src={product.image} 
            alt={product.name} 
            style={{ width: "100%", height: "auto", borderRadius: "16px", objectFit: "cover" }} 
          />
        </div>

        {/* Product Details */}
        <div style={{ flex: "1 1 45%", display: "flex", flexDirection: "column" }}>
          <h1 style={{ fontSize: "2.5rem", marginBottom: "20px" }}>{product.name}</h1>
          
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--primary)", marginBottom: "30px", display: "flex", alignItems: "center", gap: "16px" }}>
            {product.oldPrice && (
              <del aria-hidden="true" style={{ fontSize: "1.3rem", color: "var(--text-secondary)", opacity: 0.6, fontWeight: 500 }}>
                {product.oldPrice} ₴
              </del>
            )}
            <span>{product.price} ₴</span>
          </div>

          <p style={{ fontSize: "1.1rem", lineHeight: "1.6", color: "var(--text-secondary)", marginBottom: "30px" }}>
            {product.description}
          </p>

          {/* Removed packaging selector */}

          <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
            <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--border)", borderRadius: "10px", background: "var(--bg-subtle)" }}>
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ padding: "14px 20px", background: "transparent", border: "none", cursor: "pointer", fontSize: "1.2rem", fontWeight: "bold" }}>-</button>
              <span style={{ padding: "0 20px", fontSize: "1.2rem", fontWeight: "bold" }}>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} style={{ padding: "14px 20px", background: "transparent", border: "none", cursor: "pointer", fontSize: "1.2rem", fontWeight: "bold" }}>+</button>
            </div>
            
            <button 
              className="button" 
              onClick={handleBuy}
              style={{ flex: 1, fontSize: "1.2rem", padding: "14px 20px" }}
            >
              ДОДАТИ В КОШИК
            </button>
          </div>

          <div style={{ borderTop: "1px solid var(--border)", paddingTop: "30px", display: "flex", flexDirection: "column", gap: "15px" }}>
             <div style={{ display: "flex", gap: "10px", alignItems: "center", color: "var(--text-secondary)" }}>
               <span style={{ fontSize: "1.2rem" }}>🚚</span> Швидка доставка Новою Поштою (1-2 дні)
             </div>
             <div style={{ display: "flex", gap: "10px", alignItems: "center", color: "var(--text-secondary)" }}>
               <span style={{ fontSize: "1.2rem" }}>💳</span> Оплата при отриманні або на карту
             </div>
             <div style={{ display: "flex", gap: "10px", alignItems: "center", color: "var(--text-secondary)" }}>
               <span style={{ fontSize: "1.2rem" }}>❄️</span> Доставляється у спеціальному термобоксі
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
