"use client";

import { useState } from "react";

export default function ContactWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [formData, setFormData] = useState({ name: "", phone: "", question: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("idle");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", phone: "", question: "" });
        setTimeout(() => {
          setIsOpen(false);
          setStatus("idle");
        }, 3000);
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        style={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: "var(--green)",
          color: "#fff",
          border: "none",
          boxShadow: "0 10px 25px rgba(34, 197, 94, 0.4)",
          cursor: "pointer",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "transform 0.3s ease"
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
        onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </button>

      {isOpen && (
        <div style={{
          position: "fixed",
          bottom: "100px",
          right: "30px",
          width: "350px",
          background: "#fff",
          borderRadius: "16px",
          boxShadow: "0 15px 40px rgba(0,0,0,0.15)",
          zIndex: 9999,
          overflow: "hidden",
          animation: "slideUp 0.3s forwards"
        }}>
          <div style={{ background: "var(--primary)", color: "#fff", padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ margin: 0, fontSize: "1.1rem" }}>Маєте питання?</h3>
            <button onClick={() => setIsOpen(false)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", padding: 0 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>

          <div style={{ padding: "20px" }}>
            {status === "success" ? (
              <div style={{ textAlign: "center", color: "var(--primary)", fontWeight: "bold", padding: "20px 0" }}>
                Дякуємо! Ми зв'яжемося з вами найближчим часом.
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                <input 
                  type="text" 
                  placeholder="Ваше ім'я" 
                  required 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  style={{ padding: "12px", borderRadius: "8px", border: "1px solid #ddd", width: "100%", boxSizing: "border-box" }}
                />
                <input 
                  type="tel" 
                  placeholder="Ваш телефон" 
                  required 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  style={{ padding: "12px", borderRadius: "8px", border: "1px solid #ddd", width: "100%", boxSizing: "border-box" }}
                />
                <textarea 
                  placeholder="Ваше питання..." 
                  required 
                  value={formData.question}
                  onChange={(e) => setFormData({...formData, question: e.target.value})}
                  style={{ padding: "12px", borderRadius: "8px", border: "1px solid #ddd", width: "100%", boxSizing: "border-box", minHeight: "80px", resize: "none" }}
                />
                {status === "error" && <div style={{ color: "red", fontSize: "0.85rem" }}>Помилка відправки. Спробуйте ще раз.</div>}
                <button type="submit" disabled={isSubmitting} style={{ 
                  padding: "14px", 
                  background: "var(--primary)", 
                  color: "#fff", 
                  border: "none", 
                  borderRadius: "8px", 
                  fontWeight: "bold", 
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  opacity: isSubmitting ? 0.7 : 1
                }}>
                  {isSubmitting ? "Відправка..." : "Надіслати питання"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 480px) {
          .contact-widget-popup {
            left: 15px !important;
            right: 15px !important;
            width: auto !important;
            bottom: 90px !important;
          }
        }
      `}</style>
    </>
  );
}
