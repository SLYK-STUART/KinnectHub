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

export default function TopBar() {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const initials = getInitials(user?.name);
  const firstName = user?.name?.split(' ')[0] ?? 'Family';

  return (
    <header className={styles.topBar}>

      {/* Left — brand */}
      <div className={styles.brand}>
        <span className={styles.brandMark}>K</span>
        <span className={styles.brandName}>KinnectHub</span>
      </div>

      {/* Right — greeting + avatar menu */}
      <div className={styles.right}>
        <span className={styles.greeting}>
          {getGreeting()}, <strong>{firstName}</strong>
        </span>

        <div className={styles.avatarWrap} ref={menuRef}>
          <button
            className={styles.avatarBtn}
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Open profile menu"
            aria-expanded={menuOpen}
          >
            <span className={styles.avatar}>{initials}</span>
            <span className={styles.chevron}>{menuOpen ? '▲' : '▼'}</span>
          </button>

          {menuOpen && (
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

              <button className={styles.dropdownItem}>
                <span className={styles.dropdownItemIcon}>👤</span> My Profile
              </button>
              <button className={styles.dropdownItem}>
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