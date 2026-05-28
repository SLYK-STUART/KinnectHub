// ─── Calendar Mock Data ─────────────────────────────────────────────────────

export const calendarEvents = [
  {
    id: 'e1',
    title: 'Family Prayer Gathering',
    type: 'prayer',
    date: '2026-06-03',
    time: '6:00 PM',
    location: 'Main Family Home',
    description:
      'Monthly family prayer evening with worship, testimonies, and dinner.',
    host: 'Kyogabirwe Enid',
    attendees: 18,
    color: '#2D5A3D',
    icon: '🙏',
  },

  {
    id: 'e2',
    title: 'Grandmother Memorial',
    type: 'memorial',
    date: '2026-06-08',
    time: '2:00 PM',
    location: 'Family Gardens',
    description:
      'A remembrance gathering in honor of Ruth Nakimera.',
    host: 'Tayebwa Osbert',
    attendees: 42,
    color: '#6E5A3D',
    icon: '🕊️',
  },

  {
    id: 'e3',
    title: 'Birthday Celebration',
    type: 'birthday',
    date: '2026-06-11',
    time: '1:00 PM',
    location: 'Stuart’s Residence',
    description:
      'Birthday lunch and family games.',
    host: 'Tayebwa Stuart',
    attendees: 15,
    color: '#8A5A3D',
    icon: '🎂',
  },

  {
    id: 'e4',
    title: 'Thanksgiving Service',
    type: 'gratitude',
    date: '2026-06-15',
    time: '10:00 AM',
    location: 'Church Hall',
    description:
      'Special thanksgiving service for blessings received this year.',
    host: 'Tumusiime Emmanuel',
    attendees: 30,
    color: '#C9A84C',
    icon: '✨',
  },

  {
    id: 'e5',
    title: 'Family Council Meeting',
    type: 'meeting',
    date: '2026-06-19',
    time: '5:30 PM',
    location: 'Zoom',
    description:
      'Discussion about land matters and annual planning.',
    host: 'Turyaguma Osbert',
    attendees: 12,
    color: '#3D5A8A',
    icon: '📋',
  },

  {
    id: 'e6',
    title: 'Wedding Anniversary Dinner',
    type: 'celebration',
    date: '2026-06-24',
    time: '7:00 PM',
    location: 'Kampala Serena',
    description:
      'Celebrating 35 years of marriage.',
    host: 'Tayebwa Osbert',
    attendees: 20,
    color: '#5A3D6E',
    icon: '💍',
  },

  {
    id: 'e7',
    title: 'Community Outreach',
    type: 'charity',
    date: '2026-06-28',
    time: '9:00 AM',
    location: 'Mbarara',
    description:
      'Family charity outreach and donations to local children.',
    host: 'Christine Opio',
    attendees: 25,
    color: '#3D7A6E',
    icon: '🤝',
  },
];

export const calendarStats = {
  totalEvents: 7,
  upcomingEvents: 5,
  birthdays: 1,
  prayerEvents: 2,
};

export const eventCategories = [
  {
    label: 'Prayer',
    color: '#2D5A3D',
    icon: '🙏',
  },
  {
    label: 'Birthday',
    color: '#8A5A3D',
    icon: '🎂',
  },
  {
    label: 'Meeting',
    color: '#3D5A8A',
    icon: '📋',
  },
  {
    label: 'Gratitude',
    color: '#C9A84C',
    icon: '✨',
  },
  {
    label: 'Celebration',
    color: '#5A3D6E',
    icon: '💍',
  },
];