import { getDbData } from "@/lib/db";
import ProductCard from "@/components/ProductCard";
import PromoBanner from "@/components/PromoBanner";
import { Product } from "@/data/products";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const products: Product[] = await getDbData('products', 'products.json');
  const caviarProducts = products.filter((p: Product) => p.category !== "promo");

  return (
    <div>
      {/* ========== HERO ========== */}
      <section className="premium-hero">
        <div className="premium-hero-inner">
          <div className="premium-hero-content">
            <h1 className="premium-hero-title">
              <span>Преміальна Ікра· Свіжий Вилов 2026</span>
            </h1>
            <p className="premium-hero-desc">
              6 видів ікри найвищої якості. Доставка Новою Поштою та Укрпоштою 1-2 дні. Оплата при отриманні — жодних передоплат.
            </p>
            <a href="#products" className="button" style={{ display: "inline-block" }}>
              Перейти до каталогу
            </a>
          </div>
          <div className="premium-hero-image">
            <img src="/images/belisi-logo.jpg" alt="Преміальна ікра" style={{ maxWidth: '100%', borderRadius: '50%', boxShadow: '0 10px 40px rgba(0,0,0,0.15)' }} />
          </div>
        </div>
      </section>

      {/* ========== TRUST BAR ========== */}
      <section className="trust-bar">
        <div className="trust-bar-inner">
          <div className="trust-bar-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <polyline points="9 12 11 14 15 10" />
            </svg>
            <strong>Оплата при отриманні</strong>
          </div>
          <div className="trust-bar-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <strong>Сертифікована якість</strong>
          </div>
          <div className="trust-bar-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <strong>Підтримка 9:00–20:00</strong>
          </div>
        </div>
      </section>

      {/* ========== PROMO 3+1 ========== */}
      <div className="container">
        <PromoBanner />
      </div>

      {/* ========== PRODUCT GRID ========== */}
      <section id="products" className="storefront-product-section woocommerce">
        <h2 className="section-title">Наш Асортимент</h2>
        <p className="section-subtitle">Оберіть улюблений сорт ікри — ми доставимо її свіжою</p>
        
        <ul className="products">
          {caviarProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </ul>
      </section>

      {/* ========== CERTIFICATE ========== */}
      <section className="certificate-section">
        <h2 className="section-title">Сертифікат Якості</h2>
        <p className="section-subtitle">Наша продукція повністю сертифікована та відповідає найвищим стандартам</p>
        <img src="/images/certificate.jpg" alt="Сертифікат якості Белісі" />
      </section>
    </div>
  );
}
