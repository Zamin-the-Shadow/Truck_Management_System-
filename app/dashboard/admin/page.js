'use client';

import { useState, useEffect } from 'react';
import styles from '../dashboard.module.css';

export default function AdminDashboard() {
  const [loads, setLoads] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [loadsRes, driversRes] = await Promise.all([
        fetch('/api/loads'),
        fetch('/api/drivers')
      ]);
      if (loadsRes.ok) {
        const data = await loadsRes.json();
        setLoads(data.loads);
      }
      if (driversRes.ok) {
        const data = await driversRes.json();
        setDrivers(data.drivers);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const assignDriver = async (loadId, driverId) => {
    if (!driverId) return;
    await fetch(`/api/loads/${loadId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ driverId, status: 'assigned' })
    });
    fetchData();
  };

  const handleCreateQuote = async (loadId) => {
    const price = prompt("Enter price quote for this load:");
    if (!price || isNaN(price)) return;
    
    await fetch('/api/quotes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ loadId, proposedPrice: Number(price) })
    });
    alert("Quote sent to company!");
  };

  if (loading) return <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>Loading dashboard...</div>;

  return (
    <div className={`container animate-fade-in ${styles.dashContainer}`}>
      <div className={styles.dashHeader}>
        <h1 className={styles.dashTitle}>Admin Console</h1>
      </div>

      <div className={styles.statsGrid}>
        <div className={`glass-panel ${styles.statCard}`}>
          <div className={styles.statLabel}>Total Loads</div>
          <div className={styles.statValue}>{loads.length}</div>
        </div>
        <div className={`glass-panel ${styles.statCard}`}>
          <div className={styles.statLabel}>Pending Assignment</div>
          <div className={styles.statValue}>{loads.filter(l => l.status === 'pending').length}</div>
        </div>
        <div className={`glass-panel ${styles.statCard}`}>
          <div className={styles.statLabel}>Active Drivers</div>
          <div className={styles.statValue}>{drivers.length}</div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Dispatch Management</h2>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead><tr><th>Route & Details</th><th>Company</th><th>Status</th><th>Driver Assignment</th><th>Actions</th></tr></thead>
            <tbody>
              {loads.map(load => (
                <tr key={load._id}>
                  <td>
                    <div style={{ fontWeight: 'bold' }}>{load.origin} ➔ {load.destination}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{load.loadType} - {load.weight} lbs</div>
                  </td>
                  <td>{load.companyId?.companyName || load.companyId?.name}</td>
                  <td>
                    <span className={`${styles.badge} ${['delivered'].includes(load.status) ? styles.badgeSuccess : load.status === 'pending' ? styles.badgePending : styles.badgeActive}`}>
                       {load.status}
                    </span>
                  </td>
                  <td>
                    {load.status === 'pending' ? (
                      <select 
                        className={styles.input} 
                        style={{ padding: '0.4rem', marginTop: 0 }}
                        onChange={(e) => assignDriver(load._id, e.target.value)}
                        defaultValue=""
                      >
                        <option value="" disabled>Assign to...</option>
                        {drivers.map(d => <option key={d._id} value={d._id}>{d.name} ({d.phone || d.email})</option>)}
                      </select>
                    ) : (
                      <span style={{ color: 'var(--accent-neon)' }}>{load.driverId?.name || 'Driver assigned'}</span>
                    )}
                  </td>
                  <td>
                     {load.status === 'pending' && <button onClick={() => handleCreateQuote(load._id)} className={styles.actionBtn}>Send Quote</button>}
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
