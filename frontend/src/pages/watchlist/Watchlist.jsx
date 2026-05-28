import { useState } from 'react';
import AppShell from '../../components/layout/AppShell/AppShell';
import useAuthStore from '../../store/auth.store';
import styles from './Watchlist.module.css';
import {
  mockWatchlistItems,
  mockGenreSummary,
  mockMemberContributions,
} from './mockData';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function StarRating({ rating, max = 5 }) {
  return (
    <span className={styles.stars}>
      {'★'.repeat(rating)}{'☆'.repeat(max - rating)}
    </span>
  );
}

function AvatarStack({ members, max = 4 }) {
  const visible = members.slice(0, max);
  const overflow = members.length - max;
  return (
    <div className={styles.avatarStack}>
      {visible.map((m, i) => (
        <div
          key={i}
          className={styles.miniAvatar}
          style={{ background: `linear-gradient(135deg, ${m.color}, ${m.color}bb)` }}
        >
          {m.initials[0]}
        </div>
      ))}
      {overflow > 0 && (
        <div className={styles.miniAvatarOverflow}>+{overflow}</div>
      )}
    </div>
  );
}

// ─── Watchlist Item ───────────────────────────────────────────────────────────
function WatchlistItem({ item }) {
  const isWatched = item.status === 'watched';
  return (
    <div className={`${styles.item} ${isWatched ? styles.itemWatched : ''}`}>
      <div
        className={styles.poster}
        style={{ background: `${item.color}18` }}
      >
        {item.emoji}
        {isWatched && <div className={styles.watchedOverlay}>✓</div>}
      </div>

      <div className={styles.itemBody}>
        <div className={styles.itemRow1}>
          <span className={styles.itemTitle}>{item.title}</span>
          <span className={`${styles.badge} ${styles[`badge_${item.type}`]}`}>
            {item.type === 'movie' ? 'Movie' : 'Series'}
          </span>
          <span className={`${styles.badge} ${isWatched ? styles.badge_watched : styles.badge_pending}`}>
            {isWatched ? 'Watched' : 'Pending'}
          </span>
        </div>

        <div className={styles.itemMeta}>
          {item.genre} · {item.year} · {item.duration}
        </div>

        <div className={styles.itemFooter}>
          <StarRating rating={item.rating} />
          <div className={styles.itemWho}>
            <AvatarStack members={item.sharedWith} />
            <span className={styles.itemAddedBy}>
              {item.sharedWith.length === 1
                ? `Added by ${item.addedBy.split(' ')[0]}`
                : `${item.sharedWith.length} members`}
            </span>
          </div>
        </div>

        {item.note ? (
          <div className={styles.itemNote}>"{item.note}"</div>
        ) : null}
      </div>
    </div>
  );
}

// ─── Watchlist Page ───────────────────────────────────────────────────────────
const FILTERS = ['All', 'Movies', 'Series', 'Pending', 'Watched'];

export default function Watchlist() {
  const user = useAuthStore(s => s.user);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // ── derived lists ──────────────────────────────────────────────────────────
  const filtered = mockWatchlistItems.filter(item => {
    const matchesFilter =
      activeFilter === 'All'     ? true :
      activeFilter === 'Movies'  ? item.type === 'movie'    :
      activeFilter === 'Series'  ? item.type === 'series'   :
      activeFilter === 'Pending' ? item.status === 'pending' :
      activeFilter === 'Watched' ? item.status === 'watched' : true;

    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const pendingItems  = filtered.filter(i => i.status === 'pending');
  const watchedItems  = filtered.filter(i => i.status === 'watched');

  const totalTitles   = mockWatchlistItems.length;
  const totalWatched  = mockWatchlistItems.filter(i => i.status === 'watched').length;
  const totalPending  = mockWatchlistItems.filter(i => i.status === 'pending').length;

  const watchNextItems = mockWatchlistItems
    .filter(i => i.status === 'pending')
    .slice(0, 3);

  return (
    <AppShell>
      <div className={styles.page}>

        {/* ── Header ───────────────────────────────────────────────────────── */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h1>🎬 Shared Watchlist</h1>
            <p>Movies and shows the Tayebwa family wants to watch</p>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.addBtn}>+ Add Title</button>
          </div>
        </div>

        {/* ── Stats Strip ──────────────────────────────────────────────────── */}
        <div className={styles.statsStrip}>
          {[
            { icon: '🎬', value: totalTitles,              label: 'Total Titles',  bg: 'rgba(61,90,138,0.08)'  },
            { icon: '✅', value: totalWatched,             label: 'Watched',       bg: 'rgba(45,90,61,0.08)'   },
            { icon: '⏳', value: totalPending,             label: 'Pending',       bg: 'rgba(201,168,76,0.10)' },
            { icon: '👥', value: mockMemberContributions.length, label: 'Contributors', bg: 'rgba(138,90,61,0.08)'  },
          ].map(s => (
            <div key={s.label} className={styles.statCard}>
              <div className={styles.statIcon} style={{ background: s.bg }}>{s.icon}</div>
              <div>
                <div className={styles.statValue}>{s.value}</div>
                <div className={styles.statLabel}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Filter Bar ───────────────────────────────────────────────────── */}
        <div className={styles.filterBar}>
          {FILTERS.map(f => (
            <button
              key={f}
              className={`${styles.filterChip} ${activeFilter === f ? styles.filterActive : ''}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
          <div className={styles.searchBox}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search titles…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            {searchQuery && (
              <button className={styles.searchClear} onClick={() => setSearchQuery('')}>✕</button>
            )}
          </div>
        </div>

        {/* ── Left Column ──────────────────────────────────────────────────── */}
        <div className={styles.leftCol}>

          {/* Still to Watch */}
          {(activeFilter === 'All' || activeFilter === 'Pending' || activeFilter === 'Movies' || activeFilter === 'Series') && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.cardTitle}>⏳ Still to Watch</span>
                <button className={styles.cardAction}>Sort ↕</button>
              </div>
              {pendingItems.length > 0 ? (
                <div className={styles.itemList}>
                  {pendingItems.map(item => (
                    <WatchlistItem key={item.id} item={item} />
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <span className={styles.emptyIcon}>🎉</span>
                  <p>All caught up! Add something new.</p>
                </div>
              )}
            </div>
          )}

          {/* Already Watched */}
          {(activeFilter === 'All' || activeFilter === 'Watched' || activeFilter === 'Movies' || activeFilter === 'Series') && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.cardTitle}>✅ Already Watched</span>
                <button className={styles.cardAction}>View All</button>
              </div>
              {watchedItems.length > 0 ? (
                <div className={styles.itemList}>
                  {watchedItems.map(item => (
                    <WatchlistItem key={item.id} item={item} />
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <span className={styles.emptyIcon}>📺</span>
                  <p>Nothing watched yet — time to pick something!</p>
                </div>
              )}
            </div>
          )}

        </div>

        {/* ── Right Column ─────────────────────────────────────────────────── */}
        <div className={styles.rightCol}>

          {/* Watch Next */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>▶ Watch Next</span>
            </div>
            <div className={styles.nextUpList}>
              {watchNextItems.map(item => (
                <div key={item.id} className={styles.nextItem}>
                  <div className={styles.nextPoster} style={{ background: `${item.color}18` }}>
                    {item.emoji}
                  </div>
                  <div className={styles.nextBody}>
                    <div className={styles.nextTitle}>{item.title}</div>
                    <div className={styles.nextSub}>
                      {item.type === 'movie' ? 'Movie' : 'Series'} · {item.duration}
                    </div>
                  </div>
                  <div className={styles.playBtn}>▶</div>
                </div>
              ))}
            </div>
          </div>

          {/* Member Lists */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>👥 Member Lists</span>
              <button className={styles.cardAction}>All</button>
            </div>
            <div className={styles.memberList}>
              {mockMemberContributions.map(m => (
                <div key={m.id} className={styles.memberRow}>
                  <div
                    className={styles.memberAvatar}
                    style={{ background: `linear-gradient(135deg, ${m.color}, ${m.color}bb)` }}
                  >
                    {m.initials}
                  </div>
                  <span className={styles.memberName}>{m.name}</span>
                  <span className={styles.memberCount}>{m.count} titles</span>
                  <div className={styles.memberDot} style={{ background: m.color }} />
                </div>
              ))}
            </div>
          </div>

          {/* By Genre */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>🎭 By Genre</span>
            </div>
            <div className={styles.genreGrid}>
              {mockGenreSummary.map(g => (
                <div
                  key={g.id}
                  className={styles.genreChip}
                  style={{ background: g.bg, borderColor: g.border }}
                >
                  <span className={styles.genreIcon}>{g.emoji}</span>
                  <div>
                    <div className={styles.genreName} style={{ color: g.color }}>{g.genre}</div>
                    <div className={styles.genreCount} style={{ color: g.color, opacity: 0.65 }}>
                      {g.count} {g.count === 1 ? 'title' : 'titles'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </AppShell>
  );
}