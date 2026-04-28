import Link from 'next/link';

export default function Home() {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section style={{ padding: '6rem 0', textAlign: 'center' }}>
        <div className="container">
          <h1 style={{ fontSize: '4rem', fontWeight: '800', marginBottom: '1.5rem', lineHeight: 1.1 }}>
            Modernize Your <br />
            <span className="text-gradient">Logistics Engine</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
            Zamin Logistics delivers a fully integrated Truck Dispatching Management System for companies, dispatchers, and drivers.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link href="/register" style={{
              background: 'var(--accent-primary)',
              color: '#fff',
              padding: '0.8rem 2rem',
              borderRadius: 'var(--radius-lg)',
              fontWeight: 600,
              boxShadow: 'var(--shadow-neon)'
            }}>
              Get Started
            </Link>
            <Link href="/login" style={{
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              color: '#fff',
              padding: '0.8rem 2rem',
              borderRadius: 'var(--radius-lg)',
              fontWeight: 600
            }}>
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '5rem 0', backgroundColor: 'var(--bg-secondary)' }}>
        <div className="container">
          <h2 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '3rem' }}>Why Choose Zamin?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {/* Feature 1 */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h3 style={{ color: 'var(--accent-neon)', marginBottom: '1rem', fontSize: '1.5rem' }}>Real-time Tracking</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Monitor your loads across the country with precision tracking updates from our driver app.</p>
            </div>
            {/* Feature 2 */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h3 style={{ color: 'var(--accent-neon)', marginBottom: '1rem', fontSize: '1.5rem' }}>Instant Quotes</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Get transparent and competitive quotes instantly from top-tier carriers and our internal dispatchers.</p>
            </div>
            {/* Feature 3 */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h3 style={{ color: 'var(--accent-neon)', marginBottom: '1rem', fontSize: '1.5rem' }}>Role-based Access</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Dedicated dashboards for Admins, Dispatchers, Companies, and Drivers to streamline communication.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
