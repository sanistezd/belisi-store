import { getDbData } from "@/lib/db";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/data/products";

export const revalidate = 60;

export default async function CatalogPage() {
  const products: Product[] = await getDbData('products', 'products.json');
  const catalogProducts = products.filter((p: Product) => p.category !== "promo");

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
