import { useState } from 'react';
import AppShell from '../../components/layout/AppShell/AppShell';
import useAuthStore from '../../store/auth.store';
import styles from './AdminPanel.module.css';
import {
  mockMembers,
  mockDeletionRequests,
  mockAdminVaults,
  mockAllAnnouncements,
  mockActivityLog,
  VAULT_TYPE_COLORS,
} from './mockData';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function Avatar({ initials, color, size = 38 }) {
  return (
    <div
      className={styles.memberAvatar}
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

function MiniAvatar({ initials, color }) {
  return (
    <div
      className={styles.miniAvatar}
      style={{ background: `linear-gradient(135deg, ${color}, ${color}bb)` }}
    >
      {initials}
    </div>
  );
}

// ─── Nav config ───────────────────────────────────────────────────────────────
const NAV = [
  { id: 'overview',   icon: '📊', label: 'Overview'          },
  { id: 'members',    icon: '👥', label: 'Members'           },
  { id: 'deletions',  icon: '🗑', label: 'Deletion Requests' },
  { id: 'vault',      icon: '🔐', label: 'Vault Override'    },
  { id: 'announce',   icon: '📣', label: 'Announcements'     },
  { id: 'activity',   icon: '🕐', label: 'Activity Log'      },
];

// ─── Modals ───────────────────────────────────────────────────────────────────

function InviteMemberModal({ onClose }) {
  const [name, setName]   = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole]   = useState('member');
  const password = 'Kh@' + Math.random().toString(36).slice(2, 8).toUpperCase();
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(password).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Invite Family Member</h2>
          <p className={styles.modalSub}>A temporary password will be generated for first login.</p>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Full Name</label>
            <input className={styles.formInput} placeholder="e.g. Sarah Nakimera" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Email</label>
            <input className={styles.formInput} type="email" placeholder="e.g. sarah@family.kh" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Family Role</label>
            <select className={styles.formSelect} value={role} onChange={e => setRole(e.target.value)}>
              {['Father','Mother','1st Born','2nd Born','3rd Born','Grandfather','Grandmother','Aunt','Uncle','Cousin'].map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Temporary Password</label>
            <div className={styles.passwordBox}>
              <span className={styles.passwordValue}>{password}</span>
              <button className={`${styles.copyBtn} ${copied ? styles.copied : ''}`} onClick={copy}>
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            </div>
            <p className={styles.passwordHint}>Share this privately. Member will be prompted to change on first login.</p>
          </div>
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={`${styles.submitBtn}`} disabled={!name.trim() || !email.trim()} onClick={onClose}>
            Send Invite
          </button>
        </div>
      </div>
    </div>
  );
}

function ResetPasswordModal({ member, onClose }) {
  const password = 'Kh@' + Math.random().toString(36).slice(2, 8).toUpperCase();
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(password).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Reset Password</h2>
          <p className={styles.modalSub}>Resetting password for {member.name}</p>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>New Temporary Password</label>
            <div className={styles.passwordBox}>
              <span className={styles.passwordValue}>{password}</span>
              <button className={`${styles.copyBtn} ${copied ? styles.copied : ''}`} onClick={copy}>
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            </div>
            <p className={styles.passwordHint}>Share this securely. Member must change it on next login.</p>
          </div>
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={styles.submitBtn} onClick={onClose}>Confirm Reset</button>
        </div>
      </div>
    </div>
  );
}

function DeactivateModal({ member, onClose }) {
  const isActive = member.isActive;
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{isActive ? 'Deactivate' : 'Reactivate'} Account</h2>
          <p className={styles.modalSub}>{member.name} · {member.role}</p>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.overrideWarning}>
            ⚠️ {isActive
              ? 'Deactivating this account will prevent the member from logging in. Their data will be preserved.'
              : 'Reactivating will restore full access for this member.'}
          </div>
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={`${styles.submitBtn} ${isActive ? styles.danger : ''}`} onClick={onClose}>
            {isActive ? 'Deactivate' : 'Reactivate'}
          </button>
        </div>
      </div>
    </div>
  );
}

function VaultOverrideModal({ vault, onClose }) {
  const [reason, setReason] = useState('');
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Override Vault Passcode</h2>
          <p className={styles.modalSub}>{vault.emoji} {vault.name}</p>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.overrideWarning}>
            ⚠️ This will bypass the member's passcode and grant you immediate access. This action is logged.
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Reason for Override</label>
            <input className={styles.formInput} placeholder="e.g. Member is unavailable, urgent document needed" value={reason} onChange={e => setReason(e.target.value)} />
          </div>
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={`${styles.submitBtn} ${styles.danger}`} disabled={!reason.trim()} onClick={onClose}>
            Override Access
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteAnnouncementModal({ announcement, onClose }) {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Delete Announcement</h2>
          <p className={styles.modalSub}>This action cannot be undone.</p>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.overrideWarning}>
            ⚠️ You are about to permanently delete: "{announcement.title}"
          </div>
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={`${styles.submitBtn} ${styles.danger}`} onClick={onClose}>Delete</button>
        </div>
      </div>
    </div>
  );
}

// ─── Sections ─────────────────────────────────────────────────────────────────

function Overview({ onNavigate, onInvite }) {
  const activeMembers   = mockMembers.filter(m => m.isActive).length;
  const pendingDeletes  = mockDeletionRequests.filter(d => d.status === 'pending').length;
  const urgentAnnounce  = mockAllAnnouncements.filter(a => a.isUrgent).length;
  const totalVaultDocs  = mockAdminVaults.reduce((s, v) => s + v.docCount, 0);

  return (
    <>
      {/* Stats */}
      <div className={styles.statsGrid}>
        {[
          { icon: '👥', value: activeMembers,  label: 'Active Members',   bg: 'rgba(45,90,61,0.08)',   nav: 'members'   },
          { icon: '🗑', value: pendingDeletes, label: 'Pending Deletions', bg: 'rgba(192,57,43,0.07)', nav: 'deletions' },
          { icon: '🔐', value: totalVaultDocs, label: 'Vault Documents',   bg: 'rgba(61,90,138,0.08)', nav: 'vault'     },
          { icon: '🚨', value: urgentAnnounce, label: 'Urgent Posts',      bg: 'rgba(201,168,76,0.10)',nav: 'announce'  },
        ].map(s => (
          <div key={s.label} className={styles.statCard} onClick={() => onNavigate(s.nav)}>
            <div className={styles.statIcon} style={{ background: s.bg }}>{s.icon}</div>
            <div>
              <div className={styles.statValue}>{s.value}</div>
              <div className={styles.statLabel}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Overview grid */}
      <div className={styles.overviewGrid}>

        {/* Quick actions */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>⚡ Quick Actions</span>
          </div>
          <div className={styles.quickActions}>
            {[
              { icon: '👤', label: 'Invite Member',       action: onInvite },
              { icon: '📣', label: 'Post Announcement',   action: () => onNavigate('announce') },
              { icon: '🔐', label: 'Override Vault',      action: () => onNavigate('vault') },
              { icon: '✅', label: 'Review Deletions',    action: () => onNavigate('deletions') },
              { icon: '🕐', label: 'View Activity Log',   action: () => onNavigate('activity') },
              { icon: '👥', label: 'Manage Members',      action: () => onNavigate('members') },
            ].map(a => (
              <button key={a.label} className={styles.quickActionBtn} onClick={a.action}>
                <span className={styles.quickActionIcon}>{a.icon}</span>
                <span>{a.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Recent activity preview */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>🕐 Recent Activity</span>
            <button className={styles.cardAction} onClick={() => onNavigate('activity')}>View All</button>
          </div>
          <div className={styles.activityList}>
            {mockActivityLog.slice(0, 5).map(item => (
              <div key={item.id} className={styles.activityItem}>
                <div className={styles.activityIconWrap} style={{ background: `${item.color}18` }}>
                  {item.icon}
                </div>
                <div className={styles.activityBody}>
                  <p className={styles.activityMessage}>{item.message}</p>
                  <span className={styles.activityTime}>{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  );
}

function Members({ onInvite }) {
  const [search, setSearch] = useState('');
  const [modal, setModal]   = useState(null); // { type, member }

  const filtered = mockMembers.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.role.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderLeft}>
          <h1>Members</h1>
          <p>{mockMembers.filter(m => m.isActive).length} active · {mockMembers.filter(m => !m.isActive).length} inactive</p>
        </div>
        <button className={styles.primaryBtn} onClick={onInvite}>
          👤 Invite Member
        </button>
      </div>

      <div className={styles.card}>
        {/* Search */}
        <div className={styles.searchBar}>
          <input
            className={styles.searchInput}
            placeholder="🔍  Search by name, role, or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Table header */}
        <div className={styles.memberTableHeader}>
          <span className={styles.tableHeaderCell}>Member</span>
          <span className={styles.tableHeaderCell}>Role</span>
          <span className={styles.tableHeaderCell}>Joined</span>
          <span className={styles.tableHeaderCell}>Last Seen</span>
          <span className={styles.tableHeaderCell}>Actions</span>
        </div>

        {/* Rows */}
        <div className={styles.memberTable}>
          {filtered.length === 0 ? (
            <div className={styles.emptyState}>
              <span className={styles.emptyEmoji}>🔍</span>
              <p className={styles.emptyText}>No members match your search.</p>
            </div>
          ) : (
            filtered.map(member => (
              <div key={member.id} className={styles.memberRow}>
                {/* Member info */}
                <div className={styles.memberInfo}>
                  <Avatar initials={member.initials} color={member.color} />
                  <div>
                    <div className={styles.memberName}>
                      {member.name}
                      {member.isAdmin && (
                        <span className={`${styles.statusBadge} ${styles.admin}`} style={{ marginLeft: 7 }}>👑 Admin</span>
                      )}
                    </div>
                    <div className={styles.memberEmail}>{member.email}</div>
                  </div>
                </div>

                {/* Role */}
                <span className={styles.memberRole}>{member.role}</span>

                {/* Joined */}
                <span className={styles.memberJoined}>{member.joinedAt}</span>

                {/* Last seen + status */}
                <div>
                  <div className={styles.memberLastSeen}>{member.lastSeen}</div>
                  <span className={`${styles.statusBadge} ${member.isActive ? styles.active : styles.inactive}`}>
                    {member.isActive ? '● Active' : '● Inactive'}
                  </span>
                </div>

                {/* Actions */}
                <div className={styles.memberActions}>
                  <button
                    className={styles.iconBtn}
                    title="Reset Password"
                    onClick={() => setModal({ type: 'reset', member })}
                  >🔑</button>
                  <button
                    className={`${styles.iconBtn} ${styles.danger}`}
                    title={member.isActive ? 'Deactivate' : 'Reactivate'}
                    onClick={() => setModal({ type: 'deactivate', member })}
                  >{member.isActive ? '🚫' : '✅'}</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modals */}
      {modal?.type === 'reset' && (
        <ResetPasswordModal member={modal.member} onClose={() => setModal(null)} />
      )}
      {modal?.type === 'deactivate' && (
        <DeactivateModal member={modal.member} onClose={() => setModal(null)} />
      )}
    </>
  );
}

function DeletionRequests() {
  const [filter, setFilter] = useState('pending');
  const [requests, setRequests] = useState(mockDeletionRequests);

  const filtered = filter === 'all' ? requests : requests.filter(r => r.status === filter);

  const handleApprove = id =>
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' } : r));
  const handleReject  = id =>
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected' } : r));

  const counts = {
    all:      requests.length,
    pending:  requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
  };

  return (
    <>
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderLeft}>
          <h1>Deletion Requests</h1>
          <p>Review media removal requests from family members</p>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.filterTabs}>
          {['all', 'pending', 'approved', 'rejected'].map(f => (
            <button
              key={f}
              className={`${styles.filterTab} ${filter === f ? styles.active : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {counts[f] > 0 && <span style={{ marginLeft: 5, opacity: 0.65 }}>({counts[f]})</span>}
            </button>
          ))}
        </div>

        <div className={styles.deletionList}>
          {filtered.length === 0 ? (
            <div className={styles.emptyState}>
              <span className={styles.emptyEmoji}>✅</span>
              <p className={styles.emptyText}>No {filter} requests.</p>
            </div>
          ) : (
            filtered.map(req => (
              <div key={req.id} className={styles.deletionItem}>
                <div className={styles.deletionMediaIcon}>{req.mediaEmoji}</div>
                <div className={styles.deletionInfo}>
                  <div className={styles.deletionFileName}>{req.mediaName}</div>
                  <div className={styles.deletionMeta}>
                    <div className={styles.deletionRequester}>
                      <MiniAvatar initials={req.requestedByInitials} color={req.requestedByColor} />
                      {req.requestedBy}
                    </div>
                    <span className={styles.deletionTime}>{req.requestedAt}</span>
                    <span className={`${styles.deletionStatusBadge} ${styles[req.status]}`}>
                      {req.status}
                    </span>
                  </div>
                  {req.reason && (
                    <div className={styles.deletionReason}>"{req.reason}"</div>
                  )}
                  {req.status === 'pending' && (
                    <div className={styles.deletionActionBtns}>
                      <button className={styles.approveBtn} onClick={() => handleApprove(req.id)}>
                        ✓ Approve
                      </button>
                      <button className={styles.rejectBtn} onClick={() => handleReject(req.id)}>
                        ✕ Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

function VaultOverride() {
  const [selectedVault, setSelectedVault] = useState(null);

  return (
    <>
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderLeft}>
          <h1>Vault Override</h1>
          <p>Bypass passcode protection on any vault category</p>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>🔐 All Vault Categories</span>
        </div>
        <div className={styles.vaultAdminList}>
          {mockAdminVaults.map(vault => {
            const colors = VAULT_TYPE_COLORS[vault.type] || VAULT_TYPE_COLORS.other;
            return (
              <div key={vault.id} className={styles.vaultAdminItem}>
                <div
                  className={styles.vaultAdminEmoji}
                  style={{ background: colors.bg }}
                >
                  {vault.emoji}
                </div>
                <div className={styles.vaultAdminInfo}>
                  <div className={styles.vaultAdminName}>{vault.name}</div>
                  <div className={styles.vaultAdminMeta}>
                    <span>{vault.docCount} documents</span>
                    <span>·</span>
                    <span>Created by {vault.createdBy}</span>
                    <span>·</span>
                    <span>{vault.createdAt}</span>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: 20,
                        background: colors.bg,
                        color: colors.text,
                        textTransform: 'capitalize',
                      }}
                    >
                      {vault.type}
                    </span>
                  </div>
                </div>
                <button
                  className={styles.vaultOverrideBtn}
                  onClick={() => setSelectedVault(vault)}
                >
                  🔓 Override
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {selectedVault && (
        <VaultOverrideModal vault={selectedVault} onClose={() => setSelectedVault(null)} />
      )}
    </>
  );
}

function AnnouncementsAdmin() {
  const [announcements, setAnnouncements] = useState(mockAllAnnouncements);
  const [deleteTarget, setDeleteTarget]   = useState(null);

  const handleDelete = id => {
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, status: 'deleted' } : a));
    setDeleteTarget(null);
  };

  return (
    <>
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderLeft}>
          <h1>Announcements</h1>
          <p>Manage all family announcements</p>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>📣 All Announcements</span>
          <span style={{ fontSize: 12, color: '#9A9590' }}>{announcements.length} total</span>
        </div>
        <div className={styles.announcementAdminList}>
          {announcements.map(a => (
            <div key={a.id} className={styles.announcementAdminItem}>
              <div
                className={styles.announcementAdminAvatar}
                style={{ background: `linear-gradient(135deg, ${a.authorColor}, ${a.authorColor}bb)` }}
              >
                {a.authorInitials}
              </div>
              <div className={styles.announcementAdminBody}>
                <div className={styles.announcementAdminTitle}>{a.title}</div>
                <div className={styles.announcementAdminMeta}>
                  <span className={styles.announcementAdminAuthor}>{a.author}</span>
                  <span className={styles.announcementAdminTime}>· {a.postedAt}</span>
                  <span className={styles.announcementAdminAudience}>· {a.audience}</span>
                  <span className={styles.announcementAdminReplies}>· 💬 {a.replies}</span>
                  {a.isUrgent && <span className={styles.urgentBadge}>Urgent</span>}
                  {a.status === 'deleted' && <span className={styles.deletedBadge}>Deleted</span>}
                </div>
              </div>
              <div className={styles.memberActions}>
                <button
                  className={`${styles.iconBtn} ${styles.danger}`}
                  title="Delete announcement"
                  disabled={a.status === 'deleted'}
                  onClick={() => setDeleteTarget(a)}
                >
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {deleteTarget && (
        <DeleteAnnouncementModal
          announcement={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => handleDelete(deleteTarget.id)}
        />
      )}
    </>
  );
}

const ACTIVITY_FILTERS = ['All', 'Members', 'SOS', 'Vault', 'Media', 'Announcements'];
const FILTER_TYPE_MAP  = {
  Members:      ['member_join', 'member_deactivate', 'password_reset'],
  SOS:          ['sos'],
  Vault:        ['vault_created', 'vault_override'],
  Media:        ['media_upload', 'deletion_req', 'deletion_approve'],
  Announcements:['announcement'],
};

function ActivityLog() {
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = activeFilter === 'All'
    ? mockActivityLog
    : mockActivityLog.filter(a => FILTER_TYPE_MAP[activeFilter]?.includes(a.type));

  return (
    <>
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderLeft}>
          <h1>Activity Log</h1>
          <p>Full audit trail of all family platform actions</p>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.activityFilters}>
          {ACTIVITY_FILTERS.map(f => (
            <button
              key={f}
              className={`${styles.filterTab} ${activeFilter === f ? styles.active : ''}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
        <div className={styles.activityList}>
          {filtered.length === 0 ? (
            <div className={styles.emptyState}>
              <span className={styles.emptyEmoji}>📭</span>
              <p className={styles.emptyText}>No activity for this filter.</p>
            </div>
          ) : (
            filtered.map(item => (
              <div key={item.id} className={styles.activityItem}>
                <div
                  className={styles.activityIconWrap}
                  style={{ background: `${item.color}18` }}
                >
                  {item.icon}
                </div>
                <div className={styles.activityBody}>
                  <p className={styles.activityMessage}>{item.message}</p>
                  <span className={styles.activityTime}>{item.time}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

// ─── Admin Panel ──────────────────────────────────────────────────────────────
export default function AdminPanel() {
  const user = useAuthStore(s => s.user);
  const [activeSection, setActiveSection] = useState('overview');
  const [showInvite, setShowInvite]       = useState(false);

  const pendingCount = mockDeletionRequests.filter(d => d.status === 'pending').length;

  const badgeCounts = {
    deletions: pendingCount,
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':  return <Overview  onNavigate={setActiveSection} onInvite={() => setShowInvite(true)} />;
      case 'members':   return <Members   onInvite={() => setShowInvite(true)} />;
      case 'deletions': return <DeletionRequests />;
      case 'vault':     return <VaultOverride />;
      case 'announce':  return <AnnouncementsAdmin />;
      case 'activity':  return <ActivityLog />;
      default:          return null;
    }
  };

  return (
    <AppShell>
    <div className={styles.adminShell}>

      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <aside className={styles.adminSidebar}>
        <div className={styles.adminSidebarLogo}>🏠</div>

        {NAV.map((item, i) => (
          <button
            key={item.id}
            className={`${styles.adminNavItem} ${activeSection === item.id ? styles.active : ''}`}
            onClick={() => setActiveSection(item.id)}
          >
            {item.icon}
            <span className={styles.adminNavTooltip}>{item.label}</span>
            {badgeCounts[item.id] > 0 && (
              <span className={styles.adminNavBadge}>{badgeCounts[item.id]}</span>
            )}
            {i === 1 && <div className={styles.adminSidebarDivider} style={{ position: 'absolute', bottom: -10, left: 16, width: 32 }} />}
          </button>
        ))}

        {/* Divider before bottom items */}
        <div style={{ flex: 1 }} />
        <div className={styles.adminSidebarDivider} />

        {/* Current user avatar at bottom */}
        <div
          className={styles.adminNavItem}
          title={user?.name}
          style={{ cursor: 'default' }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #2D5A3D, #3D7A50)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 600,
              color: '#fff',
            }}
          >
            {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() ?? 'AD'}
          </div>
          <span className={styles.adminNavTooltip}>{user?.name ?? 'Admin'}</span>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <main className={styles.adminContent}>
        {activeSection === 'overview' && (
          <div className={styles.pageHeader}>
            <div className={styles.pageHeaderLeft}>
              <h1>Admin Panel</h1>
              <p>Manage the Tayebwa family platform</p>
            </div>
            <button className={styles.primaryBtn} onClick={() => setShowInvite(true)}>
              👤 Invite Member
            </button>
          </div>
        )}

        {renderSection()}
      </main>

      {/* ── Global Invite Modal ───────────────────────────────────────────── */}
      {showInvite && <InviteMemberModal onClose={() => setShowInvite(false)} />}
    </div>
    </AppShell>
  );
}