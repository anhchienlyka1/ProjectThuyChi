import { SubjectCard } from '../models/subject.model';

export const MOCK_SUBJECTS: SubjectCard[] = [
  {
    id: 'math',
    title: 'Toán Học',
    icon: '🧮',
    color: '#3b82f6',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 50%, #38bdf8 100%)',
    route: '/math'
  },
  {
    id: 'vietnamese',
    title: 'Tiếng Việt',
    icon: '📚',
    color: '#ec4899',
    gradient: 'linear-gradient(135deg, #ec4899 0%, #f472b6 50%, #fbcfe8 100%)',
    route: '/vietnamese'
  },
  {
    id: 'games',
    title: 'Trò Chơi',
    icon: '🎮',
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 50%, #c4b5fd 100%)',
    route: '/games'
  }
];

export function getMockSubjects(): SubjectCard[] {
  return MOCK_SUBJECTS;
}
