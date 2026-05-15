"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // If already logged in, redirect to profile or home
  useEffect(() => {
    const user = localStorage.getItem("belisi_user");
    if (user) {
      router.push("/");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: isLogin ? 'login' : 'register',
          email,
          password,
          name: isLogin ? undefined : name
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Сталася помилка');
      }

      // Save user to localStorage
      localStorage.setItem("belisi_user", JSON.stringify(data.user));
      
      // Redirect based on role
      if (data.user.role === 'admin') {
        window.location.href = "/admin";
      } else {
        window.location.href = "/";
      }

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: "80px 20px", display: "flex", justifyContent: "center", minHeight: "60vh", alignItems: "center" }}>
      <div style={{
        background: "#ffffff",
        border: "1px solid rgba(0,0,0,0.05)",
        borderRadius: "24px",
        padding: "40px",
        maxWidth: "480px",
        width: "100%",
        boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Decorative Top Accent */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "6px", background: "var(--primary)" }}></div>

        {/* Tabs */}
        <div style={{ display: "flex", marginBottom: "30px", borderBottom: "1px solid var(--border)" }}>
          <button 
            onClick={() => { setIsLogin(true); setError(null); }}
            style={{ 
              flex: 1, 
              padding: "15px 0", 
              background: "none", 
              border: "none", 
              borderBottom: isLogin ? "3px solid var(--primary)" : "3px solid transparent",
              fontSize: "1.1rem", 
              fontWeight: isLogin ? 800 : 600,
              color: isLogin ? "var(--text)" : "var(--text-secondary)",
              cursor: "pointer",
              transition: "all 0.3s ease"
            }}
          >
            Вхід
          </button>
          <button 
            onClick={() => { setIsLogin(false); setError(null); }}
            style={{ 
              flex: 1, 
              padding: "15px 0", 
              background: "none", 
              border: "none", 
              borderBottom: !isLogin ? "3px solid var(--primary)" : "3px solid transparent",
              fontSize: "1.1rem", 
              fontWeight: !isLogin ? 800 : 600,
              color: !isLogin ? "var(--text)" : "var(--text-secondary)",
              cursor: "pointer",
              transition: "all 0.3s ease"
            }}
          >
            Реєстрація
          </button>
        </div>

        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h1 style={{ fontSize: "1.8rem", marginBottom: "10px", color: "var(--text)" }}>
            {isLogin ? "З поверненням!" : "Створити акаунт"}
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            {isLogin 
              ? "Увійдіть, щоб переглянути історію замовлень та збережені дані." 
              : "Зареєструйтесь, щоб купувати швидше та отримувати бонуси."}
          </p>
        </div>

        {error && (
          <div style={{ background: "#fee2e2", color: "#991b1b", padding: "12px", borderRadius: "8px", marginBottom: "20px", fontSize: "0.9rem", border: "1px solid #fecaca", textAlign: "center", fontWeight: "600" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          
          {!isLogin && (
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, color: "var(--text)" }}>Ім'я</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Введіть ваше ім'я"
                required={!isLogin}
                style={{
                  width: "100%", padding: "15px", borderRadius: "12px",
                  border: "1px solid var(--border)", background: "var(--bg-subtle)",
                  fontSize: "1rem"
                }}
              />
            </div>
          )}

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, color: "var(--text)" }}>Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ваша@пошта.com"
              required
              style={{
                width: "100%", padding: "15px", borderRadius: "12px",
                border: "1px solid var(--border)", background: "var(--bg-subtle)",
                fontSize: "1rem"
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, color: "var(--text)" }}>Пароль</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: "100%", padding: "15px", borderRadius: "12px",
                border: "1px solid var(--border)", background: "var(--bg-subtle)",
                fontSize: "1rem"
              }}
            />
            {isLogin && (
              <div style={{ textAlign: "right", marginTop: "8px" }}>
                <a href="#" style={{ color: "var(--text-secondary)", fontSize: "0.85rem", textDecoration: "none" }}>Забули пароль?</a>
              </div>
            )}
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{
              width: "100%",
              padding: "16px",
              background: "var(--primary)",
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontSize: "1.1rem",
              fontWeight: 800,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              marginTop: "10px",
              boxShadow: "0 8px 20px rgba(232, 93, 4, 0.3)",
              transition: "transform 0.2s"
            }}
          >
            {loading ? "Зачекайте..." : (isLogin ? "Увійти" : "Зареєструватись")}
          </button>
        </form>

        <div style={{ marginTop: "30px", position: "relative", textAlign: "center" }}>
          <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: "1px", background: "var(--border)", zIndex: 1 }}></div>
          <span style={{ position: "relative", zIndex: 2, background: "#ffffff", padding: "0 15px", color: "var(--text-secondary)", fontSize: "0.9rem" }}>Або через</span>
        </div>

        <button 
          style={{
            width: "100%",
            padding: "15px",
            background: "white",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            fontSize: "1rem",
            fontWeight: 600,
            color: "var(--text)",
            cursor: "pointer",
            marginTop: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.02)"
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Google
        </button>

      </div>
    </div>
  );
}
