import { useState } from 'react';
import styles from './Announcements.module.css';
import { mockAnnouncements } from './mockData';
import AppShell from '../../components/layout/AppShell/AppShell';

// ─── Theme Hook ───────────────────────────────────────────────────────────────
function useTheme() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('kh-theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
    return saved;
  });
  const toggle = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('kh-theme', next);
  };
  return { theme, toggle };
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
function Avatar({ initials, color, size = 42, fontSize = 13 }) {
  return (
    <div
      className={styles.avatar}
      style={{
        width: size,
        height: size,
        fontSize,
        background: `linear-gradient(135deg, ${color}, ${color}bb)`,
      }}
    >
      {initials}
    </div>
  );
}

// ─── Poll ─────────────────────────────────────────────────────────────────────
function Poll({ poll }) {
  const [voted, setVoted]   = useState(poll.userVoted);
  const [options, setOptions] = useState(poll.options);
  const total = options.reduce((s, o) => s + o.votes, 0);

  const handleVote = (optId) => {
    if (voted) return;
    setVoted(optId);
    setOptions(prev => prev.map(o => o.id === optId ? { ...o, votes: o.votes + 1 } : o));
  };

  return (
    <div className={styles.pollBox}>
      <div className={styles.pollQuestion}>📊 {poll.question}</div>
      {options.map(opt => {
        const pct      = total > 0 ? Math.round((opt.votes / total) * 100) : 0;
        const isVoted  = voted === opt.id;
        return (
          <div
            key={opt.id}
            className={voted ? styles.pollOptionVoted : styles.pollOption}
            onClick={() => handleVote(opt.id)}
          >
            <div className={isVoted ? styles.pollBarVoted : styles.pollBar}>
              <div
                className={isVoted ? styles.pollFillVoted : styles.pollFill}
                style={{ width: `${pct}%` }}
              />
              <span className={styles.pollLabel}>{isVoted ? '✓ ' : ''}{opt.label}</span>
              {voted && <span className={styles.pollPct}>{pct}%</span>}
            </div>
          </div>
        );
      })}
      <div className={styles.pollFooter}>
        <span>{total} votes</span>
        {poll.deadline && <span>Closes {poll.deadline}</span>}
      </div>
    </div>
  );
}

// ─── Announcement Card ────────────────────────────────────────────────────────
function AnnouncementCard({ announcement }) {
  const [expanded,  setExpanded]  = useState(announcement.isUrgent);
  const [replyText, setReplyText] = useState('');
  const [replies,   setReplies]   = useState(announcement.replies);

  const sendReply = () => {
    if (!replyText.trim()) return;
    setReplies(prev => [...prev, {
      id:             Date.now(),
      author:         'Tayebwa Osbert',
      authorInitials: 'TO',
      authorColor:    '#2D5A3D',
      text:           replyText.trim(),
      time:           'Just now',
    }]);
    setReplyText('');
  };

  return (
    <div className={`${styles.card} ${announcement.isUrgent ? styles.cardUrgent : ''}`}>

      {/* ── Header / summary ── */}
      <div className={styles.announcementHeader} onClick={() => setExpanded(e => !e)}>
        <Avatar initials={announcement.authorInitials} color={announcement.authorColor} />

        <div className={styles.announcementMeta}>
          <div className={styles.authorRow}>
            <span className={styles.authorName}>{announcement.author}</span>
            {announcement.isUrgent && <span className={styles.urgentBadge}>Urgent</span>}
            <span className={styles.audienceBadge}>{announcement.audience}</span>
          </div>

          <div className={styles.announcementTitle}>{announcement.title}</div>

          {expanded ? (
            <div className={styles.announcementBody}>{announcement.body}</div>
          ) : (
            <div className={styles.announcementBodyCollapsed}>{announcement.body}</div>
          )}

          {expanded && announcement.hasVoiceNote && (
            <div className={styles.voiceNotePill}>🎤 Voice note &nbsp;·&nbsp; 0:28 ▶</div>
          )}

          <div className={styles.announcementFooterRow}>
            <span className={styles.timeText}>{announcement.time}</span>
            <div className={styles.footerActions}>
              <button className={styles.iconBtn}>
                💬 {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
              </button>
              <button
                className={styles.iconBtn}
                onClick={e => { e.stopPropagation(); setExpanded(v => !v); }}
              >
                {expanded ? '▲ Collapse' : '▼ Expand'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Poll ── */}
      {expanded && announcement.poll && <Poll poll={announcement.poll} />}

      {/* ── Replies ── */}
      {expanded && (
        <>
          {replies.length > 0 && <div className={styles.divider} />}
          <div className={styles.repliesSection}>

            <div className={styles.replyInputRow}>
              <Avatar initials="TO" color="#2D5A3D" size={28} fontSize={9} />
              <input
                className={styles.replyInput}
                placeholder={replies.length === 0 ? 'Be the first to reply...' : 'Write a reply...'}
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendReply()}
              />
              <button className={styles.sendBtn} onClick={sendReply}>➤</button>
            </div>
            
            {replies.length > 0 && (
              <>
                <div className={styles.repliesLabel}>Replies</div>
                {replies.map(r => (
                  <div key={r.id} className={styles.replyItem}>
                    <Avatar
                      initials={r.authorInitials}
                      color={r.authorColor}
                      size={28}
                      fontSize={9}
                    />
                    <div className={styles.replyBubble}>
                      <div className={styles.replyAuthor}>{r.author}</div>
                      <div className={styles.replyText}>{r.text}</div>
                      <div className={styles.replyTime}>{r.time}</div>
                    </div>
                  </div>
                ))}
              </>
            )}
            
          </div>
        </>
      )}
    </div>
  );
}

// ─── New Announcement Modal ───────────────────────────────────────────────────
function NewAnnouncementModal({ onClose }) {
  const [title,    setTitle]    = useState('');
  const [body,     setBody]     = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [audience, setAudience] = useState('all');

  const audienceOptions = [
    { key: 'all',    label: '👨‍👩‍👧‍👦 All Members' },
    { key: 'adults', label: '🧑 Adults Only' },
    { key: 'custom', label: '✏️ Custom' },
  ];

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>

        <div className={styles.modalHeader}>
          <span className={styles.modalTitle}>📣 New Announcement</span>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.modalBody}>
          <input
            className={styles.modalInput}
            placeholder="Announcement title..."
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <textarea
            className={styles.modalTextarea}
            placeholder="What would you like to share with the family?"
            value={body}
            onChange={e => setBody(e.target.value)}
          />
          <div className={styles.visibleToLabel}>Visible to</div>
          <div className={styles.modalOptions}>
            {audienceOptions.map(o => (
              <button
                key={o.key}
                className={audience === o.key ? styles.optionBtnActive : styles.optionBtn}
                onClick={() => setAudience(o.key)}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.urgentToggleRow}>
          <div
            className={isUrgent ? styles.toggleOn : styles.toggle}
            onClick={() => setIsUrgent(u => !u)}
          >
            <div className={isUrgent ? styles.toggleThumbOn : styles.toggleThumb} />
          </div>
          <span className={isUrgent ? styles.urgentLabelOn : styles.urgentLabel}>
            {isUrgent ? '🚨 Mark as Urgent — will override DND' : 'Mark as urgent'}
          </span>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={styles.modalPostBtn} onClick={onClose}>Post Announcement</button>
        </div>
      </div>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ onNewClick }) {
  const stats = [
    { icon: '📣', label: 'Total announcements', value: mockAnnouncements.length },
    { icon: '🚨', label: 'Urgent',              value: mockAnnouncements.filter(a => a.isUrgent).length },
    { icon: '💬', label: 'Total replies',        value: mockAnnouncements.reduce((s, a) => s + a.replies.length, 0) },
    { icon: '📊', label: 'Active polls',         value: mockAnnouncements.filter(a => a.poll).length },
  ];

  const topAuthors = [
    { name: 'Tayebwa Osbert',   initials: 'TO', color: '#2D5A3D', count: 2 },
    { name: 'Tayebwa Stuart',   initials: 'TS', color: '#3D5A8A', count: 1 },
    { name: 'Kyogabirwe Enid',  initials: 'KE', color: '#5A3D6E', count: 1 },
    { name: 'Christine Opio',   initials: 'CO', color: '#3D6E5A', count: 1 },
  ];

  return (
    <div>
      <button className={styles.sideNewBtn} onClick={onNewClick}>
        ✏️ &nbsp;New Announcement
      </button>

      {/* Overview stats */}
      <div className={styles.sideCard}>
        <div className={styles.sideCardHeader}>
          <span className={styles.sideCardTitle}>📊 Overview</span>
        </div>
        {stats.map(s => (
          <div key={s.label} className={styles.statRow}>
            <span className={styles.statLabel}>{s.icon} {s.label}</span>
            <span className={styles.statValue}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* Active members */}
      <div className={styles.sideCard}>
        <div className={styles.sideCardHeader}>
          <span className={styles.sideCardTitle}>👥 Active Members</span>
        </div>
        {topAuthors.map(a => (
          <div key={a.name} className={styles.activeAuthorRow}>
            <Avatar initials={a.initials} color={a.color} size={36} fontSize={11} />
            <div>
              <div className={styles.activeAuthorName}>{a.name}</div>
              <div className={styles.activeAuthorCount}>{a.count} post{a.count > 1 ? 's' : ''}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Announcements() {
  const { theme, toggle: toggleTheme } = useTheme();
  const [filter,    setFilter]    = useState('All');
  const [showModal, setShowModal] = useState(false);

  const filters = ['All', 'Urgent', 'With Polls', 'With Voice'];

  const filterIcons = { Urgent: '🚨 ', 'With Polls': '📊 ', 'With Voice': '🎤 ' };

  const filtered = mockAnnouncements.filter(a => {
    if (filter === 'Urgent')     return a.isUrgent;
    if (filter === 'With Polls') return !!a.poll;
    if (filter === 'With Voice') return a.hasVoiceNote;
    return true;
  });

  return (
    <AppShell>
    <div className={styles.page}>

      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.h1}>📣 Announcements</h1>
          <p className={styles.subtext}>Family updates, discussions &amp; polls</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.themeBtn} onClick={toggleTheme} title="Toggle theme">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <button className={styles.newBtn} onClick={() => setShowModal(true)}>
            ✏️ New Announcement
          </button>
        </div>
      </div>

      {/* Main layout */}
      <div className={styles.layout}>

        {/* Feed */}
        <div>
          <div className={styles.filterBar}>
            {filters.map(f => (
              <button
                key={f}
                className={filter === f ? styles.filterChipActive : styles.filterChip}
                onClick={() => setFilter(f)}
              >
                {filterIcons[f] ?? ''}{f}
              </button>
            ))}
            <span className={styles.filterCount}>
              {filtered.length} announcement{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>

          {filtered.length === 0 ? (
            <div className={styles.emptyState}>No announcements match this filter.</div>
          ) : (
            filtered.map(a => <AnnouncementCard key={a.id} announcement={a} />)
          )}
        </div>

        {/* Sidebar */}
        <Sidebar onNewClick={() => setShowModal(true)} />
      </div>

      {/* Modal */}
      {showModal && <NewAnnouncementModal onClose={() => setShowModal(false)} />}
    </div>
    </AppShell>
  );
}