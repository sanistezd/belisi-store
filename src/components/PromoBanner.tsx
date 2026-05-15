"use client";

import { useState } from "react";
import { defaultProducts } from "@/data/products";
import { useCart } from "@/context/CartContext";

export default function PromoBanner() {
  const { addToCart } = useCart();
  const [selectedCaviar, setSelectedCaviar] = useState<string[]>(["", "", "", ""]);
  const [packaging, setPackaging] = useState("vacuum");
  const basePrice = 998;
  const extraCost = 200;
  
  const isReady = selectedCaviar.every(item => item !== "");
  const totalPrice = basePrice + (packaging === "glass" ? extraCost : 0);

  const caviarOptions = defaultProducts.filter(p => p.category !== "promo");

  const handleSelect = (index: number, val: string) => {
    const newSelected = [...selectedCaviar];
    newSelected[index] = val;
    setSelectedCaviar(newSelected);
  };

  const handleAddToCart = () => {
    if (!isReady) return;
    
    const promoProduct = defaultProducts.find(p => p.id === "promo-set-3-1");
    if (!promoProduct) return;

    // Підраховуємо скільки якої ікри обрано
    const counts: Record<string, number> = {};
    selectedCaviar.forEach(id => {
      let name = caviarOptions.find(c => c.id === id)?.name || "";
      // Видаляємо все, що в дужках і '500г'
      name = name.replace(/\s*\(.*?\)/g, '').replace('500г', '');
      let shortName = name.toLowerCase().replace('ікра ', '').trim();
      
      const map: Record<string, string> = {
        'веслоноса':'веслоніс', 'горбуші':'горбуша', 'щуки':'щука', 
        'кети':'кета', 'нерки':'нерка', 'осетра':'осетер', 'білуги':'білуга',
        'лосося':'лосось'
      };
      if (map[shortName]) shortName = map[shortName];
      
      if (shortName) {
        counts[shortName] = (counts[shortName] || 0) + 1;
      }
    });

    const parts = [];
    for (const [name, count] of Object.entries(counts)) {
      parts.push(`${name} ${count}х`);
    }
    const packStr = packaging === "glass" ? "скло" : "вакуум";
    const customName = `Сет: ${parts.join(' ')} ${packStr}`;

    const customPromoProduct = {
      ...promoProduct,
      name: customName,
      price: totalPrice,
      description: `Сет акційний 3+1`,
      id: "promo-set-3-1-" + Date.now()
    };

    addToCart(customPromoProduct, 1);
    setSelectedCaviar(["", "", "", ""]);
  };

  return (
    <section className="promo-banner" style={{ margin: "50px auto", gap: "40px" }}>
      <div className="promo-banner-image" style={{ flex: 1 }}>
        <img 
          src="/images/lvTFEdMOSAGVgBpejX6vsLZWarL1cBgygCWjHeu0.png" 
          alt="Акція 3+1" 
          style={{ maxWidth: "100%", borderRadius: "16px", display: "block" }} 
        />
      </div>
      
      <div className="promo-banner-content" style={{ flex: 1, textAlign: "left" }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 12 20 22 4 22 4 12"></polyline>
            <rect x="2" y="7" width="20" height="5"></rect>
            <line x1="12" y1="22" x2="12" y2="7"></line>
            <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
            <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
          </svg>
          Акція 3+1 — Отримай 4-ту банку в подарунок!
        </h3>
        <p>
          Оберіть будь-які 4 баночки ікри по 500г — четверту отримайте безкоштовно! Загальна вага: 2 кг найсвіжішої ікри.
        </p>


        <div className="set-dropdowns">
          {[1, 2, 3, 4].map((num, i) => (
            <div className="set-dropdown-item" key={num}>
              <span className="set-dropdown-number">{num}.</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <select 
                  className="set-item-select"
                  value={selectedCaviar[i]} 
                  onChange={(e) => handleSelect(i, e.target.value)}
                >
                  <option value="">— Оберіть —</option>
                  {caviarOptions.map(opt => (
                    <option key={opt.id} value={opt.id}>{opt.name}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>

        <select 
          className="packaging_type_loop"
          value={packaging} 
          onChange={(e) => setPackaging(e.target.value)}
          style={{ margin: "0 0 16px", padding: "12px 14px", borderRadius: "8px", width: "100%", border: "1px solid #ddd", background: "#fff url('data:image/svg+xml;utf8,<svg xmlns=%27http://www.w3.org/2000/svg%27 width=%2716%27 height=%2716%27 fill=%27%23333%27 viewBox=%270 0 16 16%27><path d=%27M8 11.5l-5-5h10l-5 5z%27/></svg>') no-repeat right 14px center", backgroundSize: "12px", color: "#333", fontSize: "0.95rem", cursor: "pointer", appearance: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
        >
          <option value="vacuum">Вакуумне пакування (стандарт)</option>
          <option value="glass">Скляні баночки (+200 грн)</option>
        </select>

        <div className="promo-price price" style={{ marginBottom: "16px" }}>
          <del aria-hidden="true"><span className="woocommerce-Price-amount amount"><bdi>1996&nbsp;<span className="woocommerce-Price-currencySymbol">₴</span></bdi></span></del>
          <ins><span className="woocommerce-Price-amount amount new"><bdi>{totalPrice}&nbsp;<span className="woocommerce-Price-currencySymbol">₴</span></bdi></span></ins>
        </div>

        <button 
          className="button" 
          disabled={!isReady} 
          onClick={handleAddToCart}
          style={{ width: "100%", opacity: isReady ? 1 : 0.5, cursor: isReady ? "pointer" : "not-allowed" }}
        >
          ДОДАТИ СЕТ В КОШИК
        </button>
        <p id="setHint" style={{ textAlign: "center", marginTop: "8px", fontSize: "0.85rem", color: isReady ? "#27ae60" : "var(--text-secondary)" }}>
          {isReady ? "✓ Натисніть кнопку щоб додати сет" : "Оберіть вид ікри в кожному пункті"}
        </p>
      </div>
    </section>
  );
}
