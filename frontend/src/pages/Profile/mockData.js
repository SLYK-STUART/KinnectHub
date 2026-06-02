// ─── Profile Mock Data ────────────────────────────────────────────────────────

export const mockProfile = {
  id: '1',
  name: 'Tayebwa Osbert',
  initials: 'TO',
  color: '#2D5A3D',
  role: 'Father',
  isAdmin: true,
  isDeceased: false,
  bio: 'Head of the Tayebwa family. Proud husband, father of three, and grandfather. Passionate about keeping the family connected across distances.',

  // Personal details
  dob: '1965-03-14',
  dobDisplay: 'March 14, 1965',
  age: 60,
  bloodType: 'O+',
  nin: 'CM90200012345A',
  gender: 'Male',
  location: 'Kampala, Uganda',
  occupation: 'Civil Engineer',
  employer: 'National Water & Sewerage Corporation',

  // Contact
  phone: '+256 700 123 456',
  alternatePhone: '+256 712 987 654',
  email: 'osbert.tayebwa@gmail.com',
  whatsapp: '+256 700 123 456',

  // Medical
  medicalConditions: ['Hypertension', 'Type 2 Diabetes'],
  allergies: ['Penicillin'],
  doctorName: 'Dr. Kirunda Moses',
  doctorPhone: '+256 701 555 000',
  hospitalPreference: 'Mulago National Referral Hospital',

  // Emergency contacts
  emergencyContacts: [
    { id: 'ec1', name: 'Kyogabirwe Enid', relation: 'Wife',   phone: '+256 701 234 567', initials: 'KE', color: '#5A3D6E' },
    { id: 'ec2', name: 'Tayebwa Stuart',  relation: 'Son',    phone: '+256 702 345 678', initials: 'TS', color: '#3D5A8A' },
  ],

  // Family connections
  familyLinks: [
    { id: '2', name: 'Kyogabirwe Enid',    relation: 'Wife',        initials: 'KE', color: '#5A3D6E', isDeceased: false },
    { id: '3', name: 'Tayebwa Stuart',     relation: '1st Born',    initials: 'TS', color: '#3D5A8A', isDeceased: false },
    { id: '4', name: 'Turyaguma Osbert',   relation: '2nd Born',    initials: 'TO', color: '#8A5A3D', isDeceased: false },
    { id: '5', name: 'Tumusiime Emmanuel', relation: '3rd Born',    initials: 'TE', color: '#3D7A6E', isDeceased: false },
    { id: '6', name: 'James Nakimera',     relation: 'Father',      initials: 'JN', color: '#6E3D3D', isDeceased: false },
    { id: '7', name: 'Ruth Nakimera',      relation: 'Mother',      initials: 'RN', color: '#6E5A3D', isDeceased: true  },
  ],

  // Vault documents (summary)
  vaultSummary: [
    { id: 'v1', label: 'National ID',       emoji: '🪪', status: 'uploaded' },
    { id: 'v2', label: 'Passport',          emoji: '📘', status: 'uploaded' },
    { id: 'v3', label: 'Land Title',        emoji: '🏡', status: 'uploaded' },
    { id: 'v4', label: 'Will & Testament',  emoji: '📜', status: 'missing'  },
  ],

  // Recent activity
  recentActivity: [
    { id: 'a1', icon: '📣', text: 'Posted announcement: "Family Reunion — July 12th"',   time: '2 hours ago'  },
    { id: 'a2', icon: '🔑', text: 'Reset password for Tumusiime Emmanuel',                 time: '10 mins ago'  },
    { id: 'a3', icon: '📸', text: 'Uploaded 3 photos to Memory Book',                     time: 'Yesterday'    },
    { id: 'a4', icon: '👤', text: 'Added Christine Opio to the family',                   time: '2 days ago'   },
    { id: 'a5', icon: '🙏', text: 'Posted on the Prayer Wall',                            time: '3 days ago'   },
  ],

  joinedAt: 'January 2024',
  lastSeen: 'Just now',
};