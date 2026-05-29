import { NavLink } from 'react-router-dom';
import useAuthStore from '../../../store/auth.store';
import styles from './Sidebar.module.css';

const navItems = [
  { to: '/',              icon: '🏠', label: 'Home'          },
  { to: '/announcements', icon: '📣', label: 'Announcements' },
  { to: '/calendar',      icon: '📅', label: 'Calendar'      },
  { to: '/memory_book',   icon: '📸', label: 'Memory Book'   },
  { to: '/wall',          icon: '🙏', label: 'Prayer Wall'   },
  { to: '/vault',         icon: '🗄️', label: 'Vault'         },
  { to: '/location',      icon: '🆘', label: 'SOS'           },
  { to: '/watchlist',     icon: '🎬', label: 'Watchlist'     },
  { to: '/admin_panel',         icon: '🧑‍💼', label:  'Admin'  },

];

const adminItems = [
  { to: '/admin', icon: '⚙️', label: 'Admin Panel' },
];

// isOpen / onClose are only relevant on mobile (the drawer behaviour)
export default function Sidebar({ isOpen, onClose }) {
  const user   = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>

      {/* ── Brand ─────────────────────────────────────────────────────── */}
      <div className={styles.brand}>
        <div className={styles.brandMark}>K</div>
        <div className={styles.brandText}>
          <span className={styles.brandName}>KinnectHub</span>
          <span className={styles.brandFamily}>Tayebwa Family</span>
        </div>

        {/* Close button — only visible on mobile */}
        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close menu"
        >
          ✕
        </button>
      </div>

      {/* ── Nav ───────────────────────────────────────────────────────── */}
      <nav className={styles.nav}>
        <span className={styles.navSection}>Main</span>

        {navItems.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.linkActive : ''}`
            }
          >
            <span className={styles.linkIcon}>{icon}</span>
            <span className={styles.linkLabel}>{label}</span>
            {label === 'Announcements' && (
              <span className={styles.badge}>3</span>
            )}
          </NavLink>
        ))}

        {/* Admin-only section */}
        {user?.isAdmin && (
          <>
            <span className={styles.navSection} style={{ marginTop: 16 }}>
              Admin
            </span>
            {adminItems.map(({ to, icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `${styles.link} ${styles.adminLink} ${isActive ? styles.linkActive : ''}`
                }
              >
                <span className={styles.linkIcon}>{icon}</span>
                <span className={styles.linkLabel}>{label}</span>
              </NavLink>
            ))}
          </>
        )}
      </nav>

      {/* ── User card ─────────────────────────────────────────────────── */}
      <div className={styles.userCard}>
        <div
          className={styles.userAvatar}
          style={{ background: 'linear-gradient(135deg, #2D5A3D, #2D5A3Dbb)' }}
        >
          {user?.name
            ? user.name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
            : 'FA'}
        </div>
        <div className={styles.userInfo}>
          <div className={styles.userName}>{user?.name ?? 'Family Member'}</div>
          <div className={styles.userRole}>
            {user?.isAdmin ? '👑 Admin' : 'Member'}
          </div>
        </div>
        <button className={styles.logoutBtn} onClick={logout} title="Sign out">
          🚪
        </button>
      </div>

    </aside>
  );
}