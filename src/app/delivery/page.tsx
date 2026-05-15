import Link from "next/link";

export default function DeliveryPage() {
  return (
    <div className="container" style={{ padding: "60px 20px", maxWidth: "800px", margin: "0 auto", color: "var(--text)", lineHeight: "1.6" }}>
      
      <div style={{ marginBottom: "50px" }}>
        <h2 style={{ fontSize: "1.8rem", fontWeight: "bold", marginBottom: "20px", color: "var(--text)" }}>
          Доставка по Україні
        </h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: "20px", fontSize: "1.1rem" }}>
          Ми здійснюємо доставку нашої преміальної ікри по всій території України (окрім тимчасово окупованих територій) за допомогою компаній "Нова Пошта" та "Укрпошта".
        </p>
        <ul style={{ paddingLeft: "20px", color: "var(--text-secondary)", fontSize: "1.1rem", listStyleType: "disc" }}>
          <li style={{ marginBottom: "15px" }}>Термін доставки: 1-2 дні з моменту підтвердження замовлення.</li>
          <li style={{ marginBottom: "15px" }}>Всі відправлення надійно упаковуються у спеціальні термобокси з акумуляторами холоду, що гарантує збереження ідеальної температури та свіжості продукту.</li>
        </ul>
      </div>

      <div style={{ marginBottom: "50px" }}>
        <h2 style={{ fontSize: "1.8rem", fontWeight: "bold", marginBottom: "20px", color: "var(--text)" }}>
          Оплата
        </h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: "20px", fontSize: "1.1rem" }}>
          Ми повністю довіряємо нашим клієнтам, тому пропонуємо максимально безпечний спосіб розрахунку:
        </p>
        <ul style={{ paddingLeft: "20px", color: "var(--text-secondary)", fontSize: "1.1rem", listStyleType: "disc" }}>
          <li style={{ marginBottom: "15px" }}>
            <strong style={{ color: "var(--text)" }}>Оплата при отриманні (Накладений платіж)</strong>: Ви оглядаєте товар у відділенні та лише після цього оплачуєте його. Жодних передоплат!
          </li>
        </ul>
      </div>

      <div style={{ marginBottom: "50px" }}>
        <h2 style={{ fontSize: "1.8rem", fontWeight: "bold", marginBottom: "20px", color: "var(--text)" }}>
          Гарантія якості
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>
          Ми гарантуємо 100% свіжість та високу якість кожної баночки. Якщо вас не влаштує зовнішній вигляд упаковки при отриманні, ви можете відмовитись від посилки.
        </p>
      </div>

      <div style={{ marginTop: "60px", textAlign: "left" }}>
        <Link href="/" className="button" style={{ display: "inline-block", padding: "15px 30px", fontSize: "1.1rem", fontWeight: "bold" }}>
          Повернутися до покупок
        </Link>
      </div>

    </div>
  );
}
