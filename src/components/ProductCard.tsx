"use client";

import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [packaging, setPackaging] = useState("vacuum");
  const router = useRouter();
  
  const extraPrice = packaging === "glass" ? 50 : 0;
  const currentPrice = product.price + extraPrice;

  const handleBuy = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    addToCart({
      ...product,
      id: `${product.id}-${packaging}`,
      price: currentPrice,
      name: `${product.name} (${packaging === "glass" ? "Скло" : "Вакуум"})`
    });
  };

  return (
    <li 
      className="product type-product status-publish has-post-thumbnail instock purchasable"
      onClick={() => router.push(`/product/${product.id}`)}
      style={{ cursor: "pointer", display: "flex", flexDirection: "column", height: "100%" }}
    >
      <a href={`/product/${product.id}`} className="woocommerce-LoopProduct-link woocommerce-loop-product__link" style={{ textDecoration: 'none', display: 'block' }} onClick={e => e.preventDefault()}>
        <img 
          src={product.image} 
          alt={product.name} 
          className="attachment-woocommerce_thumbnail size-woocommerce_thumbnail"
        />
        <h2 className="woocommerce-loop-product__title">{product.name}</h2>
        <span className="price">
          {product.oldPrice && (
            <del aria-hidden="true" style={{ opacity: 0.5, marginRight: '8px', fontSize: '0.9em' }}>
              <span className="woocommerce-Price-amount amount">
                <bdi>{product.oldPrice + extraPrice}&nbsp;<span className="woocommerce-Price-currencySymbol">₴</span></bdi>
              </span>
            </del>
          )}
          <ins style={{ textDecoration: 'none' }}>
            <span className="woocommerce-Price-amount amount" style={{ color: product.oldPrice ? 'var(--primary)' : 'inherit', fontWeight: product.oldPrice ? 800 : 'inherit' }}>
              <bdi>{currentPrice}&nbsp;<span className="woocommerce-Price-currencySymbol">₴</span></bdi>
            </span>
          </ins>
        </span>
      </a>

      <div className="custom-packaging-field-loop" onClick={(e) => e.stopPropagation()} style={{ marginTop: "10px", width: "100%" }}>
        <select 
          className="packaging_type_loop"
          value={packaging} 
          onChange={(e) => setPackaging(e.target.value)}
        >
          <option value="vacuum">Вакуум (стандарт)</option>
          <option value="glass">Скляна банка (+50 грн)</option>
        </select>
      </div>

      <button 
        className="button add_to_cart_button ajax_add_to_cart"
        onClick={handleBuy}
      >
        Купити
      </button>
    </li>
  );
}

