// Mock users data
export interface MockUser {
  id: string;
  username: string;
  fullName: string;
  email?: string;
  role: 'student' | 'parent';
  avatarUrl?: string;
  pinCode: string;
  gender?: string;
  level: number;
  totalStars: number;
  xp: number;
}

export const MOCK_USERS: MockUser[] = [
  {
    id: '1',
    username: 'bé minh',
    fullName: 'Nguyễn Văn Minh',
    email: 'minh@example.com',
    role: 'student',
    avatarUrl: 'assets/avatars/boy1.svg',
    pinCode: '123456',
    gender: 'nam',
    level: 5,
    totalStars: 150,
    xp: 2500
  },
  {
    id: '2',
    username: 'thuychi2020',
    fullName: 'Phạm Thùy Chi',
    email: 'hoa@example.com',
    role: 'student',
    avatarUrl: 'assets/avatars/girl1.svg',
    pinCode: '111111',
    gender: 'nữ',
    level: 3,
    totalStars: 85,
    xp: 1200
  },
  {
    id: '3',
    username: 'bé nam',
    fullName: 'Lê Văn Nam',
    email: 'nam@example.com',
    role: 'student',
    avatarUrl: 'assets/avatars/boy2.svg',
    pinCode: '222222',
    gender: 'nam',
    level: 7,
    totalStars: 280,
    xp: 4200
  }
];

// Helper function to find user by username and pin
export function findUserByCredentials(username: string, pinCode: string): MockUser | undefined {
  // If username is provided, check both
  if (username && username.trim() !== '') {
    return MOCK_USERS.find(
      user => user.username.toLowerCase() === username.toLowerCase() &&
        user.pinCode === pinCode
    );
  }

  // If only PIN provided, find by PIN
  return MOCK_USERS.find(user => user.pinCode === pinCode);
}

// Helper function to get user by ID
export function getUserById(id: string): MockUser | undefined {
  return MOCK_USERS.find(user => user.id === id);
}
