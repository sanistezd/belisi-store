"use client";

import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const router = useRouter();
  
  const handleBuy = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    addToCart({
      ...product,
      price: product.price
    });
  };

  return (
    <li 
      className="product type-product status-publish has-post-thumbnail instock purchasable"
      onClick={() => router.push(`/product/${product.id}`)}
      style={{ cursor: "pointer", display: "flex", flexDirection: "column", height: "100%" }}
    >
      <a href={`/product/${product.id}`} className="woocommerce-LoopProduct-link woocommerce-loop-product__link" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', flex: 1 }} onClick={e => e.preventDefault()}>
        <img 
          src={product.image} 
          alt={product.name} 
          className="attachment-woocommerce_thumbnail size-woocommerce_thumbnail"
        />
        <h2 className="woocommerce-loop-product__title" style={{ flexGrow: 1 }}>{product.name}</h2>
        <span className="price" style={{ marginTop: 'auto' }}>
          {product.oldPrice && (
            <del aria-hidden="true" style={{ opacity: 0.5, marginRight: '8px', fontSize: '0.9em' }}>
              <span className="woocommerce-Price-amount amount">
                <bdi>{product.oldPrice}&nbsp;<span className="woocommerce-Price-currencySymbol">₴</span></bdi>
              </span>
            </del>
          )}
          <ins style={{ textDecoration: 'none' }}>
            <span className="woocommerce-Price-amount amount" style={{ color: product.oldPrice ? 'var(--primary)' : 'inherit', fontWeight: product.oldPrice ? 800 : 'inherit' }}>
              <bdi>{product.price}&nbsp;<span className="woocommerce-Price-currencySymbol">₴</span></bdi>
            </span>
          </ins>
        </span>
      </a>

      <button 
        className="button add_to_cart_button ajax_add_to_cart"
        onClick={handleBuy}
      >
        Купити
      </button>
    </li>
  );
}

