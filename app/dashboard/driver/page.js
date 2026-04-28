'use client';

import { useState, useEffect } from 'react';
import styles from '../dashboard.module.css';

export default function DriverDashboard() {
  const [loads, setLoads] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLoads = async () => {
    try {
      const res = await fetch('/api/loads?filter=my-loads');
      const data = await res.json();
      if (res.ok) setLoads(data.loads);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoads();
    const interval = setInterval(fetchLoads, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateStatus = async (id, status) => {
    await fetch(`/api/loads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    fetchLoads();
  };

  if (loading) return <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>Loading dashboard...</div>;

  return (
    <div className={`container animate-fade-in ${styles.dashContainer}`}>
      <div className={styles.dashHeader}>
        <h1 className={styles.dashTitle}>Driver Portal</h1>
      </div>

      <div className={styles.statsGrid}>
        <div className={`glass-panel ${styles.statCard}`}>
          <div className={styles.statLabel}>Assigned Loads</div>
          <div className={styles.statValue}>{loads.filter(l => l.status === 'assigned').length}</div>
        </div>
        <div className={`glass-panel ${styles.statCard}`}>
          <div className={styles.statLabel}>In Transit</div>
          <div className={styles.statValue}>{loads.filter(l => l.status === 'picked' || l.status === 'in_transit').length}</div>
        </div>
        <div className={`glass-panel ${styles.statCard}`}>
          <div className={styles.statLabel}>Completed</div>
          <div className={styles.statValue}>{loads.filter(l => l.status === 'delivered').length}</div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>My Dispatches</h2>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead><tr><th>Route</th><th>Details</th><th>Company</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {loads.length === 0 ? <tr><td colSpan="5" style={{textAlign: 'center', padding: '2rem'}}>No assigned loads</td></tr> : null}
              {loads.map(load => (
                <tr key={load._id}>
                  <td>
                    <div style={{ color: 'var(--accent-neon)', fontWeight: 'bold' }}>{load.origin}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>↓ to</div>
                    <div style={{ fontWeight: 'bold' }}>{load.destination}</div>
                  </td>
                  <td>{load.loadType} <br/> <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{load.weight} lbs</span></td>
                  <td>{load.companyId?.companyName || load.companyId?.name}</td>
                  <td>
                     <span className={`${styles.badge} ${load.status === 'delivered' ? styles.badgeSuccess : styles.badgeActive}`}>
                        {load.status.replace('_', ' ')}
                     </span>
                  </td>
                  <td>
                    {load.status === 'assigned' && <button onClick={() => handleUpdateStatus(load._id, 'picked')} className={styles.actionBtn}>Mark Picked Up</button>}
                    {load.status === 'picked' && <button onClick={() => handleUpdateStatus(load._id, 'in_transit')} className={styles.actionBtn}>Mark In Transit</button>}
                    {load.status === 'in_transit' && <button onClick={() => handleUpdateStatus(load._id, 'delivered')} className={styles.actionBtn}>Mark Delivered</button>}
                    {load.status === 'delivered' && <span style={{ color: 'var(--success)' }}>✓ Complete</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
