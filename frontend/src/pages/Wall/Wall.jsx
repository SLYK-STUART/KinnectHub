import { useMemo, useState } from 'react';
import AppShell from '../../components/layout/AppShell/AppShell';
import styles from './wall.module.css';

const mockPrayerRequests = [
  {
    id: '1',
    author: 'Kyogabirwe Enid',
    initials: 'KE',
    color: '#5A3D6E',
    category: 'Healing',
    title: 'Prayer for Uncle James',
    message:
      'Please keep Uncle James in prayer as he recovers from surgery this week. We are praying for strength, peace and a quick recovery.',
    hearts: 18,
    praying: 11,
    time: '2 hours ago',
    urgent: true,
  },
  {
    id: '2',
    author: 'Tayebwa Stuart',
    initials: 'TS',
    color: '#3D5A8A',
    category: 'Guidance',
    title: 'Exams & Career Direction',
    message:
      'As I finish my semester and prepare for internships, I would appreciate prayers for wisdom, focus and clarity.',
    hearts: 9,
    praying: 6,
    time: 'Yesterday',
    urgent: false,
  },
  {
    id: '3',
    author: 'Christine Opio',
    initials: 'CO',
    color: '#3D6E5A',
    category: 'Thanksgiving',
    title: 'Safe Delivery',
    message:
      'Thank you all for the prayers. Baby and mother are healthy and doing well. God has truly been faithful to us.',
    hearts: 26,
    praying: 15,
    time: '3 days ago',
    urgent: false,
  },
];

const mockGratitudeNotes = [
  {
    id: 'g1',
    emoji: '🙏',
    title: 'Family Unity',
    text:
      'Grateful that despite distance, the family continues staying connected and supportive.',
    author: 'Tayebwa Osbert',
  },
  {
    id: 'g2',
    emoji: '🌿',
    title: 'Healing',
    text:
      'Thankful for improved health and answered prayers over the past month.',
    author: 'Tumusiime Emmanuel',
  },
  {
    id: 'g3',
    emoji: '🏡',
    title: 'Safe Travels',
    text:
      'Everyone arrived home safely after the family gathering weekend.',
    author: 'Kyogabirwe Enid',
  },
];

export default function Wall() {
  const [theme, setTheme] = useState('light');
  const [activeTab, setActiveTab] = useState('prayers');
  const [selectedPost, setSelectedPost] = useState(null);
  const [search, setSearch] = useState('');

  const filteredPrayers = useMemo(() => {
    return mockPrayerRequests.filter((item) => {
      const value = search.toLowerCase();

      return (
        item.title.toLowerCase().includes(value) ||
        item.message.toLowerCase().includes(value) ||
        item.author.toLowerCase().includes(value)
      );
    });
  }, [search]);

  return (
    <AppShell>
    <div data-theme={theme}>
      <div className={styles.page}>
        {/* ─── Header ───────────────────────────────────── */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <h1>Prayer & Gratitude Wall</h1>

            <p>
              A peaceful family space for prayer requests,
              testimonies and gratitude.
            </p>
          </div>

          <div className={styles.headerActions}>
            <button className={styles.primaryBtn}>
              ✨ New Prayer
            </button>

            <button
              className={styles.themeBtn}
              onClick={() =>
                setTheme((prev) =>
                  prev === 'light' ? 'dark' : 'light'
                )
              }
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>
        </header>

        {/* ─── Hero Strip ─────────────────────────────── */}
        <section className={styles.heroStrip}>
          <div className={styles.heroCard}>
            <div className={styles.heroIcon}>🙏</div>

            <div>
              <div className={styles.heroValue}>18</div>
              <div className={styles.heroLabel}>
                Active Prayer Requests
              </div>
            </div>
          </div>

          <div className={styles.heroCard}>
            <div className={styles.heroIcon}>🤍</div>

            <div>
              <div className={styles.heroValue}>67</div>
              <div className={styles.heroLabel}>
                Family Prayer Reactions
              </div>
            </div>
          </div>

          <div className={styles.heroCard}>
            <div className={styles.heroIcon}>🌿</div>

            <div>
              <div className={styles.heroValue}>12</div>
              <div className={styles.heroLabel}>
                Gratitude Notes
              </div>
            </div>
          </div>
        </section>

        {/* ─── Layout ─────────────────────────────────── */}
        <div className={styles.layout}>
          {/* ─── Left Column ───────────────────────── */}
          <div className={styles.leftCol}>
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardTitle}>
                  Family Prayer Wall
                </div>

                <button className={styles.cardAction}>
                  Filter
                </button>
              </div>

              <div className={styles.tabBar}>
                <button
                  className={
                    activeTab === 'prayers'
                      ? styles.tabActive
                      : styles.tab
                  }
                  onClick={() => setActiveTab('prayers')}
                >
                  Prayer Requests
                </button>

                <button
                  className={
                    activeTab === 'gratitude'
                      ? styles.tabActive
                      : styles.tab
                  }
                  onClick={() => setActiveTab('gratitude')}
                >
                  Gratitude Notes
                </button>
              </div>

              <div className={styles.searchRow}>
                <input
                  className={styles.searchInput}
                  placeholder="Search prayer wall..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {activeTab === 'prayers' ? (
                <div className={styles.prayerList}>
                  {filteredPrayers.map((post) => (
                    <div
                      key={post.id}
                      className={styles.prayerCard}
                    >
                      <div className={styles.prayerTop}>
                        <div className={styles.prayerIdentity}>
                          <div
                            className={styles.avatar}
                            style={{
                              background: post.color,
                            }}
                          >
                            {post.initials}
                          </div>

                          <div>
                            <div className={styles.authorRow}>
                              <span className={styles.author}>
                                {post.author}
                              </span>

                              {post.urgent && (
                                <span
                                  className={styles.urgentBadge}
                                >
                                  Urgent
                                </span>
                              )}
                            </div>

                            <div className={styles.metaRow}>
                              {post.category} • {post.time}
                            </div>
                          </div>
                        </div>

                        <button
                          className={styles.viewBtn}
                          onClick={() =>
                            setSelectedPost(post)
                          }
                        >
                          Open
                        </button>
                      </div>

                      <div className={styles.prayerTitle}>
                        {post.title}
                      </div>

                      <div className={styles.prayerMessage}>
                        {post.message}
                      </div>

                      <div className={styles.prayerFooter}>
                        <div className={styles.reactionRow}>
                          <span>🙏 {post.praying}</span>
                          <span>🤍 {post.hearts}</span>
                        </div>

                        <button
                          className={styles.prayBtn}
                        >
                          I Prayed
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.gratitudeGrid}>
                  {mockGratitudeNotes.map((note) => (
                    <div
                      className={styles.gratitudeCard}
                      key={note.id}
                    >
                      <div className={styles.gratitudeEmoji}>
                        {note.emoji}
                      </div>

                      <div className={styles.gratitudeTitle}>
                        {note.title}
                      </div>

                      <div className={styles.gratitudeText}>
                        {note.text}
                      </div>

                      <div className={styles.gratitudeAuthor}>
                        — {note.author}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* ─── Right Column ──────────────────────── */}
          <aside className={styles.rightCol}>
            {/* Daily Verse */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardTitle}>
                  Daily Encouragement
                </div>
              </div>

              <div className={styles.verseBox}>
                <div className={styles.verseMark}>
                  “
                </div>

                <div className={styles.verseText}>
                  Be joyful in hope, patient in affliction,
                  faithful in prayer.
                </div>

                <div className={styles.verseRef}>
                  Romans 12:12
                </div>
              </div>
            </section>

            {/* Prayer Categories */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardTitle}>
                  Prayer Categories
                </div>
              </div>

              <div className={styles.categoryList}>
                <div className={styles.categoryItem}>
                  <span>🙏 Healing</span>
                  <span>6</span>
                </div>

                <div className={styles.categoryItem}>
                  <span>🕊 Guidance</span>
                  <span>4</span>
                </div>

                <div className={styles.categoryItem}>
                  <span>🏡 Family</span>
                  <span>3</span>
                </div>

                <div className={styles.categoryItem}>
                  <span>🌿 Thanksgiving</span>
                  <span>5</span>
                </div>
              </div>
            </section>

            {/* Prayer Circle */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardTitle}>
                  Active Prayer Circle
                </div>
              </div>

              <div className={styles.circleMembers}>
                {mockPrayerRequests.map((member) => (
                  <div
                    key={member.id}
                    className={styles.circleMember}
                  >
                    <div
                      className={styles.circleAvatar}
                      style={{
                        background: member.color,
                      }}
                    >
                      {member.initials}
                    </div>

                    <div>
                      <div className={styles.circleName}>
                        {member.author}
                      </div>

                      <div className={styles.circleMeta}>
                        Prayed today
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>

        {/* ─── Prayer Modal ───────────────────────── */}
        {selectedPost && (
          <div
            className={styles.overlay}
            onClick={() => setSelectedPost(null)}
          >
            <div
              className={styles.modal}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <button
                  className={styles.closeBtn}
                  onClick={() =>
                    setSelectedPost(null)
                  }
                >
                  ✕
                </button>

                <div
                  className={styles.modalAvatar}
                  style={{
                    background: selectedPost.color,
                  }}
                >
                  {selectedPost.initials}
                </div>

                <div className={styles.modalTitle}>
                  {selectedPost.title}
                </div>

                <div className={styles.modalMeta}>
                  {selectedPost.author} •{' '}
                  {selectedPost.category}
                </div>
              </div>

              <div className={styles.modalBody}>
                {selectedPost.message}
              </div>

              <div className={styles.modalFooter}>
                <button className={styles.secondaryBtn}>
                  🤍 Send Support
                </button>

                <button className={styles.primaryBtnModal}>
                  🙏 I Prayed
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </AppShell>
  );
}