import { useState } from 'react';
import AppShell from '../../components/layout/AppShell/AppShell';
import useAuthStore from '../../store/auth.store';
import styles from './Profile.module.css';
import { mockProfile } from './mockData';

// ─── Small reusable Avatar ────────────────────────────────────────────────────
function Avatar({ initials, color, size = 36, fontSize }) {
  return (
    <div
      className={styles.avatar}
      style={{
        width: size,
        height: size,
        fontSize: fontSize ?? size * 0.36,
        background: `linear-gradient(135deg, ${color}, ${color}bb)`,
      }}
    >
      {initials}
    </div>
  );
}

// ─── Section Card wrapper ─────────────────────────────────────────────────────
function SectionCard({ title, icon, action, actionLabel, children }) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.cardTitle}>{icon} {title}</span>
        {action && (
          <button className={styles.cardAction} onClick={action}>{actionLabel}</button>
        )}
      </div>
      {children}
    </div>
  );
}

// ─── Info Row (label + value) ─────────────────────────────────────────────────
function InfoRow({ label, value, mono }) {
  return (
    <div className={styles.infoRow}>
      <span className={styles.infoLabel}>{label}</span>
      <span className={`${styles.infoValue} ${mono ? styles.infoValueMono : ''}`}>{value || '—'}</span>
    </div>
  );
}

// ─── Edit Profile Modal ───────────────────────────────────────────────────────
function EditProfileModal({ profile, onClose }) {
  const [name,       setName]       = useState(profile.name);
  const [bio,        setBio]        = useState(profile.bio);
  const [phone,      setPhone]      = useState(profile.phone);
  const [email,      setEmail]      = useState(profile.email);
  const [location,   setLocation]   = useState(profile.location);
  const [occupation, setOccupation] = useState(profile.occupation);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>

        <div className={styles.modalHeader}>
          <span className={styles.modalTitle}>✏️ Edit Profile</span>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.modalBody}>

          <div className={styles.modalAvatarRow}>
            <div
              className={styles.modalBigAvatar}
              style={{ background: `linear-gradient(135deg, ${profile.color}, ${profile.color}bb)` }}
            >
              {profile.initials}
            </div>
            <button className={styles.changePhotoBtn}>Change Photo</button>
          </div>

          <div className={styles.formGrid}>
            <div className={styles.formGroupFull}>
              <label className={styles.formLabel}>Full Name</label>
              <input className={styles.formInput} value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className={styles.formGroupFull}>
              <label className={styles.formLabel}>Bio</label>
              <textarea className={styles.formTextarea} value={bio} onChange={e => setBio(e.target.value)} rows={3} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Phone</label>
              <input className={styles.formInput} value={phone} onChange={e => setPhone(e.target.value)} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Email</label>
              <input className={styles.formInput} value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Location</label>
              <input className={styles.formInput} value={location} onChange={e => setLocation(e.target.value)} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Occupation</label>
              <input className={styles.formInput} value={occupation} onChange={e => setOccupation(e.target.value)} />
            </div>
          </div>

        </div>

        <div className={styles.modalFooter}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={styles.saveBtn} onClick={onClose}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}

// ─── Change Password Modal ────────────────────────────────────────────────────
function ChangePasswordModal({ onClose }) {
  const [current,  setCurrent]  = useState('');
  const [next,     setNext]     = useState('');
  const [confirm,  setConfirm]  = useState('');
  const match = next && confirm && next === confirm;
  const mismatch = next && confirm && next !== confirm;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modalSm} onClick={e => e.stopPropagation()}>

        <div className={styles.modalHeader}>
          <span className={styles.modalTitle}>🔑 Change Password</span>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.formGroupFull}>
            <label className={styles.formLabel}>Current Password</label>
            <input className={styles.formInput} type="password" value={current} onChange={e => setCurrent(e.target.value)} />
          </div>
          <div className={styles.formGroupFull} style={{ marginTop: 12 }}>
            <label className={styles.formLabel}>New Password</label>
            <input className={styles.formInput} type="password" value={next} onChange={e => setNext(e.target.value)} />
          </div>
          <div className={styles.formGroupFull} style={{ marginTop: 12 }}>
            <label className={styles.formLabel}>Confirm New Password</label>
            <input
              className={`${styles.formInput} ${mismatch ? styles.formInputError : match ? styles.formInputSuccess : ''}`}
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
            />
            {mismatch && <span className={styles.fieldError}>Passwords do not match</span>}
            {match    && <span className={styles.fieldSuccess}>Passwords match ✓</span>}
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={styles.saveBtn} disabled={!match} onClick={onClose}>Update Password</button>
        </div>
      </div>
    </div>
  );
}

// ─── Profile Page ─────────────────────────────────────────────────────────────
export default function Profile() {
  const user = useAuthStore(s => s.user);
  const p    = mockProfile;

  const [activeTab,        setActiveTab]        = useState('Personal');
  const [showEditModal,    setShowEditModal]    = useState(false);
  const [showPasswordModal,setShowPasswordModal] = useState(false);

  const tabs = ['Personal', 'Medical', 'Family', 'Vault', 'Activity'];

  return (
    <AppShell>
      <div className={styles.page}>

        {/* ── Hero banner ──────────────────────────────────────────────────── */}
        <div className={styles.heroBanner}>

          <div className={styles.heroContent}>
            {/* Big avatar */}
            <div className={styles.heroAvatarWrap}>
              <div
                className={styles.heroAvatar}
                style={{ background: `linear-gradient(135deg, ${p.color}, ${p.color}bb)` }}
              >
                {p.initials}
              </div>
              {p.isAdmin && <div className={styles.adminCrown} title="Family Admin">👑</div>}
              <div className={`${styles.onlineDot} ${p.lastSeen === 'Just now' ? styles.onlineDotGreen : ''}`} />
            </div>

            {/* Name block */}
            <div className={styles.heroInfo}>
              <div className={styles.heroNameRow}>
                <h1 className={styles.heroName}>{p.name}</h1>
                {p.isAdmin && <span className={styles.adminBadge}>👑 Admin</span>}
              </div>
              <div className={styles.heroRole}>{p.role} · {p.location}</div>
              <p className={styles.heroBio}>{p.bio}</p>
              <div className={styles.heroMeta}>
                <span>📅 Joined {p.joinedAt}</span>
                <span>·</span>
                <span>🕐 {p.lastSeen}</span>
                <span>·</span>
                <span>🩸 {p.bloodType}</span>
              </div>
            </div>

            {/* Hero actions */}
            <div className={styles.heroActions}>
              <button className={styles.editBtn} onClick={() => setShowEditModal(true)}>
                ✏️ Edit Profile
              </button>
              <button className={styles.pwdBtn} onClick={() => setShowPasswordModal(true)}>
                🔑 Password
              </button>
            </div>
          </div>

          {/* Quick-stat pills */}
          <div className={styles.heroStats}>
            {[
              { icon: '👨‍👩‍👧‍👦', value: p.familyLinks.length, label: 'Family Links' },
              { icon: '📣',        value: 3,                    label: 'Announcements' },
              { icon: '📸',        value: 24,                   label: 'Photos Tagged' },
              { icon: '🗄️',        value: p.vaultSummary.filter(v => v.status === 'uploaded').length, label: 'Vault Docs' },
            ].map(s => (
              <div key={s.label} className={styles.heroStatPill}>
                <span className={styles.heroStatIcon}>{s.icon}</span>
                <span className={styles.heroStatValue}>{s.value}</span>
                <span className={styles.heroStatLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Tab bar ──────────────────────────────────────────────────────── */}
        <div className={styles.tabBar}>
          {tabs.map(t => (
            <button
              key={t}
              className={`${styles.tab} ${activeTab === t ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(t)}
            >
              {t}
            </button>
          ))}
        </div>

        {/* ── Main layout ──────────────────────────────────────────────────── */}
        <div className={styles.layout}>

          {/* ════════ LEFT COL ════════ */}
          <div className={styles.leftCol}>

            {/* ── PERSONAL TAB ── */}
            {activeTab === 'Personal' && (
              <>
                <SectionCard title="Contact Information" icon="📞" action={() => setShowEditModal(true)} actionLabel="Edit">
                  <div className={styles.infoList}>
                    <InfoRow label="Phone"           value={p.phone} />
                    <InfoRow label="Alternate Phone" value={p.alternatePhone} />
                    <InfoRow label="Email"           value={p.email} />
                    <InfoRow label="WhatsApp"        value={p.whatsapp} />
                  </div>
                </SectionCard>

                <SectionCard title="Personal Details" icon="👤" action={() => setShowEditModal(true)} actionLabel="Edit">
                  <div className={styles.infoList}>
                    <InfoRow label="Date of Birth" value={p.dobDisplay} />
                    <InfoRow label="Age"           value={`${p.age} years`} />
                    <InfoRow label="Gender"        value={p.gender} />
                    <InfoRow label="NIN"           value={p.nin} mono />
                    <InfoRow label="Blood Type"    value={p.bloodType} />
                    <InfoRow label="Location"      value={p.location} />
                  </div>
                </SectionCard>

                <SectionCard title="Work" icon="💼" action={() => setShowEditModal(true)} actionLabel="Edit">
                  <div className={styles.infoList}>
                    <InfoRow label="Occupation" value={p.occupation} />
                    <InfoRow label="Employer"   value={p.employer} />
                  </div>
                </SectionCard>
              </>
            )}

            {/* ── MEDICAL TAB ── */}
            {activeTab === 'Medical' && (
              <>
                <SectionCard title="Medical Information" icon="🏥" action={() => {}} actionLabel="Edit">
                  <div className={styles.infoList}>
                    <InfoRow label="Blood Type"          value={p.bloodType} />
                    <InfoRow label="Doctor"              value={p.doctorName} />
                    <InfoRow label="Doctor Phone"        value={p.doctorPhone} />
                    <InfoRow label="Preferred Hospital"  value={p.hospitalPreference} />
                  </div>
                </SectionCard>

                <SectionCard title="Conditions & Allergies" icon="💊" action={() => {}} actionLabel="Edit">
                  <div className={styles.cardBody}>
                    <div className={styles.tagSectionLabel}>Medical Conditions</div>
                    <div className={styles.tagWrap}>
                      {p.medicalConditions.length > 0
                        ? p.medicalConditions.map(c => (
                            <span key={c} className={styles.conditionTag}>{c}</span>
                          ))
                        : <span className={styles.emptyNote}>None recorded</span>
                      }
                    </div>
                    <div className={styles.tagSectionLabel} style={{ marginTop: 16 }}>Allergies</div>
                    <div className={styles.tagWrap}>
                      {p.allergies.length > 0
                        ? p.allergies.map(a => (
                            <span key={a} className={styles.allergyTag}>{a}</span>
                          ))
                        : <span className={styles.emptyNote}>None recorded</span>
                      }
                    </div>
                  </div>
                </SectionCard>

                <SectionCard title="Emergency Contacts" icon="🆘" action={() => {}} actionLabel="Add">
                  <div className={styles.ecList}>
                    {p.emergencyContacts.map(ec => (
                      <div key={ec.id} className={styles.ecItem}>
                        <Avatar initials={ec.initials} color={ec.color} size={38} />
                        <div className={styles.ecBody}>
                          <div className={styles.ecName}>{ec.name}</div>
                          <div className={styles.ecRelation}>{ec.relation}</div>
                          <div className={styles.ecPhone}>{ec.phone}</div>
                        </div>
                        <a href={`tel:${ec.phone}`} className={styles.callBtn}>📞</a>
                      </div>
                    ))}
                  </div>
                </SectionCard>
              </>
            )}

            {/* ── FAMILY TAB ── */}
            {activeTab === 'Family' && (
              <SectionCard title="Family Connections" icon="👨‍👩‍👧‍👦" action={() => {}} actionLabel="Edit Tree">
                <div className={styles.familyList}>
                  {p.familyLinks.map(m => (
                    <div key={m.id} className={styles.familyItem}>
                      <div className={styles.familyAvatarWrap}>
                        <Avatar
                          initials={m.initials}
                          color={m.isDeceased ? '#999' : m.color}
                          size={44}
                        />
                        {m.isDeceased && <span className={styles.deceasedOverlay}>✝</span>}
                      </div>
                      <div className={styles.familyBody}>
                        <div className={styles.familyName}>{m.name}</div>
                        <div className={styles.familyRelation}>{m.relation}</div>
                        {m.isDeceased && <div className={styles.deceasedNote}>Deceased — Rest in Peace</div>}
                      </div>
                      {!m.isDeceased && (
                        <div className={styles.familyActions}>
                          <button className={styles.familyActionBtn}>View</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}

            {/* ── VAULT TAB ── */}
            {activeTab === 'Vault' && (
              <SectionCard title="Personal Vault" icon="🗄️" action={() => {}} actionLabel="Upload Doc">
                <div className={styles.vaultList}>
                  {p.vaultSummary.map(doc => (
                    <div key={doc.id} className={styles.vaultItem}>
                      <div className={styles.vaultItemIcon}>{doc.emoji}</div>
                      <div className={styles.vaultItemBody}>
                        <div className={styles.vaultItemLabel}>{doc.label}</div>
                        <div className={`${styles.vaultItemStatus} ${doc.status === 'uploaded' ? styles.statusUploaded : styles.statusMissing}`}>
                          {doc.status === 'uploaded' ? '✓ Uploaded' : '⚠ Missing'}
                        </div>
                      </div>
                      {doc.status === 'uploaded'
                        ? <button className={styles.vaultViewBtn}>View</button>
                        : <button className={styles.vaultUploadBtn}>Upload</button>
                      }
                    </div>
                  ))}
                </div>
                <div className={styles.vaultNote}>
                  🔒 Documents are encrypted and only accessible to you and the family admin.
                </div>
              </SectionCard>
            )}

            {/* ── ACTIVITY TAB ── */}
            {activeTab === 'Activity' && (
              <SectionCard title="Recent Activity" icon="📋">
                <div className={styles.activityList}>
                  {p.recentActivity.map(a => (
                    <div key={a.id} className={styles.activityItem}>
                      <div className={styles.activityIcon}>{a.icon}</div>
                      <div className={styles.activityBody}>
                        <div className={styles.activityText}>{a.text}</div>
                        <div className={styles.activityTime}>{a.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}

          </div>

          {/* ════════ RIGHT COL ════════ */}
          <div className={styles.rightCol}>

            {/* Quick actions */}
            <SectionCard title="Quick Actions" icon="⚡">
              <div className={styles.quickActions}>
                {[
                  { icon: '✏️', label: 'Edit Profile',    action: () => setShowEditModal(true) },
                  { icon: '🔑', label: 'Change Password', action: () => setShowPasswordModal(true) },
                  { icon: '🆘', label: 'Update SOS',      action: () => {} },
                  { icon: '🗄️', label: 'My Vault',        action: () => setActiveTab('Vault') },
                  { icon: '📸', label: 'My Photos',       action: () => {} },
                  { icon: '🌳', label: 'Family Tree',     action: () => setActiveTab('Family') },
                ].map(a => (
                  <button key={a.label} className={styles.quickActionBtn} onClick={a.action}>
                    <span className={styles.quickActionIcon}>{a.icon}</span>
                    <span>{a.label}</span>
                  </button>
                ))}
              </div>
            </SectionCard>

            {/* Vault summary */}
            <SectionCard title="Vault Status" icon="🗄️" action={() => setActiveTab('Vault')} actionLabel="View All">
              <div className={styles.vaultMiniList}>
                {p.vaultSummary.map(doc => (
                  <div key={doc.id} className={styles.vaultMiniItem}>
                    <span className={styles.vaultMiniIcon}>{doc.emoji}</span>
                    <span className={styles.vaultMiniLabel}>{doc.label}</span>
                    <span className={`${styles.vaultMiniStatus} ${doc.status === 'uploaded' ? styles.statusUploaded : styles.statusMissing}`}>
                      {doc.status === 'uploaded' ? '✓' : '!'}
                    </span>
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* Emergency contacts mini */}
            <SectionCard title="Emergency Contacts" icon="🆘" action={() => setActiveTab('Medical')} actionLabel="Manage">
              <div className={styles.ecMiniList}>
                {p.emergencyContacts.map(ec => (
                  <div key={ec.id} className={styles.ecMiniItem}>
                    <Avatar initials={ec.initials} color={ec.color} size={32} />
                    <div className={styles.ecMiniBody}>
                      <div className={styles.ecMiniName}>{ec.name}</div>
                      <div className={styles.ecMiniRelation}>{ec.relation}</div>
                    </div>
                    <a href={`tel:${ec.phone}`} className={styles.ecMiniCall}>📞</a>
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* Danger zone */}
            <div className={styles.dangerCard}>
              <div className={styles.dangerTitle}>⚠️ Account</div>
              <div className={styles.dangerDesc}>
                Manage sensitive account settings carefully.
              </div>
              <div className={styles.dangerActions}>
                <button className={styles.dangerBtn}>Deactivate Account</button>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* ── Modals ─────────────────────────────────────────────────────────── */}
      {showEditModal     && <EditProfileModal    profile={p} onClose={() => setShowEditModal(false)} />}
      {showPasswordModal && <ChangePasswordModal             onClose={() => setShowPasswordModal(false)} />}

    </AppShell>
  );
}