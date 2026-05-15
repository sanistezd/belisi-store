"use client";

import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    city: "",
    branch: "",
    comment: ""
  });
  
  const [deliveryType, setDeliveryType] = useState<"np_branch" | "np_locker" | "ukrpost">("np_branch");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [cities, setCities] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [citySearch, setCitySearch] = useState("");
  const [branchSearch, setBranchSearch] = useState("");
  const [cityRef, setCityRef] = useState("");
  const NP_KEY = "";

  // Debounced City Search
  useEffect(() => {
    if (citySearch.length < 2 || cityRef) return;
    const timer = setTimeout(async () => {
      try {
        const res = await fetch("https://api.novaposhta.ua/v2.0/json/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            apiKey: NP_KEY,
            modelName: "Address",
            calledMethod: "searchSettlements",
            methodProperties: { CityName: citySearch, Limit: 10 }
          })
        });
        const data = await res.json();
        if (data.data && data.data[0]) {
          setCities(data.data[0].Addresses || []);
        }
      } catch (e) {}
    }, 300);
    return () => clearTimeout(timer);
  }, [citySearch, cityRef]);

  // Debounced Branch Search
  useEffect(() => {
    // Якщо немає ні тексту пошуку, ні обраного міста, то не шукаємо
    if (branchSearch.length < 1 && !cityRef) return;
    
    const timer = setTimeout(async () => {
      if (deliveryType === "ukrpost") {
         // Ukrposhta API
         try {
           const res = await fetch(`https://www.ukrposhta.ua/api/postoffices/v1/postoffices?search=${branchSearch}&size=20${cityRef ? '&city=' + citySearch : ''}`);
           const data = await res.json();
           setBranches(data.data || data || []);
         } catch(e) {}
         return;
      }

      // Nova Poshta API
      try {
        const res = await fetch("https://api.novaposhta.ua/v2.0/json/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            apiKey: NP_KEY,
            modelName: "AddressGeneral",
            calledMethod: "getWarehouses",
            methodProperties: {
              FindByString: branchSearch.trim() || undefined,
              SettlementRef: cityRef || undefined,
              Limit: cityRef ? 200 : 50
            }
          })
        });
        const data = await res.json();
        let filtered = data.data || [];
        if (deliveryType === "np_branch") {
          filtered = filtered.filter((w:any) => w.TypeOfWarehouse !== 'f9316480-5f2d-425d-bc2c-ac7cd29decf0');
        } else {
          filtered = filtered.filter((w:any) => w.TypeOfWarehouse === 'f9316480-5f2d-425d-bc2c-ac7cd29decf0');
        }
        setBranches(filtered);
      } catch (e) {}
    }, 350);
    return () => clearTimeout(timer);
  }, [branchSearch, cityRef, deliveryType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!citySearch || !branchSearch) {
      alert("Будь ласка, оберіть місто та відділення!");
      return;
    }
    
    setIsSubmitting(true);
    const orderData = {
      name: `${formData.firstName} ${formData.lastName}`,
      phone: formData.phone,
      items,
      totalPrice,
      city: citySearch,
      address: branchSearch,
      deliveryMethod: deliveryType,
      comment: formData.comment
    };

    try {
      const res = await fetch("/api/quick-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData)
      });
      if (res.ok) {
        clearCart();
        setIsSuccess(true);
      } else {
        alert("Помилка. Спробуйте пізніше.");
      }
    } catch(e) {
      alert("Помилка з'єднання.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="container" style={{ padding: "100px 20px", textAlign: "center", maxWidth: "600px" }}>
        <div style={{ background: "var(--bg-subtle)", padding: "50px", borderRadius: "16px", border: "1px solid var(--border)" }}>
          <div style={{ background: "var(--green)", color: "white", width: "80px", height: "80px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <h2 style={{ fontSize: "2rem", marginBottom: "15px", color: "var(--text)" }}>Дякуємо за замовлення!</h2>
          <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", marginBottom: "30px" }}>
            Ваше замовлення успішно отримано. Наш менеджер зв&apos;яжеться з вами найближчим часом для підтвердження.
          </p>
          <button className="button" onClick={() => router.push("/")}>На головну</button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: "100px 20px", textAlign: "center" }}>
        <h2>Ваш кошик порожній</h2>
        <button className="button" onClick={() => router.push("/")} style={{ marginTop: "20px" }}>Повернутися до магазину</button>
      </div>
    );
  }

  return (
    <div className="container woocommerce-checkout" style={{ padding: "40px 20px" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "30px" }}>Оформлення замовлення</h1>
      
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between" }}>
        
        {/* FORM */}
        <div id="customer_details" className="col2-set" style={{ background: "var(--bg-subtle)", padding: "30px", borderRadius: "16px", border: "1px solid var(--border)" }}>
          <form onSubmit={handleSubmit}>
            <h3 style={{ marginBottom: "20px", fontSize: "1.3rem" }}>Дані отримувача</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
              <input type="text" placeholder="Ім'я *" required value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="input-text" />
              <input type="text" placeholder="Прізвище" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="input-text" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "20px", marginBottom: "30px" }}>
              <input type="tel" placeholder="Телефон *" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="input-text" />
            </div>

            <h3 style={{ marginBottom: "20px", fontSize: "1.3rem", display: "flex", alignItems: "center", gap: "10px" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13"></rect>
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                <circle cx="18.5" cy="18.5" r="2.5"></circle>
              </svg>
              Доставка
            </h3>
            <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
              <button type="button" onClick={() => {setDeliveryType("np_branch"); setBranches([]);}} className={`dtab ${deliveryType==="np_branch"?"active":""}`}>Нова Пошта</button>
              <button type="button" onClick={() => {setDeliveryType("np_locker"); setBranches([]);}} className={`dtab ${deliveryType==="np_locker"?"active":""}`}>Поштомат НП</button>
              <button type="button" onClick={() => {setDeliveryType("ukrpost"); setBranches([]);}} className={`dtab ${deliveryType==="ukrpost"?"active":""}`}>Укрпошта</button>
            </div>

            <div style={{ marginBottom: "20px", position: "relative" }}>
              <input 
                type="text" 
                placeholder="Місто / Населений пункт *" 
                value={citySearch} 
                onChange={(e) => {setCitySearch(e.target.value); setCityRef(""); setBranches([]); setBranchSearch("");}} 
                className="input-text" 
                required 
              />
              {cities.length > 0 && !cityRef && (
                <div className="autocomplete-dropdown">
                  {cities.map((c:any, i) => (
                    <div key={i} className="autocomplete-item" onClick={() => {
                      setCitySearch(c.Present);
                      setCityRef(c.Ref);
                      setCities([]);
                      setBranchSearch(" "); // Автоматично тригеримо пошук відділень
                    }}>
                      {c.Present}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ marginBottom: "30px", position: "relative" }}>
              <input type="text" placeholder="Відділення *" value={branchSearch} onChange={(e) => setBranchSearch(e.target.value)} onFocus={() => { if(cityRef && branches.length === 0) setBranchSearch(" ") }} className="input-text" required />
              {branches.length > 0 && (
                <div className="autocomplete-dropdown">
                  {branches.map((b:any, i) => {
                    const label = b.Description || b.ShortAddress || b.name || b.address || '';
                    return (
                      <div key={i} className="autocomplete-item" onClick={() => {
                        setBranchSearch(label);
                        setBranches([]);
                      }}>
                        {label}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <h3 style={{ marginBottom: "20px", fontSize: "1.3rem" }}>Додатково</h3>
            <textarea 
              placeholder="Коментар до замовлення..." 
              value={formData.comment} 
              onChange={e => setFormData({...formData, comment: e.target.value})} 
              className="input-text" 
              style={{ minHeight: "100px", marginBottom: "20px" }}
            />

            <button type="submit" className="button" disabled={isSubmitting} style={{ width: "100%", padding: "16px", fontSize: "1.2rem", opacity: isSubmitting ? 0.7 : 1 }}>
              {isSubmitting ? "Обробка..." : "ПІДТВЕРДИТИ ЗАМОВЛЕННЯ"}
            </button>
          </form>
        </div>

        {/* ORDER SUMMARY */}
        <div id="order_review" className="woocommerce-checkout-review-order">
          <h3 style={{ marginBottom: "20px", fontSize: "1.3rem" }}>Ваше замовлення</h3>
          
          <table className="shop_table woocommerce-checkout-review-order-table" style={{ width: "100%" }}>
            <tbody>
              {items.map((item, i) => (
                <tr className="cart_item" key={i}>
                  <td className="product-name">
                    {item.product.name}&nbsp;
                    <strong className="product-quantity">×&nbsp;{item.quantity}</strong>
                  </td>
                  <td className="product-total">
                    <span className="woocommerce-Price-amount amount">
                      <bdi>{item.product.price * item.quantity}&nbsp;<span className="woocommerce-Price-currencySymbol">₴</span></bdi>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="order-total">
                <th>Разом</th>
                <td><strong><span className="woocommerce-Price-amount amount"><bdi>{totalPrice}&nbsp;<span className="woocommerce-Price-currencySymbol">₴</span></bdi></span></strong></td>
              </tr>
            </tfoot>
          </table>
        </div>

      </div>

      <style>{`
        .dtab {
          flex: 1;
          padding: 12px;
          background: #fff;
          border: 1px solid var(--border);
          border-radius: 10px;
          cursor: pointer;
          font-weight: 600;
          transition: 0.2s;
        }
        .dtab.active {
          border-color: var(--primary);
          background: rgba(232,93,4,0.05);
          color: var(--primary);
        }
        .autocomplete-dropdown {
          position: absolute;
          top: 100%; left: 0; right: 0;
          background: #fff;
          border: 1px solid var(--border);
          border-radius: 8px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          max-height: 200px;
          overflow-y: auto;
          z-index: 100;
          margin-top: 5px;
        }
        .autocomplete-item {
          padding: 12px 16px;
          cursor: pointer;
          border-bottom: 1px solid #eee;
          font-size: 0.9rem;
        }
        .autocomplete-item:hover {
          background: #f8fafc;
          color: var(--primary);
        }
      `}</style>
    </div>
  );
}
