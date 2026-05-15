export default function AboutPage() {
  return (
    <div className="container" style={{ padding: "60px 20px", maxWidth: "800px" }}>
      <h1 style={{ fontSize: "2.5rem", marginBottom: "30px", textAlign: "center" }}>Про компанію BELISI</h1>
      
      <div style={{ background: "var(--bg-subtle)", padding: "40px", borderRadius: "16px", marginBottom: "40px", border: "1px solid var(--border)" }}>
        <p style={{ fontSize: "1.1rem", lineHeight: "1.8", color: "var(--text-secondary)", marginBottom: "20px" }}>
          Компанія <strong>BELISI</strong> — це ваш постачальник преміальної ікри найвищої якості.
          Ми ретельно слідкуємо за стандартами виробництва, щоб ви могли насолоджуватися ідеальним смаком розкішного делікатесу.
        </p>
        <p style={{ fontSize: "1.1rem", lineHeight: "1.8", color: "var(--text-secondary)" }}>
          Наша місія — зробити преміальні продукти доступними для кожного, забезпечуючи відмінний сервіс та надійну доставку просто до вашого столу.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "30px", marginBottom: "40px" }}>
        <div style={{ padding: "30px", background: "#fff", border: "1px solid var(--border)", borderRadius: "16px", textAlign: "center", boxShadow: "var(--shadow-sm)" }}>
          <h3 style={{ fontSize: "1.5rem", marginBottom: "15px", color: "var(--primary)" }}>Преміальна якість</h3>
          <p style={{ color: "var(--text-secondary)" }}>Унікальна рецептура та ідеально збалансований смак. Наша продукція має всі необхідні сертифікати якості.</p>
        </div>
        <div style={{ padding: "30px", background: "#fff", border: "1px solid var(--border)", borderRadius: "16px", textAlign: "center", boxShadow: "var(--shadow-sm)" }}>
          <h3 style={{ fontSize: "1.5rem", marginBottom: "15px", color: "var(--primary)" }}>Надійна доставка</h3>
          <p style={{ color: "var(--text-secondary)" }}>Ми дбайливо пакуємо кожне замовлення, щоб гарантувати ідеальне збереження продукту під час транспортування.</p>
        </div>
      </div>

      <div style={{ textAlign: "center" }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "20px" }}>Зв&apos;яжіться з нами</h2>
        <p style={{ fontSize: "1.2rem", marginBottom: "10px" }}>Телефон: <a href="tel:+380974054709" style={{ color: "var(--primary)", fontWeight: "bold" }}>+38 (097) 405 47 09</a></p>
        <p style={{ fontSize: "1.2rem", marginBottom: "10px" }}>Email: <a href="mailto:belisi.ukraine@gmail.com" style={{ color: "var(--primary)", fontWeight: "bold" }}>belisi.ukraine@gmail.com</a></p>
        <p style={{ color: "var(--text-secondary)" }}>Графік роботи: Пн-Нд 09:00 - 20:00</p>
      </div>
    </div>
  );
}
