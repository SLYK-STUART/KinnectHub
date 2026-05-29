// ─── Members ──────────────────────────────────────────────────────────────────
export const mockMembers = [
  { id: 'u1', name: 'Robert Nakimera',  email: 'robert@family.kh',   role: 'Father',      initials: 'RN', color: '#2D5A3D', isAdmin: true,  isActive: true,  joinedAt: 'Jan 5, 2025',  lastSeen: 'Just now'    },
  { id: 'u2', name: 'Grace Nakimera',   email: 'grace@family.kh',    role: 'Mother',      initials: 'GN', color: '#5A3D6E', isAdmin: false, isActive: true,  joinedAt: 'Jan 5, 2025',  lastSeen: '2 hrs ago'   },
  { id: 'u3', name: 'David Nakimera',   email: 'david@family.kh',    role: '1st Born',    initials: 'DN', color: '#3D5A8A', isAdmin: false, isActive: true,  joinedAt: 'Jan 6, 2025',  lastSeen: 'Yesterday'   },
  { id: 'u4', name: 'Sarah Nakimera',   email: 'sarah@family.kh',    role: '2nd Born',    initials: 'SN', color: '#8A5A3D', isAdmin: false, isActive: true,  joinedAt: 'Jan 6, 2025',  lastSeen: '3 days ago'  },
  { id: 'u5', name: 'Paul Nakimera',    email: 'paul@family.kh',     role: '3rd Born',    initials: 'PN', color: '#3D7A6E', isAdmin: false, isActive: true,  joinedAt: 'Jan 7, 2025',  lastSeen: '1 week ago'  },
  { id: 'u6', name: 'James Nakimera',   email: 'james@family.kh',    role: 'Grandfather', initials: 'JN', color: '#6E3D3D', isAdmin: false, isActive: true,  joinedAt: 'Feb 1, 2025',  lastSeen: '2 weeks ago' },
  { id: 'u7', name: 'Christine Opio',   email: 'christine@family.kh',role: 'Aunt',        initials: 'CO', color: '#3D6E5A', isAdmin: false, isActive: true,  joinedAt: 'Feb 14, 2025', lastSeen: '5 days ago'  },
  { id: 'u8', name: 'Peter Nakimera',   email: 'peter@family.kh',    role: 'Uncle',       initials: 'PN', color: '#6E5A3D', isAdmin: false, isActive: false, joinedAt: 'Mar 1, 2025',  lastSeen: '1 month ago' },
];

// ─── Deletion Requests ────────────────────────────────────────────────────────
export const mockDeletionRequests = [
  {
    id: 'dr1',
    mediaType: 'photo',
    mediaName: 'Christmas_2024_018.jpg',
    mediaEmoji: '🖼️',
    requestedBy: 'Sarah Nakimera',
    requestedByInitials: 'SN',
    requestedByColor: '#8A5A3D',
    reason: 'Poor quality photo, blurry',
    requestedAt: '2 hours ago',
    status: 'pending',
  },
  {
    id: 'dr2',
    mediaType: 'video',
    mediaName: 'FamilyTrip_Day2.mp4',
    mediaEmoji: '🎬',
    requestedBy: 'David Nakimera',
    requestedByInitials: 'DN',
    requestedByColor: '#3D5A8A',
    reason: 'Contains personal conversation, prefer it removed',
    requestedAt: '1 day ago',
    status: 'pending',
  },
  {
    id: 'dr3',
    mediaType: 'photo',
    mediaName: 'Graduation_Selfie.jpg',
    mediaEmoji: '🖼️',
    requestedBy: 'Paul Nakimera',
    requestedByInitials: 'PN',
    requestedByColor: '#3D7A6E',
    reason: null,
    requestedAt: '3 days ago',
    status: 'pending',
  },
  {
    id: 'dr4',
    mediaType: 'photo',
    mediaName: 'Birthday_Party_2024.jpg',
    mediaEmoji: '🖼️',
    requestedBy: 'Grace Nakimera',
    requestedByInitials: 'GN',
    requestedByColor: '#5A3D6E',
    reason: 'Duplicate photo already in album',
    requestedAt: '5 days ago',
    status: 'approved',
  },
  {
    id: 'dr5',
    mediaType: 'video',
    mediaName: 'New_Year_Eve.mp4',
    mediaEmoji: '🎬',
    requestedBy: 'Christine Opio',
    requestedByInitials: 'CO',
    requestedByColor: '#3D6E5A',
    reason: 'Wrong event folder',
    requestedAt: '1 week ago',
    status: 'rejected',
  },
];

// ─── Vault Categories ─────────────────────────────────────────────────────────
export const mockAdminVaults = [
  { id: 'v1', name: 'Identity Documents', type: 'identity', emoji: '🪪', createdBy: 'Robert Nakimera', createdByInitials: 'RN', createdByColor: '#2D5A3D', docCount: 6,  createdAt: 'Jan 12, 2025' },
  { id: 'v2', name: 'Legal & Property',   type: 'legal',    emoji: '⚖️', createdBy: 'Robert Nakimera', createdByInitials: 'RN', createdByColor: '#2D5A3D', docCount: 4,  createdAt: 'Jan 12, 2025' },
  { id: 'v3', name: 'Medical Records',    type: 'medical',  emoji: '🏥', createdBy: 'Grace Nakimera',  createdByInitials: 'GN', createdByColor: '#5A3D6E', docCount: 9,  createdAt: 'Feb 3, 2025'  },
  { id: 'v4', name: 'Academic Certs',     type: 'academic', emoji: '🎓', createdBy: 'David Nakimera',  createdByInitials: 'DN', createdByColor: '#3D5A8A', docCount: 12, createdAt: 'Feb 20, 2025' },
  { id: 'v5', name: 'Other Documents',    type: 'other',    emoji: '📁', createdBy: 'Sarah Nakimera',  createdByInitials: 'SN', createdByColor: '#8A5A3D', docCount: 3,  createdAt: 'Mar 5, 2025'  },
];

// ─── All Announcements ────────────────────────────────────────────────────────
export const mockAllAnnouncements = [
  { id: 'a1', author: 'Grace Nakimera',   authorInitials: 'GN', authorColor: '#5A3D6E', title: 'Family Reunion — July 12th',              isUrgent: false, audience: 'All Members', replies: 4,  postedAt: '2 hours ago',  status: 'active' },
  { id: 'a2', author: 'Robert Nakimera',  authorInitials: 'RN', authorColor: '#2D5A3D', title: 'Important: Update your emergency contacts', isUrgent: true,  audience: 'All Members', replies: 2,  postedAt: 'Yesterday',    status: 'active' },
  { id: 'a3', author: 'David Nakimera',   authorInitials: 'DN', authorColor: '#3D5A8A', title: 'New photos added to memory book',           isUrgent: false, audience: 'All Members', replies: 7,  postedAt: '3 days ago',   status: 'active' },
  { id: 'a4', author: 'Sarah Nakimera',   authorInitials: 'SN', authorColor: '#8A5A3D', title: 'Gulu trip update',                          isUrgent: false, audience: 'Selected (3)',replies: 1,  postedAt: '5 days ago',   status: 'active' },
  { id: 'a5', author: 'Christine Opio',   authorInitials: 'CO', authorColor: '#3D6E5A', title: 'Safe arrival in Kampala',                   isUrgent: false, audience: 'All Members', replies: 5,  postedAt: '1 week ago',   status: 'active' },
  { id: 'a6', author: 'Paul Nakimera',    authorInitials: 'PN', authorColor: '#3D7A6E', title: 'School fee reminder',                       isUrgent: true,  audience: 'All Members', replies: 0,  postedAt: '2 weeks ago',  status: 'deleted' },
];

// ─── Activity Log ─────────────────────────────────────────────────────────────
export const mockActivityLog = [
  { id: 'ac1',  type: 'member_join',      icon: '👤', color: '#2D5A3D', message: 'Christine Opio joined KinnectHub',                        time: 'Feb 14, 2025 — 10:32 AM' },
  { id: 'ac2',  type: 'sos',             icon: '🆘', color: '#C0392B', message: 'Sarah Nakimera triggered an SOS alert',                   time: 'Mar 3, 2025 — 6:42 PM'  },
  { id: 'ac3',  type: 'vault_created',   icon: '🔐', color: '#3D5A8A', message: 'David Nakimera created vault "Academic Certs"',           time: 'Feb 20, 2025 — 2:15 PM' },
  { id: 'ac4',  type: 'media_upload',    icon: '📸', color: '#5A3D6E', message: 'Grace Nakimera uploaded 12 photos to Memory Book',        time: 'Mar 10, 2025 — 9:00 AM' },
  { id: 'ac5',  type: 'deletion_req',    icon: '🗑', color: '#8A5A3D', message: 'Sarah Nakimera requested deletion of Christmas_2024_018', time: 'Apr 2, 2025 — 4:20 PM'  },
  { id: 'ac6',  type: 'announcement',    icon: '📣', color: '#C9A84C', message: 'Robert Nakimera posted urgent announcement',              time: 'Apr 5, 2025 — 8:00 AM'  },
  { id: 'ac7',  type: 'password_reset',  icon: '🔑', color: '#6E3D3D', message: 'Admin reset password for Paul Nakimera',                  time: 'Apr 8, 2025 — 11:05 AM' },
  { id: 'ac8',  type: 'member_deactivate',icon:'🚫', color: '#C0392B', message: 'Admin deactivated account: Peter Nakimera',              time: 'Apr 10, 2025 — 3:30 PM' },
  { id: 'ac9',  type: 'vault_override',  icon: '🔓', color: '#3D7A6E', message: 'Admin overrode passcode for "Medical Records" vault',     time: 'Apr 12, 2025 — 1:00 PM' },
  { id: 'ac10', type: 'media_upload',    icon: '📸', color: '#5A3D6E', message: 'David Nakimera uploaded graduation video',                time: 'Apr 15, 2025 — 5:45 PM' },
  { id: 'ac11', type: 'announcement',    icon: '📣', color: '#C9A84C', message: 'Grace Nakimera posted Family Reunion announcement',       time: 'May 1, 2025 — 10:00 AM' },
  { id: 'ac12', type: 'sos',             icon: '🆘', color: '#C0392B', message: 'Paul Nakimera triggered an SOS alert',                    time: 'May 5, 2025 — 2:10 PM'  },
  { id: 'ac13', type: 'member_join',     icon: '👤', color: '#2D5A3D', message: 'Peter Nakimera joined KinnectHub',                        time: 'Mar 1, 2025 — 9:00 AM'  },
  { id: 'ac14', type: 'deletion_approve',icon: '✅', color: '#27AE60', message: 'Admin approved deletion of Birthday_Party_2024.jpg',      time: 'May 8, 2025 — 4:00 PM'  },
  { id: 'ac15', type: 'vault_created',   icon: '🔐', color: '#3D5A8A', message: 'Sarah Nakimera created vault "Other Documents"',          time: 'Mar 5, 2025 — 12:30 PM' },
];

export const VAULT_TYPE_COLORS = {
  identity: { bg: 'rgba(61,90,138,0.08)',  text: '#3D5A8A' },
  legal:    { bg: 'rgba(45,90,61,0.08)',   text: '#2D5A3D' },
  medical:  { bg: 'rgba(192,57,43,0.07)', text: '#C0392B' },
  academic: { bg: 'rgba(201,168,76,0.10)',text: '#A07C20' },
  other:    { bg: 'rgba(90,87,80,0.07)',  text: '#5A5750' },
};