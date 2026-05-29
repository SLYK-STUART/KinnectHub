import { NavLink } from 'react-router-dom';
import useAuthStore from '../../../store/auth.store';
import styles from './BottomNav.module.css';

const navItems = [
  { to: '/',              icon: '🏠', label: 'Home',          iconActive: '🏡' },
  { to: '/announcements', icon: '📣', label: 'Posts',         badge: 3          },
  { to: '/location',      icon: '🆘', label: 'SOS'                          },
  { to: '/memory_book',   icon: '📸', label: 'Memories'                          },
  { to: '/wall',          icon: '🙏', label: 'Wall'                               },
];

export default function BottomNav() {
  const user = useAuthStore(s => s.user);

  return (
    <nav className={styles.bottomNav}>
      {navItems.map(({ to, icon, label, badge }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
          }
        >
          {({ isActive }) => (
            <>
              <span className={styles.navIcon}>
                {icon}
                {badge && !isActive && (
                  <span className={styles.badge}>{badge}</span>
                )}
              </span>
              <span className={styles.navLabel}>{label}</span>
              {isActive && <span className={styles.activeDot} />}
            </>
          )}
        </NavLink>
      ))}

      {/* Admin shortcut on mobile */}
      {user?.isAdmin && (
        <NavLink
          to="/admin"
          className={({ isActive }) =>
            `${styles.navItem} ${styles.adminItem} ${isActive ? styles.navItemActive : ''}`
          }
        >
          {() => (
            <>
              <span className={styles.navIcon}>⚙️</span>
              <span className={styles.navLabel}>Admin</span>
            </>
          )}
        </NavLink>
      )}
    </nav>
  );
}