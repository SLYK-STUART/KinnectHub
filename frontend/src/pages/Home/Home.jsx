import { useState } from 'react';
import AppShell from '../../components/layout/AppShell/AppShell';
import useAuthStore from '../../store/auth.store';
import styles from './Home.module.css';
import {
  mockFamilyMembers,
  mockAnnouncements,
  mockUpcomingEvents,
  mockMemories,
  mockWallPosts,
} from './mockData';

// ─── Theme Toggle ─────────────────────────────────────────────────────────────
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

// ─── Tree Node ────────────────────────────────────────────────────────────────
function TreeNode({ member, onClick }) {
  return (
    <div className={styles.treeNode} onClick={() => onClick(member)}>
      <div
        className={[
          styles.treeNodeAvatar,
          member.isDeceased ? styles.deceased : '',
          member.isAdmin    ? styles.admin    : '',
        ].join(' ')}
        style={{ background: `linear-gradient(135deg, ${member.color}, ${member.color}bb)` }}
      >
        {member.initials}
      </div>
      <span className={styles.treeNodeName}>{member.name.split(' ')[0]}</span>
      <span className={styles.treeNodeRole}>{member.role}</span>
      {member.isDeceased && <span className={styles.deceasedTag}>✝ Deceased</span>}
    </div>
  );
}

// ─── Profile Modal ────────────────────────────────────────────────────────────
function ProfileModal({ member, onClose }) {
  if (!member) return null;
  const mockDetails = {
    phone: '+256 700 123 456',
    nin: 'CM90200012345XXXX',
    bloodType: 'O+',
    dob: 'March 14, 1965',
  };
  return (
    <div className={styles.profileModal} onClick={onClose}>
      <div className={styles.profileModalCard} onClick={e => e.stopPropagation()}>
        <div className={styles.profileModalHeader}>
          <div
            className={styles.profileModalAvatar}
            style={{ background: `linear-gradient(135deg, ${member.color}, ${member.color}bb)` }}
          >
            {member.initials}
          </div>
          <div className={styles.profileModalName}>{member.name}</div>
          <div className={styles.profileModalRole}>{member.role}</div>
        </div>
        {member.isDeceased && (
          <div className={styles.deceasedBanner}>✝ &nbsp;Passed away — Rest in Peace</div>
        )}
        <div className={styles.profileModalBody}>
          {[
            ['Phone',         mockDetails.phone],
            ['NIN',           mockDetails.nin],
            ['Blood Type',    mockDetails.bloodType],
            ['Date of Birth', mockDetails.dob],
            ...(member.isAdmin ? [['System Role', '👑 Family Admin']] : []),
          ].map(([label, value]) => (
            <div key={label} className={styles.profileModalRow}>
              <span className={styles.profileModalRowLabel}>{label}</span>
              <span className={styles.profileModalRowValue}>{value}</span>
            </div>
          ))}
        </div>
        <button className={styles.profileModalClose} onClick={onClose}>Close Profile</button>
      </div>
    </div>
  );
}

// ─── Family Tree ──────────────────────────────────────────────────────────────
function FamilyTree({ onNodeClick }) {
  const grandparents = mockFamilyMembers.filter(m => ['Grandfather','Grandmother'].includes(m.role));
  const parents      = mockFamilyMembers.filter(m => ['Father','Mother'].includes(m.role));
  const children     = mockFamilyMembers.filter(m => ['1st Born','2nd Born','3rd Born'].includes(m.role));
  const extended     = mockFamilyMembers.filter(m => ['Aunt','Uncle'].includes(m.role));

  const childrenBarWidth = Math.max(0, (children.length - 1) * 100);

  return (
    <div className={styles.treeContainer}>
      <div className={styles.treeWrap}>

        {/* Gen 1 — Grandparents + Extended */}
        <div className={styles.treeGeneration} style={{ gap: 56 }}>
          <div className={styles.spousePair}>
            {grandparents.map((m, i) => (
              <div key={m.id} style={{ display:'flex', alignItems:'center' }}>
                <TreeNode member={m} onClick={onNodeClick} />
                {i < grandparents.length - 1 && <div className={styles.spouseConnector} />}
              </div>
            ))}
          </div>
          {extended.map(m => <TreeNode key={m.id} member={m} onClick={onNodeClick} />)}
        </div>

        {/* V connector Gen1 → Gen2 */}
        <div className={styles.vConnector} />

        {/* Gen 2 — Parents */}
        <div className={styles.treeGeneration}>
          <div className={styles.spousePair}>
            {parents.map((m, i) => (
              <div key={m.id} style={{ display:'flex', alignItems:'center' }}>
                <TreeNode member={m} onClick={onNodeClick} />
                {i < parents.length - 1 && <div className={styles.spouseConnector} />}
              </div>
            ))}
          </div>
        </div>

        {/* V connector + H bar → children */}
        <div className={styles.hConnectorWrap}>
          <div className={styles.vConnector} />
          <div className={styles.hConnectorBar} style={{ width: childrenBarWidth }} />
        </div>

        {/* Gen 3 — Children */}
        <div className={styles.treeGeneration} style={{ gap: 16 }}>
          {children.map(m => (
            <div key={m.id} className={styles.treeNodeGroup}>
              <TreeNode member={m} onClick={onNodeClick} />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

// ─── Home Page ────────────────────────────────────────────────────────────────
export default function Home() {
  const user = useAuthStore(s => s.user);
  const { theme, toggle: toggleTheme } = useTheme();
  const [selectedMember, setSelectedMember] = useState(null);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <AppShell>
      <div className={styles.page}>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h1>{greeting()}, {user?.name?.split(' ')[0] ?? 'Family'} 👋</h1>
            <p>Here's what's happening with the Tayebwa family</p>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.themeBtn} onClick={toggleTheme} title="Toggle theme">
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className={styles.statsStrip}>
          {[
            { icon:'👨‍👩‍👧‍👦', value: mockFamilyMembers.length,    label:'Family Members',  bg:'rgba(45,90,61,0.08)' },
            { icon:'📣',        value: mockAnnouncements.length,   label:'Announcements',   bg:'rgba(201,168,76,0.10)' },
            { icon:'📅',        value: mockUpcomingEvents.length,  label:'Upcoming Events', bg:'rgba(61,90,138,0.08)' },
            { icon:'🖼️',        value: 83,                         label:'Memories',        bg:'rgba(138,90,61,0.08)' },
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

        {/* Left column */}
        <div className={styles.leftCol}>

          {/* Family Tree */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>🌳 Family Tree</span>
              <button className={styles.cardAction}>Edit Tree</button>
            </div>
            <FamilyTree onNodeClick={setSelectedMember} />
            <div className={styles.memberBar}>
              <div className={styles.memberAvatarStack}>
                {mockFamilyMembers.slice(0, 5).map(m => (
                  <div key={m.id} className={styles.miniAvatar}
                    style={{ background: `linear-gradient(135deg, ${m.color}, ${m.color}bb)` }}>
                    {m.initials[0]}
                  </div>
                ))}
              </div>
              <span className={styles.memberCount}>{mockFamilyMembers.length} family members</span>
            </div>
          </div>

          {/* Announcements */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>📣 Announcements</span>
              <button className={styles.cardAction}>New +</button>
            </div>
            <div className={styles.announcementList}>
              {mockAnnouncements.map(a => (
                <div key={a.id} className={styles.announcementItem}>
                  <div className={styles.announcementAvatar}
                    style={{ background: `linear-gradient(135deg, ${a.authorColor}, ${a.authorColor}bb)` }}>
                    {a.authorInitials}
                  </div>
                  <div className={styles.announcementBody}>
                    <div className={styles.announcementMeta}>
                      <span className={styles.announcementAuthor}>{a.author}</span>
                      {a.isUrgent && <span className={styles.urgentBadge}>Urgent</span>}
                    </div>
                    <div className={styles.announcementTitle}>{a.title}</div>
                    <div className={styles.announcementPreview}>{a.preview}</div>
                    <div className={styles.announcementFooter}>
                      <span className={styles.announcementTime}>{a.time}</span>
                      <span className={styles.announcementReplies}>💬 {a.replies} replies</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right column */}
        <div className={styles.rightCol}>

          {/* Upcoming Events */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>📅 Upcoming</span>
              <button className={styles.cardAction}>View All</button>
            </div>
            <div className={styles.eventList}>
              {mockUpcomingEvents.map(e => (
                <div key={e.id} className={styles.eventItem}>
                  <div className={styles.eventDateBox}
                    style={{ borderColor:`${e.color}55`, color:e.color, background:`${e.color}0D` }}>
                    <span className={styles.eventDateDay}>{e.date.split(' ')[0]}</span>
                    <span className={styles.eventDateNum}>{e.date.split(' ')[1]}</span>
                  </div>
                  <div className={styles.eventInfo}>
                    <div className={styles.eventTitle}>{e.title}</div>
                    <div className={styles.eventDay}>{e.day}</div>
                  </div>
                  <span className={styles.eventTypeBadge}>{e.type === 'birthday' ? '🎂' : '📌'}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Memory Book */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>📸 Memory Book</span>
              <button className={styles.cardAction}>Browse</button>
            </div>
            <div className={styles.memoryGrid}>
              {mockMemories.map(m => (
                <div key={m.id} className={styles.memoryItem}>
                  <span className={styles.memoryEmoji}>{m.emoji}</span>
                  <span className={styles.memoryLabel}>{m.label}</span>
                  <span className={styles.memoryCount}>{m.count} items</span>
                </div>
              ))}
            </div>
          </div>

          {/* Prayer & Gratitude Wall */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>🙏 Wall</span>
              <button className={styles.cardAction}>Post +</button>
            </div>
            <div className={styles.wallList}>
              {mockWallPosts.map(p => (
                <div key={p.id} className={styles.wallItem}>
                  <div className={styles.wallAvatar}
                    style={{ background:`linear-gradient(135deg, ${p.authorColor}, ${p.authorColor}bb)` }}>
                    {p.authorInitials}
                  </div>
                  <div className={styles.wallBody}>
                    <div className={styles.wallAuthor}>{p.author}</div>
                    <div className={styles.wallText}>{p.body}</div>
                    <div className={styles.wallFooter}>
                      <span className={styles.wallReactions}>🙏 {p.reactions}</span>
                      <span className={styles.wallTime}>{p.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {selectedMember && (
        <ProfileModal member={selectedMember} onClose={() => setSelectedMember(null)} />
      )}
    </AppShell>
  );
}