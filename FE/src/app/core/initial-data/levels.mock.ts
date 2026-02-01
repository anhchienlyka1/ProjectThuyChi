// Mock levels data for Math and Vietnamese
import { MathLevel } from '../models/math-level.model';
import { VietnameseLevel } from '../models/vietnamese-level.model';

export const MOCK_MATH_LEVELS: MathLevel[] = [
  {
    id: 'addition',
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
    id: 'subtraction',
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
    id: 'comparison',
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
    id: 'mixed',
    levelNumber: 4,
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
    id: 'alphabet',
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
    id: 'simple-words',
    levelNumber: 2,
    title: 'Ghép Từ Đơn',
    subtitle: 'Bé tập ghép từ đơn giản',
    icon: '📖',
    color: '#FD79A8',
    gradient: 'linear-gradient(135deg, #FD79A8 0%, #FC5C8E 100%)',
    route: '/vietnamese/simple-words',
    isLocked: false,
    stars: 15
  },
  {
    id: 'fill-in-blank',
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
    id: 'spelling',
    levelNumber: 4,
    title: 'Ghép Vần',
    subtitle: 'Học ghép vần cơ bản',
    icon: '🎯',
    color: '#74B9FF',
    gradient: 'linear-gradient(135deg, #74B9FF 0%, #5EA1E0 100%)',
    route: '/vietnamese/spelling',
    isLocked: false,
    stars: 0
  },
  {
    id: 'sentence-builder',
    levelNumber: 5,
    title: 'Xếp Từ Thành Câu',
    subtitle: 'Bé tập xếp câu hoàn chỉnh',
    icon: '🧩',
    color: '#FF7675',
    gradient: 'linear-gradient(135deg, #FF7675 0%, #D63031 100%)',
    route: '/vietnamese/sentence-builder',
    isLocked: false,
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
