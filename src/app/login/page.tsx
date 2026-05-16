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



      </div>
    </div>
  );
}
