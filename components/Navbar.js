'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    fetch('/api/auth/me')
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Not logged in');
      })
      .then((data) => setUser(data.user))
      .catch(() => setUser(null));
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/login');
  };

  return (
    <nav className={styles.navbar}>
      <div className={`container ${styles.navContainer}`}>
        <Link href="/" className={styles.logo}>
          <span className="text-gradient">Zamin</span> Logistics
        </Link>
        <ul className={styles.navLinks}>
          <li><Link href="/">Home</Link></li>
          {!user ? (
            <>
              <li><Link href="/login" className={styles.loginBtn}>Login</Link></li>
              <li><Link href="/register" className={styles.registerBtn}>Register</Link></li>
            </>
          ) : (
            <>
              <li><Link href="/dashboard" className={styles.dashBtn}>Dashboard</Link></li>
              <li><button onClick={handleLogout} className={styles.logoutBtn}>Logout</button></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
