import { useState } from 'react';
import AppShell from '../../components/layout/AppShell/AppShell';
import styles from './Vault.module.css';
import {
  mockVaultCategories,
  mockDocuments,
  VAULT_TYPE_COLORS,
} from './mockData';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const DOC_ICONS = { pdf: '📄', image: '🖼️', doc: '📝' };

const TYPE_OPTIONS = [
  { type: 'identity', emoji: '🪪', label: 'Identity'  },
  { type: 'legal',    emoji: '⚖️', label: 'Legal'     },
  { type: 'medical',  emoji: '🏥', label: 'Medical'   },
  { type: 'academic', emoji: '🎓', label: 'Academic'  },
  { type: 'other',    emoji: '📁', label: 'Other'     },
];

// ─── Passcode Modal ───────────────────────────────────────────────────────────
function PasscodeModal({ vault, onSuccess, onClose }) {
  const [input, setInput]     = useState('');
  const [error, setError]     = useState(false);
  const maxLen                = 4;
  const colors                = VAULT_TYPE_COLORS[vault.type];

  const handleKey = (num) => {
    if (input.length >= maxLen) return;
    const next = input + num;
    setInput(next);
    setError(false);

    if (next.length === maxLen) {
      setTimeout(() => {
        if (next === vault.passcode) {
          onSuccess();
        } else {
          setError(true);
          setInput('');
        }
      }, 180);
    }
  };

  const handleDelete = () => {
    setInput(v => v.slice(0, -1));
    setError(false);
  };

  const numKeys = ['1','2','3','4','5','6','7','8','9','','0','⌫'];

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.passcodeModal} onClick={e => e.stopPropagation()}>
        <div className={styles.passcodeModalHeader}>
          <div
            className={styles.passcodeVaultEmoji}
            style={{ background: colors.bg, border: `1.5px solid ${colors.border}` }}
          >
            {vault.emoji}
          </div>
          <p className={styles.passcodeModalTitle}>{vault.name}</p>
          <p className={styles.passcodeModalSub}>Enter vault passcode to unlock</p>
        </div>

        <div className={styles.passcodeModalBody}>
          <div className={styles.passcodeLabel}>Passcode</div>

          <div className={styles.passcodeDots}>
            {Array.from({ length: maxLen }).map((_, i) => (
              <div
                key={i}
                className={`${styles.passcodeDot} ${i < input.length ? styles.filled : ''}`}
              />
            ))}
          </div>

          {error && (
            <div className={styles.passcodeError}>
              🔒 Incorrect passcode. Try again.
            </div>
          )}

          <div className={styles.numpad}>
            {numKeys.map((k, i) => (
              k === '' ? (
                <div key={i} className={`${styles.numKey} ${styles.empty}`} />
              ) : k === '⌫' ? (
                <button key={i} className={`${styles.numKey} ${styles.delete}`} onClick={handleDelete}>⌫</button>
              ) : (
                <button key={i} className={styles.numKey} onClick={() => handleKey(k)}>{k}</button>
              )
            ))}
          </div>

          <div className={styles.passcodeActions}>
            <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Create Vault Modal ───────────────────────────────────────────────────────
function CreateVaultModal({ onClose, onCreate }) {
  const [name,     setName]     = useState('');
  const [type,     setType]     = useState('identity');
  const [passcode, setPasscode] = useState('');

  const handleSubmit = () => {
    if (!name.trim() || passcode.length < 4) return;
    onCreate({ name, type, passcode });
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.createModal} onClick={e => e.stopPropagation()}>
        <div className={styles.createModalHeader}>
          <p className={styles.createModalTitle}>Create New Vault</p>
          <p className={styles.createModalSub}>Set a passcode only you share with trusted members</p>
        </div>

        <div className={styles.createModalBody}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Vault Name</label>
            <input
              className={styles.formInput}
              placeholder="e.g. Family Wills, School Records..."
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Category</label>
            <div className={styles.typeGrid}>
              {TYPE_OPTIONS.map(opt => (
                <div
                  key={opt.type}
                  className={`${styles.typeOption} ${type === opt.type ? styles.selected : ''}`}
                  onClick={() => setType(opt.type)}
                >
                  <span className={styles.typeOptionEmoji}>{opt.emoji}</span>
                  <span className={styles.typeOptionLabel}>{opt.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Passcode (4 digits)</label>
            <input
              className={styles.formInput}
              type="password"
              inputMode="numeric"
              maxLength={4}
              placeholder="••••"
              value={passcode}
              onChange={e => setPasscode(e.target.value.replace(/\D/g, '').slice(0, 4))}
            />
            <span className={styles.passcodeHint}>
              Share this passcode outside the app with trusted family members.
            </span>
          </div>
        </div>

        <div className={styles.createModalFooter}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button
            className={styles.submitBtn}
            onClick={handleSubmit}
            disabled={!name.trim() || passcode.length < 4}
            style={{ opacity: (!name.trim() || passcode.length < 4) ? 0.5 : 1 }}
          >
            Create Vault 🔒
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Upload Modal ─────────────────────────────────────────────────────────────
function UploadModal({ vault, onClose }) {
  const [docName, setDocName] = useState('');

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.uploadModal} onClick={e => e.stopPropagation()}>
        <div className={styles.uploadModalHeader}>
          <p className={styles.uploadModalTitle}>Upload to {vault.name}</p>
          <p className={styles.uploadModalSub}>Supports PDF, images, and Word documents</p>
        </div>

        <div className={styles.uploadModalBody}>
          <div className={styles.dropZone}>
            <span className={styles.dropZoneIcon}>📂</span>
            <span className={styles.dropZoneText}>Click to browse or drag & drop</span>
            <span className={styles.dropZoneSub}>PDF, JPG, PNG, DOCX — max 10MB</span>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Document Name</label>
            <input
              className={styles.formInput}
              placeholder="e.g. Robert's Passport 2025"
              value={docName}
              onChange={e => setDocName(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.uploadModalFooter}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button
            className={styles.submitBtn}
            style={{ opacity: !docName.trim() ? 0.5 : 1 }}
          >
            Upload Document
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Vault Interior ───────────────────────────────────────────────────────────
function VaultInterior({ vault, onBack }) {
  const [showUpload, setShowUpload] = useState(false);
  const docs    = mockDocuments[vault.id] || [];
  const colors  = VAULT_TYPE_COLORS[vault.type];

  return (
    <div className={styles.interiorPage}>
      <button className={styles.backBtn} onClick={onBack}>
        ← Back to Vaults
      </button>

      {/* Interior header */}
      <div className={styles.interiorHeader}>
        <div className={styles.interiorHeaderLeft}>
          <div
            className={styles.interiorEmoji}
            style={{ background: colors.bg, border: `1.5px solid ${colors.border}` }}
          >
            {vault.emoji}
          </div>
          <div>
            <p className={styles.interiorTitle}>{vault.name}</p>
            <p className={styles.interiorMeta}>
              {docs.length} document{docs.length !== 1 ? 's' : ''} · Created by {vault.createdBy} · Updated {vault.lastUpdated}
            </p>
          </div>
        </div>
        <div className={styles.interiorActions}>
          <button className={styles.lockBtn} onClick={onBack}>🔒 Lock Vault</button>
          <button className={styles.uploadBtn} onClick={() => setShowUpload(true)}>
            ↑ Upload
          </button>
        </div>
      </div>

      {/* Document list */}
      <div className={styles.docList}>
        <div className={styles.docListHeader}>
          <span className={styles.docListHeaderCell}>Document</span>
          <span className={styles.docListHeaderCell}>Size</span>
          <span className={styles.docListHeaderCell}>Uploaded By</span>
          <span className={styles.docListHeaderCell}>Date</span>
        </div>

        {docs.length === 0 ? (
          <div className={styles.emptyState}>
            <span className={styles.emptyEmoji}>📭</span>
            <span className={styles.emptyText}>No documents yet. Upload the first one.</span>
          </div>
        ) : (
          docs.map(doc => (
            <div key={doc.id} className={styles.docItem}>
              <div className={styles.docItemName}>
                <div className={`${styles.docTypeIcon} ${styles[doc.type]}`}>
                  {DOC_ICONS[doc.type]}
                </div>
                <span className={styles.docName}>{doc.name}</span>
              </div>
              <span className={styles.docSize}>{doc.size}</span>
              <div className={styles.docUploader}>
                <div
                  className={styles.docUploaderAvatar}
                  style={{ background: `linear-gradient(135deg, ${doc.uploadedByColor}, ${doc.uploadedByColor}bb)` }}
                >
                  {doc.uploadedByInitials}
                </div>
                <span className={styles.docUploaderName}>{doc.uploadedBy.split(' ')[0]}</span>
              </div>
              <span className={styles.docDate}>{doc.date}</span>
              <div className={styles.docActions}>
                <button className={styles.docActionBtn} title="Download">⬇</button>
                <button className={`${styles.docActionBtn} ${styles.danger}`} title="Request deletion">🗑</button>
              </div>
            </div>
          ))
        )}
      </div>

      {showUpload && (
        <UploadModal vault={vault} onClose={() => setShowUpload(false)} />
      )}
    </div>
  );
}

// ─── Vault Home ───────────────────────────────────────────────────────────────
function VaultHome({ onOpenVault }) {
  const [showCreate, setShowCreate] = useState(false);
  const [vaults, setVaults]         = useState(mockVaultCategories);

  const handleCreate = (data) => {
    const newVault = {
      id: `v${Date.now()}`,
      name: data.name,
      type: data.type,
      emoji: TYPE_OPTIONS.find(t => t.type === data.type)?.emoji || '📁',
      createdBy: 'You',
      createdByInitials: 'YO',
      createdByColor: '#2D5A3D',
      docCount: 0,
      passcode: data.passcode,
      lastUpdated: 'Just now',
    };
    setVaults(v => [...v, newVault]);
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1>🔐 Document Vault</h1>
          <p>Secure storage for important family documents — each vault has its own passcode</p>
        </div>
        <div className={styles.headerRight}>
          <button className={styles.createBtn} onClick={() => setShowCreate(true)}>
            + New Vault
          </button>
        </div>
      </div>

      <div className={styles.vaultGrid}>
        {vaults.map(vault => {
          const colors = VAULT_TYPE_COLORS[vault.type];
          return (
            <div
              key={vault.id}
              className={styles.vaultCard}
              onClick={() => onOpenVault(vault)}
              style={{ '--accent': colors.text }}
            >
              {/* Top accent line */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                background: colors.text, opacity: 0.5, borderRadius: '16px 16px 0 0'
              }} />

              <div className={styles.vaultCardTop}>
                <div
                  className={styles.vaultEmoji}
                  style={{ background: colors.bg, border: `1.5px solid ${colors.border}` }}
                >
                  {vault.emoji}
                </div>
                <span className={styles.lockIcon}>🔒</span>
              </div>

              <p className={styles.vaultName}>{vault.name}</p>

              <div className={styles.vaultMeta}>
                <span className={styles.vaultDocCount}>
                  📄 {vault.docCount} documents
                </span>
                <span className={styles.vaultUpdated}>· {vault.lastUpdated}</span>
              </div>

              <div className={styles.vaultFooter}>
                <div className={styles.vaultCreator}>
                  <div
                    className={styles.creatorAvatar}
                    style={{ background: `linear-gradient(135deg, ${vault.createdByColor}, ${vault.createdByColor}bb)` }}
                  >
                    {vault.createdByInitials}
                  </div>
                  <span className={styles.creatorName}>{vault.createdBy}</span>
                </div>
                <span
                  className={styles.typeBadge}
                  style={{ background: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}
                >
                  {vault.type}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {showCreate && (
        <CreateVaultModal
          onClose={() => setShowCreate(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
}

// ─── Vault Page (root) ────────────────────────────────────────────────────────
export default function Vault() {
  const [pendingVault,  setPendingVault]  = useState(null); // vault waiting for passcode
  const [unlockedVault, setUnlockedVault] = useState(null); // vault currently open

  const handleVaultClick = (vault) => {
    setPendingVault(vault);
  };

  const handlePasscodeSuccess = () => {
    setUnlockedVault(pendingVault);
    setPendingVault(null);
  };

  const handleLock = () => {
    setUnlockedVault(null);
  };

  return (
    <AppShell>
      {unlockedVault ? (
        <VaultInterior vault={unlockedVault} onBack={handleLock} />
      ) : (
        <VaultHome onOpenVault={handleVaultClick} />
      )}

      {pendingVault && (
        <PasscodeModal
          vault={pendingVault}
          onSuccess={handlePasscodeSuccess}
          onClose={() => setPendingVault(null)}
        />
      )}
    </AppShell>
  );
}