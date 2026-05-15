import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--text)',
      color: 'white',
      padding: '60px 20px',
      marginTop: 'auto'
    }}>
      <div className="container" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '40px'
      }}>
        <div>
          <h3 style={{ color: 'white', marginBottom: '20px', fontSize: '1.5rem', letterSpacing: '2px' }}>BELISI</h3>
          <p style={{ color: 'rgba(255,255,255,0.9)', maxWidth: '300px', lineHeight: '1.6' }}>
            Справжня чорна ікра найвищого ґатунку. 
            Швидка доставка по Україні з дотриманням температурного режиму.
          </p>
        </div>

        <div>
          <h4 style={{ color: 'white', marginBottom: '20px' }}>Навігація</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link href="/" style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'none' }}>Головна сторінка</Link>
            <Link href="/about" style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'none' }}>Про компанію</Link>
            <Link href="/delivery" style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'none' }}>Доставка і оплата</Link>
          </div>
        </div>
        
        <div>
          <h4 style={{ color: 'white', marginBottom: '20px' }}>Контакти</h4>
          <p style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '10px' }}>Телефон: <a href="tel:+380974054709" style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'none' }}>+38 (097) 405 47 09</a></p>
          <p style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '10px' }}>Email: <a href="mailto:belisi.ukraine@gmail.com" style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'none' }}>belisi.ukraine@gmail.com</a></p>
          <p style={{ color: 'rgba(255,255,255,0.9)' }}>Графік: Пн-Нд 09:00 - 20:00</p>
        </div>
      </div>
      
      <div className="container" style={{ 
        borderTop: '1px solid rgba(255,255,255,0.2)', 
        marginTop: '60px', 
        paddingTop: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        color: 'rgba(255,255,255,0.8)'
      }}>
        <p>&copy; {new Date().getFullYear()} ПП «БЕЛІСІ». Всі права захищені.</p>
        <div style={{ display: 'flex', gap: '15px' }}>
           <a href="https://www.instagram.com/belisi.shop" target="_blank" rel="noopener noreferrer" style={{ color: 'white' }}>
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
           </a>
           <a href="https://www.facebook.com/belisi.shop" target="_blank" rel="noopener noreferrer" style={{ color: 'white' }}>
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
           </a>
        </div>
      </div>
    </footer>
  );
}
