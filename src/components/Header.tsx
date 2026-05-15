"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";

export default function Header() {
  const { totalItems, setIsCartOpen } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{name: string, email: string, role?: string} | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("belisi_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {}
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("belisi_user");
    setUser(null);
  };

  return (
    <header className="site-header" style={{
      background: '#fff',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: 'var(--shadow-xs)'
    }}>
      {/* Top Bar (White) */}
      <div className="header-top-bar" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          padding: '10px 20px',
          justifyContent: 'space-between'
        }}>
          {/* Mobile Menu Toggle */}
          <div style={{ flex: 1, display: 'flex' }} className="mobile-only">
            <button onClick={() => setIsMobileMenuOpen(true)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'none' }} className="mobile-menu-toggle">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
          </div>

          {/* LOGO */}
          <div className="header-logo" style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <Link href="/" style={{ textDecoration: 'none', display: 'inline-block', padding: '0 20px' }}>
                <img 
                  src="/images/logo.png" 
                  alt="Belisi Premium Caviar Logo" 
                  style={{ height: '100px', width: 'auto', objectFit: 'contain' }} 
                />
              </Link>
            </div>
          </div>
          
          {/* ACTIONS (Phone & Cart) */}
          <div className="header-actions" style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '24px' }}>
            <div className="header-contacts desktop-only">
              <div className="contact-phone" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', fontWeight: 600 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <a href="tel:+380974054709" style={{ color: 'var(--text)', textDecoration: 'none' }}>+38 (097) 405 47 09</a>
              </div>
            </div>
            
            <div className="header-cart-wrapper" style={{ borderLeft: '1px solid var(--border)', paddingLeft: '20px', display: 'flex', alignItems: 'center' }}>
              <button 
                onClick={() => setIsCartOpen(true)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: 'var(--text)'
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                <span style={{
                  background: 'var(--primary)',
                  color: 'white',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: 700
                }}>
                  {totalItems}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar (Dark) */}
      <div className="header-bottom-bar desktop-only" style={{ background: '#4a4a4a', color: '#fff' }}>
        <div className="container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '50px',
          padding: '0 20px'
        }}>
          {/* Social Icons */}
          <div className="header-socials" style={{ flex: 1, display: 'flex', gap: '12px' }}>
            <a href="https://instagram.com/belisi.shop" target="_blank" title="Instagram" style={{ color: '#fff', opacity: 0.8 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a href="https://facebook.com/belisi.shop" target="_blank" title="Facebook" style={{ color: '#fff', opacity: 0.8 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
          </div>

          {/* Navigation */}
          <nav className="header-nav" style={{ flex: 2, display: 'flex', justifyContent: 'center', gap: '30px' }}>
            <Link href="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Головна</Link>
            <Link href="/about" style={{ color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Про нас</Link>
            <Link href="/catalog" style={{ color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Каталог</Link>
            <Link href="/delivery" style={{ color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Доставка та оплата</Link>
          </nav>

          {/* Auth */}
          <div className="header-auth" style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '15px' }}>
            {user ? (
              <>
                <span style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 600 }}>{user.name}</span>
                {user.role === 'admin' && (
                  <Link href="/admin" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem' }}>Адмінка</Link>
                )}
                <button 
                  onClick={handleLogout} 
                  style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600, padding: 0 }}
                >
                  Вийти
                </button>
              </>
            ) : (
              <Link href="/login" style={{ color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', opacity: 0.9 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                Вхід / Реєстрація
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      {isMobileMenuOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.5)', zIndex: 10001
        }} onClick={() => setIsMobileMenuOpen(false)}>
          <div style={{
            position: 'absolute', top: 0, left: 0, width: '280px', height: '100%',
            background: 'var(--bg)', padding: '30px 20px', display: 'flex', flexDirection: 'column'
          }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setIsMobileMenuOpen(false)} style={{ alignSelf: 'flex-end', background: 'none', border: 'none', fontSize: '2rem', cursor: 'pointer' }}>&times;</button>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px', fontSize: '1.2rem' }}>
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} style={{ color: 'var(--text)', textDecoration: 'none', fontWeight: 600 }}>Головна</Link>
              <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} style={{ color: 'var(--text)', textDecoration: 'none', fontWeight: 600 }}>Про нас</Link>
              <Link href="/catalog" onClick={() => setIsMobileMenuOpen(false)} style={{ color: 'var(--text)', textDecoration: 'none', fontWeight: 600 }}>Каталог</Link>
              <Link href="/delivery" onClick={() => setIsMobileMenuOpen(false)} style={{ color: 'var(--text)', textDecoration: 'none', fontWeight: 600 }}>Доставка та оплата</Link>
              
              <div style={{ height: '1px', background: 'var(--border)', margin: '10px 0' }}></div>
              
              {user ? (
                <>
                  <div style={{ color: 'var(--text)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    {user.name}
                  </div>
                  {user.role === 'admin' && (
                    <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 800, fontSize: '1.2rem', padding: '5px 0' }}>Адмін-панель</Link>
                  )}
                  <button 
                    onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} 
                    style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 600, padding: 0, textAlign: 'left' }}
                  >
                    Вийти з акаунта
                  </button>
                </>
              ) : (
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 800 }}>Вхід / Реєстрація</Link>
              )}
            </div>
            
            <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, marginBottom: '10px' }}>
                <a href="tel:+380974054709" style={{ color: 'var(--text)', textDecoration: 'none' }}>+38 (097) 405 47 09</a>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Пн-Нд 09:00 - 20:00</p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .header-nav a:hover {
            color: var(--primary) !important;
        }
        .header-socials a:hover {
            opacity: 1 !important;
            color: var(--primary) !important;
        }
        .header-auth a:hover {
            opacity: 1 !important;
            color: var(--primary) !important;
        }
        @media (max-width: 768px) {
          .desktop-only { display: none !important; }
          .header-cart-wrapper { border-left: none !important; padding-left: 0 !important; }
          .mobile-menu-toggle { display: block !important; }
          .header-logo { flex: 2 !important; }
          .header-actions { flex: 1 !important; justify-content: flex-end !important; gap: 10px !important; }
        }
      `}</style>
    </header>
  );
}
