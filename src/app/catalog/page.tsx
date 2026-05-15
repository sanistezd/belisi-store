"use client";

import { defaultProducts } from "@/data/products";
import ProductCard from "@/components/ProductCard";

export default function CatalogPage() {
  const catalogProducts = defaultProducts.filter(p => p.category !== "promo");

  return (
    <div className="container" style={{ padding: "60px 20px" }}>
      <header className="page-header" style={{ textAlign: "center", marginBottom: "50px" }}>
        <h1 style={{ fontSize: "2.8rem", color: "var(--text)", marginBottom: "16px" }}>Каталог Ікри</h1>
        <p style={{ fontSize: "1.2rem", color: "var(--text-secondary)", maxWidth: "600px", margin: "0 auto" }}>
          Оберіть свою улюблену ікру з нашого преміального асортименту. 
          Найвища якість та свіжість гарантовані.
        </p>
      </header>

      <ul className="products">
        {catalogProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </ul>
    </div>
  );
}
