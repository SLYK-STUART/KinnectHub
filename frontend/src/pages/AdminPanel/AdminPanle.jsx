import { useMemo, useState } from 'react';
import styles from './AdminPanel.module.css';
import AppShell from '../../components/layout/AppShell/AppShell';

import {
  mockMembers,
  mockActivityLog,
  mockDeletionRequests,
  mockStats,
} from './mockData';

export default function AdminPanel() {
  const [theme, setTheme] = useState('light');
  const [activeTab, setActiveTab] = useState('members');
  const [selectedMember, setSelectedMember] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState('');

  const filteredMembers = useMemo(() => {
    return mockMembers.filter((member) => {
      const value = search.toLowerCase();

      return (
        member.name.toLowerCase().includes(value) ||
        member.role.toLowerCase().includes(value) ||
        member.email.toLowerCase().includes(value)
      );
    });
  }, [search]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <AppShell>
    <div data-theme={theme}>
      <div className={styles.page}>
        {/* ─── Header ───────────────────────────────────────────── */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <h1>Family Admin Panel</h1>
            <p>
              Manage members, permissions, vaults, activity and family records.
            </p>
          </div>

          <div className={styles.headerActions}>
            <button
              className={styles.addMemberBtn}
              onClick={() => setShowAddModal(true)}
            >
              <span>＋</span>
              Add Member
            </button>

            <button className={styles.themeBtn} onClick={toggleTheme}>
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>
        </header>

        {/* ─── Stats Strip ─────────────────────────────────────── */}
        <section className={styles.statsStrip}>
          <StatCard
            icon="👨‍👩‍👧"
            value={mockStats.totalMembers}
            label="Total Members"
            bg="rgba(45,90,61,0.12)"
          />

          <StatCard
            icon="🟢"
            value={mockStats.activeMembers}
            label="Active Members"
            bg="rgba(61,122,110,0.12)"
          />

          <StatCard
            icon="🗄️"
            value={mockStats.vaultDocs}
            label="Vault Docs"
            bg="rgba(61,90,138,0.12)"
          />

          <div className={styles.statCardAlert}>
            <div
              className={styles.statIcon}
              style={{
                background: 'rgba(192,57,43,0.12)',
              }}
            >
              🚨
            </div>

            <div>
              <div className={styles.statValueAlert}>
                {mockStats.sosAlerts}
              </div>
              <div className={styles.statLabel}>SOS Alerts</div>
            </div>
          </div>
        </section>

        {/* ─── Main Layout ─────────────────────────────────────── */}
        <div className={styles.layout}>
          {/* ─── Left ─────────────────────────────────────────── */}
          <div>
            {/* ─── Members Table ─────────────────────────────── */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardTitle}>
                  Family Member Management
                </div>

                <button className={styles.cardAction}>
                  Export Members
                </button>
              </div>

              <div className={styles.tabBar}>
                <button
                  className={
                    activeTab === 'members'
                      ? styles.tabActive
                      : styles.tab
                  }
                  onClick={() => setActiveTab('members')}
                >
                  Members
                </button>

                <button
                  className={
                    activeTab === 'requests'
                      ? styles.tabActive
                      : styles.tab
                  }
                  onClick={() => setActiveTab('requests')}
                >
                  Deletion Requests
                </button>
              </div>

              <div className={styles.searchRow}>
                <input
                  type="text"
                  placeholder="Search members..."
                  className={styles.searchInput}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {activeTab === 'members' ? (
                <table className={styles.memberTable}>
                  <thead className={styles.memberTableHead}>
                    <tr>
                      <th>Member</th>
                      <th>Status</th>
                      <th>Email</th>
                      <th>Last Seen</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredMembers.map((member) => (
                      <tr
                        key={member.id}
                        className={`${styles.memberRow} ${
                          member.status === 'inactive'
                            ? styles.memberRowInactive
                            : ''
                        }`}
                      >
                        <td className={styles.memberCell}>
                          <div className={styles.memberIdentity}>
                            <div
                              className={styles.memberAvatar}
                              style={{
                                background: member.color,
                              }}
                            >
                              {member.initials}

                              {member.isAdmin && (
                                <span className={styles.adminCrown}>
                                  👑
                                </span>
                              )}
                            </div>

                            <div>
                              <div className={styles.memberName}>
                                {member.name}

                                {member.isDeceased && (
                                  <span className={styles.deceasedTag}>
                                    Deceased
                                  </span>
                                )}
                              </div>

                              <div className={styles.memberRole}>
                                {member.role}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className={styles.memberCell}>
                          <span
                            className={`${styles.statusBadge} ${
                              member.status === 'active'
                                ? styles.statusActive
                                : styles.statusInactive
                            }`}
                          >
                            {member.status === 'active' ? '●' : '◌'}
                            {member.status}
                          </span>
                        </td>

                        <td className={styles.memberCell}>
                          {member.email}
                        </td>

                        <td className={styles.memberCell}>
                          {member.lastSeen}
                        </td>

                        <td className={styles.memberCell}>
                          <div className={styles.actionBtns}>
                            <button
                              className={styles.actionBtn}
                              onClick={() => setSelectedMember(member)}
                            >
                              View
                            </button>

                            <button className={styles.actionBtn}>
                              Edit
                            </button>

                            <button className={styles.actionBtnDanger}>
                              Suspend
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <>
                  {mockDeletionRequests.length > 0 ? (
                    mockDeletionRequests.map((request) => (
                      <div
                        className={styles.deletionItem}
                        key={request.id}
                      >
                        <div
                          className={styles.deletionAvatar}
                          style={{
                            background: request.requestedByColor,
                          }}
                        >
                          {request.requestedByInitials}
                        </div>

                        <div className={styles.deletionBody}>
                          <div className={styles.deletionRequester}>
                            {request.requestedBy}
                          </div>

                          <div className={styles.deletionItem_}>
                            {request.item}
                          </div>

                          <div className={styles.deletionReason}>
                            {request.reason}
                          </div>

                          <div className={styles.deletionActions}>
                            <button className={styles.approveBtn}>
                              Approve
                            </button>

                            <button className={styles.denyBtn}>
                              Deny
                            </button>
                          </div>
                        </div>

                        <div className={styles.deletionTime}>
                          {request.time}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className={styles.emptyDeletion}>
                      No deletion requests.
                    </div>
                  )}
                </>
              )}
            </section>
          </div>

          {/* ─── Right Sidebar ───────────────────────────────── */}
          <aside>
            {/* ─── Activity Log ─────────────────────────────── */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardTitle}>
                  Activity Log
                </div>

                <button className={styles.cardAction}>
                  View All
                </button>
              </div>

              {mockActivityLog.map((log) => (
                <div className={styles.logItem} key={log.id}>
                  <div className={styles.logIcon}>{log.icon}</div>

                  <div className={styles.logText}>
                    <span className={styles.logActor}>
                      {log.actor}
                    </span>{' '}
                    {log.action}{' '}
                    <span className={styles.logTarget}>
                      {log.target}
                    </span>
                  </div>

                  <div className={styles.logTime}>
                    {log.time}
                  </div>
                </div>
              ))}
            </section>

            {/* ─── Vault Override ───────────────────────────── */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardTitle}>
                  Vault Controls
                </div>
              </div>

              <div className={styles.vaultCard}>
                <div className={styles.vaultCardTitle}>
                  🔐 Emergency Vault Override
                </div>

                <div className={styles.vaultCardDesc}>
                  Allows admins to bypass protected vault access in
                  emergency situations.
                </div>

                <button className={styles.vaultOverrideBtn}>
                  Trigger Override
                </button>
              </div>
            </section>

            {/* ─── Quick Actions ────────────────────────────── */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardTitle}>
                  Quick Actions
                </div>
              </div>

              <div className={styles.quickActions}>
                <button className={styles.quickActionBtn}>
                  <span className={styles.quickActionIcon}>📣</span>
                  Announcement
                </button>

                <button className={styles.quickActionBtn}>
                  <span className={styles.quickActionIcon}>🆘</span>
                  Trigger SOS
                </button>

                <button className={styles.quickActionBtn}>
                  <span className={styles.quickActionIcon}>📸</span>
                  Upload Media
                </button>

                <button className={styles.quickActionBtn}>
                  <span className={styles.quickActionIcon}>🗄️</span>
                  Create Vault
                </button>
              </div>
            </section>
          </aside>
        </div>

        {/* ─── Member Modal ─────────────────────────────────── */}
        {selectedMember && (
          <div
            className={styles.overlay}
            onClick={() => setSelectedMember(null)}
          >
            <div
              className={styles.modal}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <button
                  className={styles.modalCloseBtn}
                  onClick={() => setSelectedMember(null)}
                >
                  ✕
                </button>

                <div
                  className={styles.modalAvatar}
                  style={{
                    background: selectedMember.color,
                  }}
                >
                  {selectedMember.initials}
                </div>

                <div className={styles.modalName}>
                  {selectedMember.name}
                </div>

                <div className={styles.modalRolePill}>
                  {selectedMember.role}
                </div>

                {selectedMember.isAdmin && (
                  <div className={styles.modalAdminPill}>
                    Admin Access
                  </div>
                )}
              </div>

              {selectedMember.isDeceased && (
                <div className={styles.deceasedBanner}>
                  In Loving Memory
                </div>
              )}

              <div className={styles.modalBody}>
                <ModalRow
                  label="Email"
                  value={selectedMember.email}
                />

                <ModalRow
                  label="Phone"
                  value={selectedMember.phone}
                />

                <ModalRow
                  label="NIN"
                  value={selectedMember.nin}
                />

                <ModalRow
                  label="Blood Type"
                  value={selectedMember.bloodType}
                />

                <ModalRow
                  label="Date of Birth"
                  value={selectedMember.dob}
                />

                <ModalRow
                  label="Joined"
                  value={selectedMember.joinedAt}
                />

                <ModalRow
                  label="Last Seen"
                  value={selectedMember.lastSeen}
                />
              </div>

              <div className={styles.modalActions}>
                <button className={styles.modalActionBtn}>
                  Reset Password
                </button>

                <button className={styles.modalActionBtn}>
                  Edit Profile
                </button>

                <button className={styles.modalActionBtnDanger}>
                  Suspend
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── Add Member Modal ─────────────────────────────── */}
        {showAddModal && (
          <div
            className={styles.overlay}
            onClick={() => setShowAddModal(false)}
          >
            <div
              className={styles.addModal}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.addModalHeader}>
                <div className={styles.addModalTitle}>
                  Add Family Member
                </div>

                <button
                  className={styles.modalCloseBtn}
                  onClick={() => setShowAddModal(false)}
                >
                  ✕
                </button>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    First Name
                  </label>

                  <input
                    className={styles.formInput}
                    placeholder="Enter first name"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    Last Name
                  </label>

                  <input
                    className={styles.formInput}
                    placeholder="Enter last name"
                  />
                </div>

                <div className={styles.formGroupFull}>
                  <label className={styles.formLabel}>
                    Email Address
                  </label>

                  <input
                    className={styles.formInput}
                    placeholder="Enter email"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    Family Role
                  </label>

                  <select className={styles.formSelect}>
                    <option>Father</option>
                    <option>Mother</option>
                    <option>Child</option>
                    <option>Aunt</option>
                    <option>Uncle</option>
                    <option>Grandparent</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    Blood Type
                  </label>

                  <select className={styles.formSelect}>
                    <option>O+</option>
                    <option>O-</option>
                    <option>A+</option>
                    <option>A-</option>
                    <option>B+</option>
                    <option>B-</option>
                    <option>AB+</option>
                    <option>AB-</option>
                  </select>
                </div>

                <div className={styles.tempPasswordBox}>
                  <div className={styles.tempPasswordLabel}>
                    Temporary Password
                  </div>

                  <div className={styles.tempPasswordValue}>
                    FAM-2841-XQ
                  </div>
                </div>
              </div>

              <div className={styles.addModalFooter}>
                <button
                  className={styles.cancelBtn}
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>

                <button className={styles.createBtn}>
                  Create Member
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

/* ───────────────────────────────────────────────────────────── */

function StatCard({ icon, value, label, bg }) {
  return (
    <div className={styles.statCard}>
      <div
        className={styles.statIcon}
        style={{
          background: bg,
        }}
      >
        {icon}
      </div>

      <div>
        <div className={styles.statValue}>{value}</div>
        <div className={styles.statLabel}>{label}</div>
      </div>
    </div>
  );
}

function ModalRow({ label, value }) {
  return (
    <div className={styles.modalRow}>
      <div className={styles.modalRowLabel}>
        {label}
      </div>

      <div className={styles.modalRowValue}>
        {value}
      </div>
    </div>
  );
}