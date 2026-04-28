'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../auth.module.css';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'company', companyName: '', phone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        // Automatically login
        const loginRes = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email, password: formData.password }),
        });
        const loginData = await loginRes.json();
        if (loginRes.ok) {
          window.location.href = `/dashboard/${loginData.user.role}`;
        } else {
          router.push('/login');
        }
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`animate-fade-in ${styles.authContainer}`}>
      <div className={`glass-panel ${styles.authCard}`} style={{ maxWidth: '500px' }}>
        <h1 className={styles.authTitle}>Create Account</h1>
        <p className={styles.authSubtitle}>Join Zamin Logistics today</p>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <form onSubmit={handleRegister}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Account Category</label>
            <select name="role" className={styles.input} onChange={handleChange} value={formData.role}>
              <option value="company">Shipper / Company</option>
              <option value="driver">Carrier / Driver</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Full Name</label>
              <input type="text" name="name" className={styles.input} onChange={handleChange} required />
            </div>
            {formData.role === 'company' && (
              <div className={styles.formGroup}>
                <label className={styles.label}>Company Name</label>
                <input type="text" name="companyName" className={styles.input} onChange={handleChange} />
              </div>
            )}
            {formData.role === 'driver' && (
              <div className={styles.formGroup}>
                <label className={styles.label}>Phone Number</label>
                <input type="tel" name="phone" className={styles.input} onChange={handleChange} />
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Email Address</label>
            <input type="email" name="email" className={styles.input} onChange={handleChange} required />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Password</label>
            <input type="password" name="password" className={styles.input} onChange={handleChange} required minLength={6} />
          </div>

          <button type="submit" className={styles.authBtn} disabled={loading}>
            {loading ? 'Processing...' : 'Register'}
          </button>
        </form>

        <div className={styles.authFooter}>
          Already have an account? <Link href="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
