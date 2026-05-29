import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../../store/auth.store';
import styles from './TopBar.module.css';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function getInitials(name = '') {
  return name
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase();
}

// onMenuClick — called when the hamburger is pressed (mobile only)
// menuOpen    — whether the sidebar drawer is currently open
export default function TopBar({ onMenuClick, menuOpen }) {
  const navigate  = useNavigate();
  const user      = useAuthStore(state => state.user);
  const logout    = useAuthStore(state => state.logout);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const initials  = getInitials(user?.name);
  const firstName = user?.name?.split(' ')[0] ?? 'Family';

  return (
    <header className={styles.topBar}>

      {/* ── Left: hamburger (mobile) + brand (mobile) ─────────────────── */}
      <div className={styles.left}>
        {/* Hamburger — only visible on mobile */}
        <button
          className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ''}`}
          onClick={onMenuClick}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span className={styles.bar} />
          <span className={styles.bar} />
          <span className={styles.bar} />
        </button>

        {/* Brand — visible on mobile only (desktop has it in the sidebar) */}
        <div className={styles.brand}>
          <div className={styles.brandMark}>K</div>
          <span className={styles.brandName}>KinnectHub</span>
        </div>
      </div>

      {/* ── Right: greeting + avatar dropdown ────────────────────────── */}
      <div className={styles.right}>
        <span className={styles.greeting}>
          {getGreeting()}, <strong>{firstName}</strong>
        </span>

        <div className={styles.avatarWrap} ref={menuRef}>
          <button
            className={styles.avatarBtn}
            onClick={() => setDropdownOpen(v => !v)}
            aria-label="Open profile menu"
            aria-expanded={dropdownOpen}
          >
            <span className={styles.avatar}>{initials}</span>
            <span className={styles.chevron}>{dropdownOpen ? '▲' : '▼'}</span>
          </button>

          {dropdownOpen && (
            <div className={styles.dropdown}>
              <div className={styles.dropdownHeader}>
                <div className={styles.dropdownAvatar}>{initials}</div>
                <div>
                  <div className={styles.dropdownName}>{user?.name}</div>
                  <div className={styles.dropdownRole}>
                    {user?.isAdmin ? '👑 Family Admin' : 'Family Member'}
                  </div>
                </div>
              </div>

              <div className={styles.dropdownDivider} />

              <button
                className={styles.dropdownItem}
                onClick={() => { navigate('/profile'); setDropdownOpen(false); }}
              >
                <span className={styles.dropdownItemIcon}>👤</span> My Profile
              </button>
              <button
                className={styles.dropdownItem}
                onClick={() => { navigate('/settings'); setDropdownOpen(false); }}
              >
                <span className={styles.dropdownItemIcon}>⚙️</span> Settings
              </button>

              <div className={styles.dropdownDivider} />

              <button
                className={`${styles.dropdownItem} ${styles.dropdownItemDanger}`}
                onClick={logout}
              >
                <span className={styles.dropdownItemIcon}>🚪</span> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

    </header>
  );
}