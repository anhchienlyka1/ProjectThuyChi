// Mock achievements data
export interface MockAchievement {
    id: number;
    achievementId: string;
    title: string;
    description: string;
    icon: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    earnedAt: Date;
    earnedContext?: any;
    points: number;
}

export const MOCK_ACHIEVEMENTS: MockAchievement[] = [
    {
        id: 1,
        achievementId: 'first-lesson',
        title: 'Bài Học Đầu Tiên',
        description: 'Hoàn thành bài học đầu tiên',
        icon: '🎯',
        rarity: 'common',
        earnedAt: new Date('2026-01-20'),
        points: 10
    },
    {
        id: 2,
        achievementId: 'math-master-1',
        title: 'Cao Thủ Toán Học',
        description: 'Hoàn thành cấp độ 1 môn Toán',
        icon: '🧮',
        rarity: 'rare',
        earnedAt: new Date('2026-01-21'),
        earnedContext: { levelId: 'math-1', score: 100 },
        points: 25
    },
    {
        id: 3,
        achievementId: 'perfect-score',
        title: 'Điểm Tuyệt Đối',
        description: 'Đạt 100% trong một bài học',
        icon: '⭐',
        rarity: 'epic',
        earnedAt: new Date('2026-01-22'),
        points: 50
    },
    {
        id: 4,
        achievementId: 'speed-demon',
        title: 'Tốc Độ Ánh Sáng',
        description: 'Hoàn thành bài học trong 2 phút',
        icon: '⚡',
        rarity: 'rare',
        earnedAt: new Date('2026-01-23'),
        points: 30
    },
    {
        id: 5,
        achievementId: 'phieu-be-ngoan',
        title: 'Phiếu Bé Ngoan',
        description: 'Cải thiện thành tích',
        icon: '🏆',
        rarity: 'legendary',
        earnedAt: new Date('2026-01-25'),
        earnedContext: {
            levelId: 'math-2',
            improvement: {
                previousScore: 80,
                newScore: 95
            }
        },
        points: 100
    }
];

export interface WeeklyAchievement {
    id: number;
    title: string;
    description: string;
    icon: string;
    earnedAt: Date;
    weekNumber: number;
}

export const MOCK_WEEKLY_ACHIEVEMENTS: WeeklyAchievement[] = [
    {
        id: 1,
        title: 'Tuần Thứ Nhất',
        description: 'Hoàn thành 5 bài học trong tuần',
        icon: '📅',
        earnedAt: new Date('2026-01-19'),
        weekNumber: 1
    },
    {
        id: 2,
        title: 'Tuần Đầy Năng Lượng',
        description: 'Hoàn thành 10 bài học trong tuần',
        icon: '🔥',
        earnedAt: new Date('2026-01-26'),
        weekNumber: 2
    }
];

export function getAchievementsByUserId(userId: string, page: number = 1, limit: number = 10) {
    const start = (page - 1) * limit;
    const end = start + limit;
    const data = MOCK_ACHIEVEMENTS.slice(start, end);

    return {
        data,
        meta: {
            page,
            limit,
            total: MOCK_ACHIEVEMENTS.length,
            totalPages: Math.ceil(MOCK_ACHIEVEMENTS.length / limit)
        }
    };
}

export function getWeeklyAchievementsByUserId(userId: string): WeeklyAchievement[] {
    return MOCK_WEEKLY_ACHIEVEMENTS;
}

// Generate random achievement for good performance
export function generateImprovementAchievement(): MockAchievement | null {
    // 70% chance to get improvement achievement
    if (Math.random() > 0.3) {
        return {
            id: Date.now(),
            achievementId: 'phieu-be-ngoan-' + Date.now(),
            title: 'Phiếu Bé Ngoan',
            description: 'Cải thiện thành tích xuất sắc!',
            icon: '🏆',
            rarity: 'legendary',
            earnedAt: new Date(),
            points: 100
        };
    }
    return null;
}
