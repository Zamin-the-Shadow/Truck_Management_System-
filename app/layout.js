import Navbar from '@/components/Navbar';
import './globals.css';

export const metadata = {
  title: 'Zamin Logistics | Truck Dispatching',
  description: 'Pro production-ready Truck Dispatching Management System',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        
        {/* Simple Footer directly within layout */}
        <footer style={{
          borderTop: '1px solid var(--glass-border)',
          padding: '2rem 0',
          marginTop: '4rem',
          textAlign: 'center',
          color: 'var(--text-muted)'
        }}>
          <p>&copy; {new Date().getFullYear()} Zamin Logistics. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
