export const metadata = {
  title: 'Dashboard | Zamin Logistics',
};

import styles from './dashboard.module.css';

export default function DashboardLayout({ children }) {
  return (
    <div className={styles.dashLayoutInner}>
      {children}
    </div>
  );
}
