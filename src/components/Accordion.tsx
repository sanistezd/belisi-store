"use client";

import { useState } from "react";

interface AccordionItem {
  title: string;
  content: string;
}

export default function Accordion({ items }: { items: AccordionItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "30px" }}>
      {items.map((item, index) => (
        <div key={index} style={{ border: "1px solid var(--border)", borderRadius: "12px", background: "#fff", overflow: "hidden" }}>
          <button 
            onClick={() => toggle(index)}
            style={{ 
              width: "100%", 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center", 
              padding: "20px", 
              background: "transparent", 
              border: "none", 
              cursor: "pointer",
              fontSize: "1.1rem",
              fontWeight: "bold",
              textAlign: "left",
              color: "var(--text)"
            }}
          >
            {item.title}
            <svg 
              width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              style={{ transform: openIndex === index ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s" }}
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          
          <div style={{ 
            maxHeight: openIndex === index ? "500px" : "0", 
            transition: "max-height 0.3s ease-in-out",
            overflow: "hidden"
          }}>
            <div style={{ padding: "0 20px 20px", color: "var(--text-secondary)", lineHeight: "1.6" }}>
              {item.content}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
