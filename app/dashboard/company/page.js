'use client';

import { useState, useEffect } from 'react';
import styles from '../dashboard.module.css';

export default function CompanyDashboard() {
  const [loads, setLoads] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // New Load Modal State
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ origin: '', destination: '', weight: '', loadType: '', pickupDate: '' });

  const fetchData = async () => {
    try {
      const loadRes = await fetch('/api/loads');
      const loadData = await loadRes.json();
      if (loadRes.ok) setLoads(loadData.loads);

      const quoteRes = await fetch('/api/quotes');
      const quoteData = await quoteRes.json();
      if (quoteRes.ok) setQuotes(quoteData.quotes);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  const handleCreateLoad = async (e) => {
    e.preventDefault();
    try {
      await fetch('/api/loads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      setShowForm(false);
      setFormData({ origin: '', destination: '', weight: '', loadType: '', pickupDate: '' });
      fetchData();
    } catch (e) { }
  };

  const handleQuoteAction = async (id, status) => {
    await fetch(`/api/quotes/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    fetchData();
  };

  const renderStatusBadge = (status) => {
    if (['delivered'].includes(status)) return <span className={`${styles.badge} ${styles.badgeSuccess}`}>{status}</span>;
    if (['in_transit', 'picked', 'assigned'].includes(status)) return <span className={`${styles.badge} ${styles.badgeActive}`}>{status}</span>;
    return <span className={`${styles.badge} ${styles.badgePending}`}>{status}</span>;
  };

  if (loading) return <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>Loading dashboard...</div>;

  return (
    <div className={`container animate-fade-in ${styles.dashContainer}`}>
      <div className={styles.dashHeader}>
        <h1 className={styles.dashTitle}>Company Portal</h1>
        <button className={styles.btnPrimary} onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Request New Load'}
        </button>
      </div>

      {showForm && (
        <div className={`glass-panel ${styles.section}`} style={{ padding: '1.5rem' }}>
          <h2 className={styles.sectionTitle}>New Load Request</h2>
          <form onSubmit={handleCreateLoad}>
            <div className={styles.formGrid}>
              <div><label>Origin</label><input required className={styles.input} onChange={e => setFormData({...formData, origin: e.target.value})} /></div>
              <div><label>Destination</label><input required className={styles.input} onChange={e => setFormData({...formData, destination: e.target.value})} /></div>
              <div><label>Weight (lbs)</label><input type="number" required className={styles.input} onChange={e => setFormData({...formData, weight: e.target.value})} /></div>
              <div><label>Load Type</label><input placeholder="e.g. Dry Van" required className={styles.input} onChange={e => setFormData({...formData, loadType: e.target.value})} /></div>
              <div><label>Pickup Date</label><input type="date" required className={styles.input} onChange={e => setFormData({...formData, pickupDate: e.target.value})} /></div>
            </div>
            <button type="submit" className={styles.btnPrimary}>Submit Request</button>
          </form>
        </div>
      )}

      <div className={styles.statsGrid}>
        <div className={`glass-panel ${styles.statCard}`}>
          <div className={styles.statLabel}>Active Loads</div>
          <div className={styles.statValue}>{loads.filter(l => ['in_transit', 'picked', 'assigned'].includes(l.status)).length}</div>
        </div>
        <div className={`glass-panel ${styles.statCard}`}>
          <div className={styles.statLabel}>Pending Quotes</div>
          <div className={styles.statValue}>{quotes.filter(q => q.status === 'pending').length}</div>
        </div>
        <div className={`glass-panel ${styles.statCard}`}>
          <div className={styles.statLabel}>Completed Loads</div>
          <div className={styles.statValue}>{loads.filter(l => l.status === 'delivered').length}</div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Your Loads</h2>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead><tr><th>Origen ➔ Destination</th><th>Type & Weight</th><th>Date</th><th>Status</th></tr></thead>
            <tbody>
              {loads.length === 0 ? <tr><td colSpan="4" style={{textAlign: 'center', padding: '2rem'}}>No loads found</td></tr> : null}
              {loads.map(load => (
                <tr key={load._id}>
                  <td><strong>{load.origin}</strong> to <strong>{load.destination}</strong></td>
                  <td>{load.loadType} ({load.weight} lbs)</td>
                  <td>{new Date(load.pickupDate).toLocaleDateString()}</td>
                  <td>{renderStatusBadge(load.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {quotes.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Received Quotes</h2>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead><tr><th>Load ID</th><th>Proposed Price</th><th>Message</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {quotes.map(quote => (
                  <tr key={quote._id}>
                    <td title={quote.loadId?._id}>...{quote.loadId?._id?.toString().slice(-6)}</td>
                    <td style={{ color: 'var(--success)', fontWeight: 'bold' }}>${quote.proposedPrice}</td>
                    <td>{quote.message || '-'}</td>
                    <td>{renderStatusBadge(quote.status)}</td>
                    <td>
                      {quote.status === 'pending' && (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button onClick={() => handleQuoteAction(quote._id, 'accepted')} className={styles.actionBtn}>Accept</button>
                          <button onClick={() => handleQuoteAction(quote._id, 'rejected')} className={styles.actionBtn}>Reject</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
