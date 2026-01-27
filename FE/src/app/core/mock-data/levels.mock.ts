// Mock levels data for Math and Vietnamese
import { MathLevel } from '../models/math-level.model';
import { VietnameseLevel } from '../models/vietnamese-level.model';

export const MOCK_MATH_LEVELS: MathLevel[] = [
  {
    id: 'math-1',
    levelNumber: 1,
    title: 'Cộng Cơ Bản',
    subtitle: 'Phép cộng các số nhỏ',
    icon: '➕',
    color: '#4ECDC4',
    gradient: 'linear-gradient(135deg, #4ECDC4 0%, #44A1A0 100%)',
    route: '/math/addition',
    isLocked: false,
    stars: 9
  },
  {
    id: 'math-2',
    levelNumber: 2,
    title: 'Trừ Cơ Bản',
    subtitle: 'Phép trừ các số nhỏ',
    icon: '➖',
    color: '#45B7D1',
    gradient: 'linear-gradient(135deg, #45B7D1 0%, #3A9FC1 100%)',
    route: '/math/subtraction',
    isLocked: false,
    stars: 0
  },
  {
    id: 'math-3',
    levelNumber: 3,
    title: 'So Sánh',
    subtitle: 'So sánh lớn bé',
    icon: '⚖️',
    color: '#96CEB4',
    gradient: 'linear-gradient(135deg, #96CEB4 0%, #77B89C 100%)',
    route: '/math/comparison',
    isLocked: false,
    stars: 0
  },
  {
    id: 'math-4',
    levelNumber: 4,
    title: 'Hình Học',
    subtitle: 'Nhận biết các hình cơ bản',
    icon: '🔷',
    color: '#FFEAA7',
    gradient: 'linear-gradient(135deg, #FFEAA7 0%, #FDCB6E 100%)',
    route: '/math/geometry',
    isLocked: false,
    stars: 0
  },
  {
    id: 'math-5',
    levelNumber: 5,
    title: 'Toán Tổng Hợp',
    subtitle: 'Ôn tập tất cả các phép tính',
    icon: '🎓',
    color: '#6c5ce7',
    gradient: 'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)',
    route: '/math/mixed',
    isLocked: false,
    stars: 0
  }
];

export const MOCK_VIETNAMESE_LEVELS: VietnameseLevel[] = [
  {
    id: 'viet-1',
    levelNumber: 1,
    title: 'Bảng Chữ Cái',
    subtitle: 'Học các chữ cái tiếng Việt',
    icon: '🔤',
    color: '#A29BFE',
    gradient: 'linear-gradient(135deg, #A29BFE 0%, #8B82F8 100%)',
    route: '/vietnamese/alphabet',
    isLocked: false,
    stars: 30
  },
  {
    id: 'viet-2',
    levelNumber: 2,
    title: 'Từ Đơn',
    subtitle: 'Học đọc từ đơn giản',
    icon: '📖',
    color: '#FD79A8',
    gradient: 'linear-gradient(135deg, #FD79A8 0%, #FC5C8E 100%)',
    route: '/vietnamese/simple-words',
    isLocked: false,
    stars: 15
  },
  {
    id: 'viet-3',
    levelNumber: 3,
    title: 'Điền Chữ',
    subtitle: 'Điền chữ cái vào chỗ trống',
    icon: '✏️',
    color: '#FDCB6E',
    gradient: 'linear-gradient(135deg, #FDCB6E 0%, #E1A850 100%)',
    route: '/vietnamese/fill-in-blank',
    isLocked: false,
    stars: 0
  },
  {
    id: 'viet-4',
    levelNumber: 4,
    title: 'Ghép Vần',
    subtitle: 'Học ghép vần cơ bản',
    icon: '🎯',
    color: '#74B9FF',
    gradient: 'linear-gradient(135deg, #74B9FF 0%, #5EA1E0 100%)',
    route: '/vietnamese/spelling',
    isLocked: true,
    stars: 0
  }
];

export function getLevelsBySubject(subjectId: string, userId?: string): (MathLevel | VietnameseLevel)[] {
  if (subjectId === 'math') {
    return MOCK_MATH_LEVELS;
  } else if (subjectId === 'vietnamese') {
    return MOCK_VIETNAMESE_LEVELS;
  }
  return [];
}

export function getLevelById(levelId: string): MathLevel | VietnameseLevel | undefined {
  const allLevels = [...MOCK_MATH_LEVELS, ...MOCK_VIETNAMESE_LEVELS];
  return allLevels.find(level => level.id === levelId);
}
