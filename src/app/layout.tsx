import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";
import SideCart from "@/components/SideCart";
import ContactWidget from "@/components/ContactWidget";

export const metadata: Metadata = {
  title: "Belisi Caviar - Преміальна чорна ікра",
  description: "Купити справжню чорну ікру осетра. Швидка доставка по Україні.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <body className="woocommerce storefront-full-width-content">
        <CartProvider>
          <Header />
          <div id="primary" className="content-area">
            <main id="main" className="site-main" style={{ minHeight: '80vh' }}>
              {children}
            </main>
          </div>
          <Footer />
          <SideCart />
          <ContactWidget />
        </CartProvider>
      </body>
    </html>
  );
}
