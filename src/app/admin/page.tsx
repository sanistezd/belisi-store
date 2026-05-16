"use client";

import { useState, useEffect } from "react";
import { Product } from "@/data/products";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: "success" | "error" } | null>(null);
  const [activeTab, setActiveTab] = useState<"products" | "orders" | "users">("products");
  const router = useRouter();

  // Protect admin route
  useEffect(() => {
    const user = localStorage.getItem("belisi_user");
    if (!user) {
      router.push("/login");
      return;
    }
    const parsedUser = JSON.parse(user);
    if (parsedUser.role !== "admin") {
      router.push("/");
    }
  }, [router]);

  // Load data
  useEffect(() => {
    Promise.all([
      fetch("/api/admin/products").then(res => res.json()),
      fetch("/api/admin/orders").then(res => res.json()),
      fetch("/api/users").then(res => res.json())
    ]).then(([productsData, ordersData, usersData]) => {
      setProducts(productsData);
      setOrders(Array.isArray(ordersData) ? ordersData : []);
      setUsers(Array.isArray(usersData) ? usersData : []);
      setLoading(false);
    }).catch(() => {
      setMessage({ text: "Не вдалося завантажити дані.", type: "error" });
      setLoading(false);
    });
  }, []);

  const handleChange = (index: number, field: keyof Product, value: any) => {
    const newProducts = [...products];
    newProducts[index] = { ...newProducts[index], [field]: value };
    setProducts(newProducts);
  };

  const saveProducts = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(products),
      });

      if (res.ok) {
        setMessage({ text: "Зміни успішно збережено!", type: "success" });
        setTimeout(() => setMessage(null), 3000);
      } else {
        throw new Error();
      }
    } catch {
      setMessage({ text: "Помилка при збереженні.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const updateOrderStatus = async (id: string, newStatus: string) => {
    const updatedOrders = orders.map(o => o.id === id ? { ...o, status: newStatus } : o);
    setOrders(updatedOrders);
    
    try {
      await fetch("/api/admin/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus })
      });
    } catch (err) {
      console.error("Failed to update order status");
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem("belisi_user");
    await fetch('/api/logout', { method: 'POST' });
    window.location.href = "/";
  };

  if (loading) return <div style={{ padding: "40px", textAlign: "center", fontSize: "1.2rem", color: "var(--text)" }}>Завантаження системи керування...</div>;

  const newOrdersCount = orders.filter(o => o.status === 'new').length;

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <h2 style={{ fontSize: "1.5rem", marginBottom: "40px", color: "white", display: "flex", alignItems: "center", gap: "10px" }} className="admin-title">
          <div style={{ width: "30px", height: "30px", background: "var(--primary)", borderRadius: "6px", display: "flex", alignItems: "center", justifyItems: "center", paddingLeft: "8px" }}>
            <span style={{ fontSize: "1rem", fontWeight: "bold" }}>B</span>
          </div>
          Belisi Admin
        </h2>
        
        <nav className="admin-nav">
          <button 
            onClick={() => setActiveTab("products")}
            className={`admin-nav-btn ${activeTab === "products" ? "active" : ""}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
            <span className="nav-text">Каталог Товарів</span>
          </button>
          <button 
            onClick={() => setActiveTab("orders")}
            className={`admin-nav-btn ${activeTab === "orders" ? "active" : ""}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            <span className="nav-text">Замовлення</span> 
            {newOrdersCount > 0 && (
              <span className="nav-badge">{newOrdersCount} нових</span>
            )}
          </button>
          <button 
            onClick={() => setActiveTab("users")}
            className={`admin-nav-btn ${activeTab === "users" ? "active" : ""}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            <span className="nav-text">Користувачі</span>
          </button>
        </nav>

        <button 
          onClick={handleLogout}
          className="admin-logout-btn"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          <span className="nav-text">Вийти з адмінки</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="admin-content">
        
        {activeTab === "products" && (
          <div className="fade-in">
            <div className="admin-header">
              <div>
                <h1 style={{ fontSize: "2.2rem", margin: "0 0 8px 0", color: "var(--text)" }}>Управління товарами</h1>
                <p style={{ color: "var(--text-secondary)", margin: 0, fontSize: "1.1rem" }}>Редагуйте ціни, артикули та наявність товарів на сайті.</p>
              </div>
              <button 
                onClick={saveProducts} 
                disabled={saving}
                style={{
                  background: "var(--primary)",
                  color: "white",
                  padding: "14px 28px",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "1.05rem",
                  fontWeight: "bold",
                  cursor: saving ? "not-allowed" : "pointer",
                  opacity: saving ? 0.7 : 1,
                  boxShadow: "0 8px 20px rgba(232, 93, 4, 0.25)",
                  display: "flex",
                  alignItems: "center",
                  transition: "all 0.2s",
                  whiteSpace: "nowrap"
                }}
              >
                {saving ? "Збереження..." : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:"10px"}}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                    Зберегти зміни
                  </>
                )}
              </button>
            </div>

            {message && (
              <div style={{ 
                padding: "16px 20px", 
                marginBottom: "30px", 
                borderRadius: "10px", 
                background: message.type === "success" ? "#dcfce7" : "#fee2e2",
                color: message.type === "success" ? "#166534" : "#991b1b",
                border: `1px solid ${message.type === "success" ? "#bbf7d0" : "#fecaca"}`,
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                gap: "10px"
              }}>
                {message.type === "success" ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                )}
                {message.text}
              </div>
            )}

            <div className="table-wrapper">
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "900px" }}>
                <thead>
                  <tr style={{ background: "var(--bg-subtle)", borderBottom: "1px solid var(--border)", color: "var(--text-secondary)" }}>
                    <th style={{ padding: "20px", textAlign: "left", fontWeight: 600, fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>ID / Артикул</th>
                    <th style={{ padding: "20px", textAlign: "left", fontWeight: 600, fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Назва</th>
                    <th style={{ padding: "20px", textAlign: "left", fontWeight: 600, fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Ціна (₴)</th>
                    <th style={{ padding: "20px", textAlign: "left", fontWeight: 600, fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Стара ціна (₴)</th>
                    <th style={{ padding: "20px", textAlign: "center", fontWeight: 600, fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>В наявності</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr key={product.id} style={{ borderBottom: "1px solid var(--border)", transition: "background 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg-subtle)"} onMouseLeave={(e) => e.currentTarget.style.background = "white"}>
                      <td style={{ padding: "20px" }}>
                        <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "6px", fontFamily: "monospace" }}>{product.id}</div>
                        <input 
                          type="text" 
                          placeholder="BL-123"
                          value={product.sku || ''} 
                          onChange={(e) => handleChange(index, 'sku', e.target.value)}
                          style={{ width: "120px", padding: "10px", borderRadius: "8px", border: "1px solid var(--border)", fontSize: "0.95rem", background: "white" }}
                        />
                      </td>
                      <td style={{ padding: "20px" }}>
                        <input 
                          type="text" 
                          value={product.name} 
                          onChange={(e) => handleChange(index, 'name', e.target.value)}
                          style={{ width: "100%", minWidth: "150px", padding: "10px", borderRadius: "8px", border: "1px solid var(--border)", fontWeight: "bold", fontSize: "1rem", color: "var(--text)", background: "white" }}
                        />
                      </td>
                      <td style={{ padding: "20px" }}>
                        <input 
                          type="number" 
                          value={product.price} 
                          onChange={(e) => handleChange(index, 'price', parseInt(e.target.value))}
                          style={{ width: "100px", padding: "10px", borderRadius: "8px", border: "1px solid var(--border)", fontWeight: "bold", color: "var(--primary)", fontSize: "1.05rem", background: "white" }}
                        />
                      </td>
                      <td style={{ padding: "20px" }}>
                        <input 
                          type="number" 
                          placeholder="—"
                          value={product.oldPrice || ''} 
                          onChange={(e) => handleChange(index, 'oldPrice', parseInt(e.target.value) || undefined)}
                          style={{ width: "100px", padding: "10px", borderRadius: "8px", border: "1px solid var(--border)", color: "var(--text-secondary)", textDecoration: "line-through", background: "white" }}
                        />
                      </td>
                      <td style={{ padding: "20px", textAlign: "center" }}>
                        <label style={{ display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                          <input 
                            type="checkbox" 
                            checked={product.inStock} 
                            onChange={(e) => handleChange(index, 'inStock', e.target.checked)}
                            style={{ width: "24px", height: "24px", accentColor: "var(--green)", cursor: "pointer" }}
                          />
                        </label>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="fade-in">
            <div className="admin-header">
              <div>
                <h1 style={{ fontSize: "2.2rem", margin: "0 0 8px 0", color: "var(--text)" }}>Замовлення клієнтів</h1>
                <p style={{ color: "var(--text-secondary)", margin: 0, fontSize: "1.1rem" }}>Перегляд та обробка нових замовлень.</p>
              </div>
            </div>
            
            {orders.length === 0 ? (
              <div style={{ background: "white", padding: "80px 40px", borderRadius: "16px", textAlign: "center", border: "1px dashed var(--border)", boxShadow: "0 10px 30px rgba(0,0,0,0.02)" }}>
                <div style={{ marginBottom: "20px", display: "flex", justifyContent: "center", color: "var(--text-secondary)", opacity: 0.5 }}>
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><polyline points="3 9 12 15 21 9"></polyline></svg>
                </div>
                <h3 style={{ fontSize: "1.4rem", margin: "0 0 10px 0", color: "var(--text)" }}>Поки що немає нових замовлень</h3>
                <p style={{ color: "var(--text-secondary)", maxWidth: "400px", margin: "0 auto" }}>Коли клієнт оформить швидке або повне замовлення на сайті, воно миттєво з'явиться тут.</p>
              </div>
            ) : (
              <div style={{ display: "grid", gap: "20px" }}>
                {orders.map((order, i) => (
                  <div key={order.id} className="order-card">
                    
                    {/* Left Info */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "15px", marginBottom: "15px" }}>
                        <span style={{ fontSize: "1.2rem", fontWeight: "bold", color: "var(--text)" }}>Замовлення #{order.id}</span>
                        <span style={{ 
                          padding: "4px 12px", 
                          borderRadius: "20px", 
                          fontSize: "0.85rem", 
                          fontWeight: "bold",
                          background: order.status === 'new' ? "var(--bg-subtle)" : "#dcfce7",
                          color: order.status === 'new' ? "var(--primary)" : "#166534",
                          border: `1px solid ${order.status === 'new' ? "rgba(232, 93, 4, 0.2)" : "#bbf7d0"}`
                        }}>
                          {order.status === 'new' ? 'Нове' : 'Опрацьовано'}
                        </span>
                        <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginLeft: "auto" }}>
                          {new Date(order.date).toLocaleString('uk-UA')}
                        </span>
                      </div>
                      
                      <div className="order-details-grid">
                        <div>
                          <p style={{ margin: "0 0 5px 0", color: "var(--text-secondary)", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Клієнт</p>
                          <div style={{ fontWeight: "600", color: "var(--text)" }}>{order.customer.name}</div>
                          <a href={`tel:${order.customer.phone}`} style={{ color: "var(--primary)", textDecoration: "none", fontWeight: "bold" }}>{order.customer.phone}</a>
                          {order.customer.email && <div style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>{order.customer.email}</div>}
                        </div>
                        <div>
                          <p style={{ margin: "0 0 5px 0", color: "var(--text-secondary)", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Доставка</p>
                          <div style={{ fontWeight: "600", color: "var(--text)" }}>{order.delivery.method}</div>
                          {order.delivery.city && <div style={{ color: "var(--text)", fontSize: "0.9rem" }}>{order.delivery.city}, {order.delivery.address}</div>}
                        </div>
                      </div>

                      {order.status === 'new' ? (
                         <button 
                           onClick={() => updateOrderStatus(order.id, 'completed')}
                           style={{ padding: "8px 16px", background: "white", border: "1px solid var(--border)", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", color: "var(--text)", display: "inline-flex", alignItems: "center", gap: "8px" }}
                         >
                           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                           Позначити як опрацьоване
                         </button>
                      ) : (
                         <button 
                           onClick={() => updateOrderStatus(order.id, 'new')}
                           style={{ padding: "8px 16px", background: "transparent", border: "none", cursor: "pointer", fontWeight: "500", color: "var(--text-secondary)", textDecoration: "underline" }}
                         >
                           Повернути в "Нові"
                         </button>
                      )}
                    </div>
                    
                    {/* Right Items */}
                    <div style={{ flex: 1, background: "var(--bg-subtle)", padding: "20px", borderRadius: "12px", border: "1px solid var(--border)" }}>
                      <p style={{ margin: "0 0 15px 0", color: "var(--text-secondary)", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: "bold" }}>Товари ({order.items?.length || 0})</p>
                      <ul style={{ margin: "0 0 15px 0", padding: "0", listStyle: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
                        {order.items?.map((item: string, idx: number) => (
                          <li key={idx} style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--primary)", flexShrink: 0 }}></div>
                            <span style={{ fontWeight: "500", color: "var(--text)" }}>{item}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <div style={{ borderTop: "1px solid var(--border)", paddingTop: "15px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontWeight: "bold", color: "var(--text-secondary)" }}>Сума:</span>
                        <span style={{ fontSize: "1.3rem", fontWeight: "800", color: "var(--primary)" }}>{order.total} ₴</span>
                      </div>
                    </div>
                    
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "users" && (
          <div className="fade-in">
            <div className="admin-header">
              <div>
                <h1 style={{ fontSize: "2.2rem", margin: "0 0 8px 0", color: "var(--text)" }}>Клієнтська база</h1>
                <p style={{ color: "var(--text-secondary)", margin: 0, fontSize: "1.1rem" }}>Список усіх зареєстрованих користувачів на сайті.</p>
              </div>
            </div>

            <div className="table-wrapper">
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "800px" }}>
                <thead>
                  <tr style={{ background: "var(--bg-subtle)", borderBottom: "1px solid var(--border)", color: "var(--text-secondary)" }}>
                    <th style={{ padding: "20px", textAlign: "left", fontWeight: 600, fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Клієнт</th>
                    <th style={{ padding: "20px", textAlign: "left", fontWeight: 600, fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Роль</th>
                    <th style={{ padding: "20px", textAlign: "left", fontWeight: 600, fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Дата реєстрації</th>
                    <th style={{ padding: "20px", textAlign: "left", fontWeight: 600, fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>ID</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} style={{ borderBottom: "1px solid var(--border)", transition: "background 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg-subtle)"} onMouseLeave={(e) => e.currentTarget.style.background = "white"}>
                      <td style={{ padding: "20px" }}>
                        <div style={{ fontWeight: "bold", fontSize: "1.05rem", color: "var(--text)" }}>{user.name}</div>
                        <div style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>{user.email}</div>
                      </td>
                      <td style={{ padding: "20px" }}>
                        <span style={{ 
                          padding: "4px 12px", 
                          borderRadius: "20px", 
                          fontSize: "0.85rem", 
                          fontWeight: "bold",
                          background: user.role === 'admin' ? "rgba(232, 93, 4, 0.1)" : "#f1f5f9",
                          color: user.role === 'admin' ? "var(--primary)" : "#64748b",
                          border: `1px solid ${user.role === 'admin' ? "rgba(232, 93, 4, 0.2)" : "#e2e8f0"}`
                        }}>
                          {user.role === 'admin' ? 'Адміністратор' : 'Клієнт'}
                        </span>
                      </td>
                      <td style={{ padding: "20px", color: "var(--text-secondary)", fontSize: "0.95rem" }}>
                        {new Date(user.registeredAt).toLocaleDateString('uk-UA')}
                      </td>
                      <td style={{ padding: "20px", color: "var(--text-secondary)", fontSize: "0.85rem", fontFamily: "monospace" }}>
                        {user.id}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
      
      <style>{`
        .admin-layout {
          display: flex;
          min-height: 100vh;
          background: #f8fafc;
        }

        .admin-sidebar {
          width: 260px;
          background: var(--text);
          color: white;
          padding: 30px 20px;
          display: flex;
          flex-direction: column;
          box-shadow: 4px 0 15px rgba(0,0,0,0.05);
          position: sticky;
          top: 0;
          height: 100vh;
          flex-shrink: 0;
        }

        .admin-nav {
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
        }

        .admin-nav-btn {
          padding: 14px 16px;
          text-align: left;
          background: transparent;
          color: white;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-size: 1.05rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: all 0.2s;
        }

        .admin-nav-btn:hover {
          background: rgba(255,255,255,0.05);
        }

        .admin-nav-btn.active {
          background: rgba(255,255,255,0.1);
          color: var(--primary);
          font-weight: 600;
        }

        .nav-badge {
          background: var(--primary);
          color: white;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 0.8rem;
          margin-left: auto;
          font-weight: bold;
        }

        .admin-logout-btn {
          padding: 14px 16px;
          text-align: left;
          background: rgba(239, 68, 68, 0.15);
          color: #fca5a5;
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 10px;
          cursor: pointer;
          font-size: 1.05rem;
          margin-top: auto;
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 500;
          transition: all 0.2s;
        }

        .admin-logout-btn:hover {
          background: rgba(239, 68, 68, 0.25);
        }

        .admin-content {
          flex: 1;
          padding: 50px;
          overflow-x: hidden;
        }

        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 40px;
        }

        .table-wrapper {
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.03);
          overflow-x: auto;
          border: 1px solid var(--border);
        }

        .order-card {
          background: white;
          border-radius: 16px;
          padding: 24px;
          border: 1px solid var(--border);
          box-shadow: 0 4px 15px rgba(0,0,0,0.03);
          display: flex;
          gap: 30px;
        }

        .order-details-grid {
          display: flex;
          gap: 40px;
          margin-bottom: 20px;
        }

        .fade-in {
          animation: fadeIn 0.4s ease forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* --- MOBILE ADAPTATION --- */
        @media (max-width: 900px) {
          .admin-layout {
            flex-direction: column;
          }
          
          .admin-sidebar {
            width: 100%;
            height: auto;
            position: relative;
            padding: 20px;
          }

          .admin-title {
            margin-bottom: 20px !important;
          }

          .admin-nav {
            flex-direction: row;
            flex-wrap: wrap;
            gap: 10px;
            margin-bottom: 20px;
          }

          .admin-nav-btn, .admin-logout-btn {
            flex: 1;
            min-width: calc(50% - 5px);
            justify-content: center;
            padding: 12px;
            margin: 0;
          }

          .nav-text {
            display: none;
          }

          .admin-nav-btn.active .nav-text {
            display: inline;
          }

          .admin-content {
            padding: 20px;
          }

          .admin-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 20px;
            margin-bottom: 20px;
          }
          
          .admin-header button {
            width: 100%;
            justify-content: center;
          }

          .order-card {
            flex-direction: column;
            gap: 20px;
            padding: 15px;
          }

          .order-details-grid {
            flex-direction: column;
            gap: 15px;
          }
        }
      `}</style>
    </div>
  );
}
