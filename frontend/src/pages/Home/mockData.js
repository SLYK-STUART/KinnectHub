export const mockFamilyMembers = [
  { id: '1', name: 'Tayebwa Osbert',   role: 'Father',      initials: 'TO', color: '#2D5A3D', isDeceased: false, isAdmin: true },
  { id: '2', name: 'Kyogabirwe Enid',    role: 'Mother',      initials: 'KE', color: '#5A3D6E', isDeceased: false, isAdmin: false },
  { id: '3', name: 'Tayebwa Stuart',    role: '1st Born',    initials: 'TS', color: '#3D5A8A', isDeceased: false, isAdmin: false },
  { id: '4', name: 'Turyaguma Osbert',    role: '2nd Born',    initials: 'TO', color: '#8A5A3D', isDeceased: false, isAdmin: false },
  { id: '5', name: 'Tumusiime Emmanuel',     role: '3rd Born',    initials: 'TE', color: '#3D7A6E', isDeceased: false, isAdmin: false },
  { id: '6', name: 'James Nakimera',    role: 'Grandfather', initials: 'JN', color: '#6E3D3D', isDeceased: false, isAdmin: false },
  { id: '7', name: 'Ruth Nakimera',     role: 'Grandmother', initials: 'RN', color: '#6E5A3D', isDeceased: true,  isAdmin: false },
  { id: '8', name: 'Christine Opio',    role: 'Aunt',        initials: 'CO', color: '#3D6E5A', isDeceased: false, isAdmin: false },
];

// Relationships: parent_child or spouse
export const mockRelationships = [
  { from: '6', to: '7', type: 'spouse' },
  { from: '6', to: '1', type: 'parent_child' },
  { from: '1', to: '2', type: 'spouse' },
  { from: '1', to: '3', type: 'parent_child' },
  { from: '1', to: '4', type: 'parent_child' },
  { from: '1', to: '5', type: 'parent_child' },
  { from: '6', to: '8', type: 'parent_child' },
];

export const mockAnnouncements = [
  {
    id: 'a1',
    author: 'Grace Nakimera',
    authorInitials: 'GN',
    authorColor: '#5A3D6E',
    title: 'Family Reunion — July 12th',
    preview: 'We are planning a family gathering at the home in Kampala. Please confirm your attendance by end of this week.',
    isUrgent: false,
    time: '2 hours ago',
    replies: 4,
  },
  {
    id: 'a2',
    author: 'Robert Nakimera',
    authorInitials: 'RN',
    authorColor: '#2D5A3D',
    title: 'Important: Update your emergency contacts',
    preview: 'Please make sure your profiles have current phone numbers and medical details updated before next week.',
    isUrgent: true,
    time: 'Yesterday',
    replies: 2,
  },
  {
    id: 'a3',
    author: 'David Nakimera',
    authorInitials: 'DN',
    authorColor: '#3D5A8A',
    title: 'New photos added to memory book',
    preview: 'Added pictures from last month\'s graduation ceremony. Check the Memory Book under Events.',
    isUrgent: false,
    time: '3 days ago',
    replies: 7,
  },
];

export const mockUpcomingEvents = [
  { id: 'e1', title: 'Family Reunion',       date: 'Jul 12', day: 'Saturday', type: 'event',    color: '#2D5A3D' },
  { id: 'e2', title: "Grace's Birthday",     date: 'Jun 3',  day: 'Tuesday',  type: 'birthday', color: '#8A5A3D' },
  { id: 'e3', title: 'School Closing Day',   date: 'Jun 14', day: 'Saturday', type: 'event',    color: '#3D5A8A' },
  { id: 'e4', title: "David's Anniversary",  date: 'Jun 22', day: 'Sunday',   type: 'birthday', color: '#5A3D6E' },
];

export const mockMemories = [
  { id: 'm1', label: 'Graduation 2024',  emoji: '🎓', count: 24 },
  { id: 'm2', label: 'Christmas 2024',   emoji: '🎄', count: 18 },
  { id: 'm3', label: 'Family Trip',      emoji: '✈️', count: 41 },
];

export const mockWallPosts = [
  {
    id: 'w1',
    author: 'Sarah Nakimera',
    authorInitials: 'SN',
    authorColor: '#8A5A3D',
    body: 'Grateful for this family every single day. 🙏',
    reactions: 5,
    time: '1 hour ago',
  },
  {
    id: 'w2',
    author: 'Christine Opio',
    authorInitials: 'CO',
    authorColor: '#3D6E5A',
    body: 'Please pray for safe travels as I head back to Gulu tomorrow.',
    reactions: 8,
    time: '5 hours ago',
  },
];