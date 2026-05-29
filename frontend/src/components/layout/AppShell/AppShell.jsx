import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './AppShell.module.css';
import Sidebar from '../Sidebar/Sidebar';
import TopBar from '../TopBar/TopBar';
import BottomNav from '../BottomNav/BottomNav';

function AppShell({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Close sidebar whenever the route changes (user tapped a nav link)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when sidebar drawer is open on mobile
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  return (
    <div className={styles.shell}>

      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      {/* On desktop: always visible. On mobile: drawer — slides in when open */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* ── Backdrop (mobile only) ───────────────────────────────────────── */}
      {sidebarOpen && (
        <div
          className={styles.backdrop}
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Main area ───────────────────────────────────────────────────── */}
      <div className={styles.main}>
        <TopBar onMenuClick={() => setSidebarOpen(v => !v)} menuOpen={sidebarOpen} />

        <div className={styles.content}>
          {children}
        </div>

        <BottomNav />
      </div>

    </div>
  );
}

export default AppShell;