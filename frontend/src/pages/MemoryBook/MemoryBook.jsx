import { useState, useRef } from 'react';
import AppShell from '../../components/layout/AppShell/AppShell';
import useAuthStore from '../../store/auth.store';
import styles from './MemoryBook.module.css';
import {
  mockAlbums,
  mockMediaItems,
  mockTaggableMembers,
  mockMemoryStats,
  mockYears,
  mockEvents,
} from './mockData';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function Avatar({ initials, color, size = 32 }) {
  return (
    <div
      className={styles.avatar}
      style={{
        background: `linear-gradient(135deg, ${color}, ${color}bb)`,
        width: size,
        height: size,
        fontSize: size * 0.34,
      }}
    >
      {initials}
    </div>
  );
}

function TagPill({ memberId }) {
  const m = mockTaggableMembers.find(x => x.id === memberId);
  if (!m) return null;
  return (
    <div className={styles.tagPill} style={{ borderColor: `${m.color}44` }}>
      <div className={styles.tagPillDot} style={{ background: m.color }} />
      {m.name.split(' ')[0]}
    </div>
  );
}

// ─── Media Tile ───────────────────────────────────────────────────────────────
function MediaTile({ item, onClick }) {
  return (
    <div
      className={`${styles.mediaTile} ${item.deletionRequested ? styles.mediaTileFlagged : ''}`}
      onClick={() => onClick(item)}
    >
      <div className={styles.mediaTileBg} style={{ background: `${item.bg}22` }}>
        <span className={styles.mediaTileEmoji}>{item.emoji}</span>
        {item.type === 'video' && <div className={styles.videoOverlay}>▶</div>}
        {item.deletionRequested && <div className={styles.flaggedOverlay}>🗑 Deletion Requested</div>}
      </div>
      <div className={styles.mediaTileFooter}>
        <span className={styles.mediaTileCaption}>{item.caption}</span>
        <div className={styles.mediaTileTags}>
          {item.tags.slice(0, 3).map(t => {
            const m = mockTaggableMembers.find(x => x.id === t);
            return m ? (
              <div
                key={t}
                className={styles.mediaTileMiniAvatar}
                style={{ background: `linear-gradient(135deg, ${m.color}, ${m.color}bb)` }}
                title={m.name}
              >
                {m.initials[0]}
              </div>
            ) : null;
          })}
          {item.tags.length > 3 && (
            <div className={styles.mediaTileOverflow}>+{item.tags.length - 3}</div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Album Card ───────────────────────────────────────────────────────────────
function AlbumCard({ album, onClick }) {
  const totalMedia = album.photoCount + album.videoCount;
  return (
    <div className={styles.albumCard} onClick={() => onClick(album)}>
      <div className={styles.albumCover} style={{ background: `${album.coverColor}18` }}>
        <span className={styles.albumEmoji}>{album.emoji}</span>
        <div className={styles.albumMediaCount}>{totalMedia} items</div>
      </div>
      <div className={styles.albumInfo}>
        <div className={styles.albumName}>{album.name}</div>
        <div className={styles.albumMeta}>
          <span>{album.year}</span>
          <span>·</span>
          <span>📷 {album.photoCount}</span>
          {album.videoCount > 0 && <><span>·</span><span>🎬 {album.videoCount}</span></>}
        </div>
        <div className={styles.albumUploader}>
          <Avatar initials={album.createdByInitials} color={album.createdByColor} size={20} />
          <span>{album.createdBy.split(' ')[0]}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────
function Lightbox({ item, album, onClose, onRequestDeletion }) {
  const [tagMode, setTagMode]       = useState(false);
  const [tags, setTags]             = useState(item.tags);
  const [delRequested, setDelReq]   = useState(item.deletionRequested);
  const [delReason, setDelReason]   = useState('');
  const [showDelForm, setShowDelForm] = useState(false);

  const toggleTag = id => {
    setTags(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
  };

  const handleRequestDeletion = () => {
    setDelReq(true);
    setShowDelForm(false);
    onRequestDeletion && onRequestDeletion(item.id, delReason);
  };

  return (
    <div className={styles.lightboxOverlay} onClick={onClose}>
      <div className={styles.lightbox} onClick={e => e.stopPropagation()}>

        {/* Media display */}
        <div className={styles.lightboxMedia} style={{ background: `${item.bg}22` }}>
          <span className={styles.lightboxEmoji}>{item.emoji}</span>
          {item.type === 'video' && <div className={styles.lightboxPlayBtn}>▶</div>}
          <button className={styles.lightboxClose} onClick={onClose}>✕</button>
        </div>

        {/* Info panel */}
        <div className={styles.lightboxPanel}>
          <div className={styles.lightboxCaption}>{item.caption}</div>

          {/* Album + uploader */}
          <div className={styles.lightboxMeta}>
            <span className={styles.lightboxAlbum}>{album?.emoji} {album?.name}</span>
            <span className={styles.lightboxDot}>·</span>
            <span className={styles.lightboxDate}>{item.uploadedAt}</span>
          </div>
          <div className={styles.lightboxUploader}>
            <Avatar initials={item.uploadedByInitials} color={item.uploadedByColor} size={24} />
            <span>Uploaded by <strong>{item.uploadedBy.split(' ')[0]}</strong></span>
          </div>

          <div className={styles.lightboxDivider} />

          {/* Tags */}
          <div className={styles.lightboxSection}>
            <div className={styles.lightboxSectionHeader}>
              <span className={styles.lightboxSectionTitle}>👥 People</span>
              <button
                className={`${styles.lightboxTagToggle} ${tagMode ? styles.lightboxTagToggleActive : ''}`}
                onClick={() => setTagMode(v => !v)}
              >
                {tagMode ? 'Done' : 'Tag'}
              </button>
            </div>

            {tagMode ? (
              <div className={styles.tagGrid}>
                {mockTaggableMembers.map(m => (
                  <button
                    key={m.id}
                    className={`${styles.tagGridItem} ${tags.includes(m.id) ? styles.tagGridItemSelected : ''}`}
                    onClick={() => toggleTag(m.id)}
                  >
                    <Avatar initials={m.initials} color={m.color} size={28} />
                    <span className={styles.tagGridName}>{m.name.split(' ')[0]}</span>
                    {tags.includes(m.id) && <span className={styles.tagCheck}>✓</span>}
                  </button>
                ))}
              </div>
            ) : (
              <div className={styles.tagList}>
                {tags.length > 0
                  ? tags.map(t => <TagPill key={t} memberId={t} />)
                  : <span className={styles.lightboxEmptyTags}>No one tagged yet</span>
                }
              </div>
            )}
          </div>

          <div className={styles.lightboxDivider} />

          {/* Deletion request */}
          <div className={styles.lightboxSection}>
            {delRequested ? (
              <div className={styles.lightboxDeletionNote}>
                🗑 Deletion has been requested — pending admin approval.
              </div>
            ) : showDelForm ? (
              <div className={styles.lightboxDelForm}>
                <input
                  className={styles.lightboxDelInput}
                  placeholder="Reason (optional)…"
                  value={delReason}
                  onChange={e => setDelReason(e.target.value)}
                />
                <div className={styles.lightboxDelActions}>
                  <button className={styles.lightboxDelCancel} onClick={() => setShowDelForm(false)}>Cancel</button>
                  <button className={styles.lightboxDelConfirm} onClick={handleRequestDeletion}>Request Deletion</button>
                </div>
              </div>
            ) : (
              <button className={styles.lightboxDelBtn} onClick={() => setShowDelForm(true)}>
                🗑 Request Deletion
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

// ─── Upload Modal ─────────────────────────────────────────────────────────────
function UploadModal({ onClose }) {
  const [selectedAlbum, setSelectedAlbum] = useState('');
  const [caption, setCaption]             = useState('');
  const [tags, setTags]                   = useState([]);
  const [dragging, setDragging]           = useState(false);
  const [files, setFiles]                 = useState([]);
  const fileRef = useRef();

  const toggleTag = id => setTags(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);

  const handleDrop = e => {
    e.preventDefault();
    setDragging(false);
    setFiles(Array.from(e.dataTransfer.files));
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.uploadModal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <span className={styles.modalTitle}>📤 Upload Media</span>
          <button className={styles.modalClose} onClick={onClose}>✕</button>
        </div>

        <div className={styles.modalBody}>

          {/* Drop zone */}
          <div
            className={`${styles.dropZone} ${dragging ? styles.dropZoneActive : ''}`}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
          >
            <input ref={fileRef} type="file" multiple accept="image/*,video/*" style={{ display: 'none' }}
              onChange={e => setFiles(Array.from(e.target.files))} />
            <span className={styles.dropZoneIcon}>📁</span>
            <p className={styles.dropZoneText}>
              {files.length > 0
                ? `${files.length} file${files.length > 1 ? 's' : ''} selected`
                : 'Drag photos/videos here, or click to browse'}
            </p>
            <span className={styles.dropZoneHint}>JPG, PNG, MP4 · Max 50MB each</span>
          </div>

          {/* Album */}
          <div className={styles.modalField}>
            <label className={styles.modalLabel}>Album</label>
            <select className={styles.modalSelect} value={selectedAlbum} onChange={e => setSelectedAlbum(e.target.value)}>
              <option value="">Select an album…</option>
              {mockAlbums.map(a => (
                <option key={a.id} value={a.id}>{a.emoji} {a.name}</option>
              ))}
              <option value="new">+ Create new album</option>
            </select>
          </div>

          {/* Caption */}
          <div className={styles.modalField}>
            <label className={styles.modalLabel}>Caption</label>
            <input
              className={styles.modalInput}
              placeholder="Add a caption…"
              value={caption}
              onChange={e => setCaption(e.target.value)}
            />
          </div>

          {/* Tag people */}
          <div className={styles.modalField}>
            <label className={styles.modalLabel}>Tag People</label>
            <div className={styles.tagGrid}>
              {mockTaggableMembers.map(m => (
                <button
                  key={m.id}
                  className={`${styles.tagGridItem} ${tags.includes(m.id) ? styles.tagGridItemSelected : ''}`}
                  onClick={() => toggleTag(m.id)}
                >
                  <Avatar initials={m.initials} color={m.color} size={28} />
                  <span className={styles.tagGridName}>{m.name.split(' ')[0]}</span>
                  {tags.includes(m.id) && <span className={styles.tagCheck}>✓</span>}
                </button>
              ))}
            </div>
          </div>

        </div>

        <div className={styles.modalFooter}>
          <button className={styles.modalCancel} onClick={onClose}>Cancel</button>
          <button
            className={styles.modalUploadBtn}
            disabled={files.length === 0 || !selectedAlbum}
            onClick={onClose}
          >
            Upload {files.length > 0 ? `(${files.length})` : ''}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Memory Book Page ─────────────────────────────────────────────────────────
const VIEW_TABS = ['Albums', 'Year', 'Event', 'People'];

export default function MemoryBook() {
  const user = useAuthStore(s => s.user);

  const [viewTab, setViewTab]         = useState('Albums');
  const [openAlbum, setOpenAlbum]     = useState(null);   // album object
  const [lightboxItem, setLightboxItem] = useState(null); // media item
  const [showUpload, setShowUpload]   = useState(false);
  const [yearFilter, setYearFilter]   = useState('All');
  const [eventFilter, setEventFilter] = useState('All');
  const [personFilter, setPersonFilter] = useState('All');
  const [search, setSearch]           = useState('');

  // ── Derived ────────────────────────────────────────────────────────────────
  const filteredAlbums = mockAlbums.filter(a => {
    const matchYear   = yearFilter  === 'All' || a.year  === yearFilter;
    const matchEvent  = eventFilter === 'All' || a.event === eventFilter;
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase());
    return matchYear && matchEvent && matchSearch;
  });

  const albumMedia = openAlbum
    ? mockMediaItems.filter(m => m.albumId === openAlbum.id)
    : [];

  const lightboxAlbum = lightboxItem
    ? mockAlbums.find(a => a.id === lightboxItem.albumId)
    : null;

  // ── People view ────────────────────────────────────────────────────────────
  const personAlbums = personFilter === 'All'
    ? mockAlbums
    : mockAlbums.filter(a => a.tags.includes(personFilter));

  // ── Grouped by year ────────────────────────────────────────────────────────
  const albumsByYear = mockYears.reduce((acc, y) => {
    acc[y] = filteredAlbums.filter(a => a.year === y);
    return acc;
  }, {});

  // ── Grouped by event ──────────────────────────────────────────────────────
  const albumsByEvent = mockEvents.reduce((acc, e) => {
    const matches = filteredAlbums.filter(a => a.event === e);
    if (matches.length > 0) acc[e] = matches;
    return acc;
  }, {});

  const totalItems = mockMemoryStats.totalPhotos + mockMemoryStats.totalVideos;

  return (
    <AppShell>
      <div className={styles.page}>

        {/* ── Header ───────────────────────────────────────────────────────── */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            {openAlbum ? (
              <>
                <button className={styles.backBtn} onClick={() => setOpenAlbum(null)}>
                  ← Albums
                </button>
                <h1>{openAlbum.emoji} {openAlbum.name}</h1>
                <p>{openAlbum.description}</p>
              </>
            ) : (
              <>
                <h1>📸 Memory Book</h1>
                <p>Photos and videos from the Tayebwa family</p>
              </>
            )}
          </div>
          <button className={styles.uploadBtn} onClick={() => setShowUpload(true)}>
            📤 Upload
          </button>
        </div>

        {/* ── Stats Strip ──────────────────────────────────────────────────── */}
        <div className={styles.statsStrip}>
          {[
            { icon: '🖼️', value: mockMemoryStats.totalPhotos, label: 'Photos',       bg: 'rgba(61,90,138,0.08)'  },
            { icon: '🎬', value: mockMemoryStats.totalVideos,  label: 'Videos',       bg: 'rgba(45,90,61,0.08)'   },
            { icon: '📁', value: mockMemoryStats.totalAlbums,  label: 'Albums',       bg: 'rgba(201,168,76,0.10)' },
            { icon: '👥', value: mockMemoryStats.contributors, label: 'Contributors', bg: 'rgba(138,90,61,0.08)'  },
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

        {/* ── Left Column ──────────────────────────────────────────────────── */}
        <div className={styles.leftCol}>

          {/* If inside an album */}
          {openAlbum ? (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.cardTitle}>
                  {albumMedia.length} items
                </span>
                <span className={styles.cardMeta}>
                  Added by {openAlbum.createdBy.split(' ')[0]} · {openAlbum.createdAt}
                </span>
              </div>
              {albumMedia.length === 0 ? (
                <div className={styles.emptyState}>
                  <span>📭</span><p>No media in this album yet.</p>
                </div>
              ) : (
                <div className={styles.mediaGrid}>
                  {albumMedia.map(item => (
                    <MediaTile key={item.id} item={item} onClick={setLightboxItem} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <>
              {/* View tabs + search */}
              <div className={styles.tabBar}>
                {VIEW_TABS.map(t => (
                  <button
                    key={t}
                    className={`${styles.tab} ${viewTab === t ? styles.tabActive : ''}`}
                    onClick={() => setViewTab(t)}
                  >
                    {t}
                  </button>
                ))}
                <div className={styles.tabSearch}>
                  <span>🔍</span>
                  <input
                    className={styles.tabSearchInput}
                    placeholder="Search albums…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
              </div>

              {/* ── Albums view ─────────────────────────────────────────── */}
              {viewTab === 'Albums' && (
                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <span className={styles.cardTitle}>All Albums</span>
                    <span className={styles.cardMeta}>{filteredAlbums.length} albums</span>
                  </div>
                  {filteredAlbums.length === 0 ? (
                    <div className={styles.emptyState}><span>📭</span><p>No albums match your search.</p></div>
                  ) : (
                    <div className={styles.albumGrid}>
                      {filteredAlbums.map(album => (
                        <AlbumCard key={album.id} album={album} onClick={setOpenAlbum} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── Year view ───────────────────────────────────────────── */}
              {viewTab === 'Year' && (
                <>
                  <div className={styles.filterStrip}>
                    {['All', ...mockYears].map(y => (
                      <button
                        key={y}
                        className={`${styles.filterChip} ${yearFilter === y ? styles.filterChipActive : ''}`}
                        onClick={() => setYearFilter(y)}
                      >
                        {y}
                      </button>
                    ))}
                  </div>
                  {mockYears.map(year => {
                    const albums = albumsByYear[year];
                    if (!albums || albums.length === 0) return null;
                    if (yearFilter !== 'All' && yearFilter !== year) return null;
                    return (
                      <div key={year} className={styles.card}>
                        <div className={styles.cardHeader}>
                          <span className={styles.cardTitle}>📅 {year}</span>
                          <span className={styles.cardMeta}>{albums.length} albums</span>
                        </div>
                        <div className={styles.albumGrid}>
                          {albums.map(a => <AlbumCard key={a.id} album={a} onClick={setOpenAlbum} />)}
                        </div>
                      </div>
                    );
                  })}
                </>
              )}

              {/* ── Event view ──────────────────────────────────────────── */}
              {viewTab === 'Event' && (
                <>
                  <div className={styles.filterStrip}>
                    {['All', ...mockEvents].map(e => (
                      <button
                        key={e}
                        className={`${styles.filterChip} ${eventFilter === e ? styles.filterChipActive : ''}`}
                        onClick={() => setEventFilter(e)}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                  {Object.entries(albumsByEvent).map(([event, albums]) => {
                    if (eventFilter !== 'All' && eventFilter !== event) return null;
                    return (
                      <div key={event} className={styles.card}>
                        <div className={styles.cardHeader}>
                          <span className={styles.cardTitle}>🏷️ {event}</span>
                          <span className={styles.cardMeta}>{albums.length} album{albums.length !== 1 ? 's' : ''}</span>
                        </div>
                        <div className={styles.albumGrid}>
                          {albums.map(a => <AlbumCard key={a.id} album={a} onClick={setOpenAlbum} />)}
                        </div>
                      </div>
                    );
                  })}
                </>
              )}

              {/* ── People view ─────────────────────────────────────────── */}
              {viewTab === 'People' && (
                <>
                  <div className={styles.filterStrip} style={{ flexWrap: 'wrap' }}>
                    <button
                      className={`${styles.filterChip} ${personFilter === 'All' ? styles.filterChipActive : ''}`}
                      onClick={() => setPersonFilter('All')}
                    >
                      Everyone
                    </button>
                    {mockTaggableMembers.map(m => (
                      <button
                        key={m.id}
                        className={`${styles.filterChip} ${personFilter === m.id ? styles.filterChipActive : ''}`}
                        onClick={() => setPersonFilter(m.id)}
                        style={personFilter === m.id ? { background: m.color, borderColor: m.color } : {}}
                      >
                        {m.name.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                  <div className={styles.card}>
                    <div className={styles.cardHeader}>
                      <span className={styles.cardTitle}>
                        {personFilter === 'All'
                          ? 'All Albums'
                          : `Albums featuring ${mockTaggableMembers.find(m => m.id === personFilter)?.name.split(' ')[0]}`
                        }
                      </span>
                      <span className={styles.cardMeta}>{personAlbums.length} album{personAlbums.length !== 1 ? 's' : ''}</span>
                    </div>
                    {personAlbums.length === 0 ? (
                      <div className={styles.emptyState}><span>👤</span><p>No albums for this person yet.</p></div>
                    ) : (
                      <div className={styles.albumGrid}>
                        {personAlbums.map(a => <AlbumCard key={a.id} album={a} onClick={setOpenAlbum} />)}
                      </div>
                    )}
                  </div>
                </>
              )}

            </>
          )}
        </div>

        {/* ── Right Column ─────────────────────────────────────────────────── */}
        <div className={styles.rightCol}>

          {/* Upload CTA */}
          <div className={styles.card}>
            <div className={styles.uploadCta} onClick={() => setShowUpload(true)}>
              <div className={styles.uploadCtaIcon}>📤</div>
              <div className={styles.uploadCtaText}>Add Photos or Videos</div>
              <div className={styles.uploadCtaHint}>Share moments with the family</div>
            </div>
          </div>

          {/* Recently Added */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>🕐 Recently Added</span>
            </div>
            <div className={styles.recentList}>
              {mockMediaItems.slice(0, 6).map(item => (
                <div
                  key={item.id}
                  className={styles.recentItem}
                  onClick={() => setLightboxItem(item)}
                >
                  <div className={styles.recentThumb} style={{ background: `${item.bg}22` }}>
                    <span>{item.emoji}</span>
                    {item.type === 'video' && <span className={styles.recentVideoTag}>▶</span>}
                  </div>
                  <div className={styles.recentBody}>
                    <div className={styles.recentCaption}>{item.caption}</div>
                    <div className={styles.recentMeta}>
                      {mockAlbums.find(a => a.id === item.albumId)?.name} · {item.uploadedAt}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* People in photos */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>👥 People</span>
            </div>
            <div className={styles.peopleList}>
              {mockTaggableMembers.map(m => {
                const albumsWithPerson = mockAlbums.filter(a => a.tags.includes(m.id)).length;
                return (
                  <div
                    key={m.id}
                    className={styles.personRow}
                    onClick={() => { setViewTab('People'); setPersonFilter(m.id); }}
                  >
                    <Avatar initials={m.initials} color={m.color} size={34} />
                    <div className={styles.personBody}>
                      <div className={styles.personName}>{m.name}</div>
                      <div className={styles.personCount}>{albumsWithPerson} album{albumsWithPerson !== 1 ? 's' : ''}</div>
                    </div>
                    <span className={styles.personChevron}>›</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* ── Lightbox ─────────────────────────────────────────────────────── */}
      {lightboxItem && (
        <Lightbox
          item={lightboxItem}
          album={lightboxAlbum}
          onClose={() => setLightboxItem(null)}
          onRequestDeletion={(id, reason) => console.log('Deletion requested', id, reason)}
        />
      )}

      {/* ── Upload Modal ─────────────────────────────────────────────────── */}
      {showUpload && <UploadModal onClose={() => setShowUpload(false)} />}

    </AppShell>
  );
}