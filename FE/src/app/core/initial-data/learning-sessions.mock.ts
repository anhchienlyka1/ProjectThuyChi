// Mock learning sessions and completion tracking
export interface MockLearningSession {
    sessionId: number;
    userId: string;
    levelId: string;
    levelName: string;
    score: number;
    totalQuestions: number;
    durationSeconds: number;
    accuracyPercentage: number;
    stars: number;
    completedAt: Date;
}

// Store learning sessions in memory
export let MOCK_LEARNING_SESSIONS: MockLearningSession[] = [
    {
        sessionId: 1,
        userId: '1',
        levelId: 'addition',
        levelName: 'Đếm Số',
        score: 10,
        totalQuestions: 10,
        durationSeconds: 180,
        accuracyPercentage: 100,
        stars: 3,
        completedAt: new Date('2026-01-20T10:30:00')
    },
    {
        sessionId: 2,
        userId: '1',
        levelId: 'subtraction',
        levelName: 'Cộng Cơ Bản',
        score: 8,
        totalQuestions: 10,
        durationSeconds: 240,
        accuracyPercentage: 80,
        stars: 2,
        completedAt: new Date('2026-01-21T14:15:00')
    },
    {
        sessionId: 3,
        userId: '1',
        levelId: 'subtraction',
        levelName: 'Cộng Cơ Bản',
        score: 10,
        totalQuestions: 10,
        durationSeconds: 150,
        accuracyPercentage: 100,
        stars: 3,
        completedAt: new Date('2026-01-22T09:45:00')
    }
];

// Calculate stars based on accuracy
export function calculateStars(accuracy: number): number {
    if (accuracy >= 90) return 3;
    if (accuracy >= 70) return 2;
    if (accuracy >= 50) return 1;
    return 0;
}

// Save a new learning session
export function saveLearningSession(
    userId: string,
    levelId: string,
    score: number,
    totalQuestions: number,
    durationSeconds: number
): {
    success: boolean;
    starsEarned: number;
    newHighScore: boolean;
    accuracy: number;
    sessionId: number;
    completed: boolean;
    achievement?: any;
    improvementAchievement?: any;
} {
    const accuracy = Math.round((score / totalQuestions) * 100);
    const stars = calculateStars(accuracy);

    // Check for previous sessions on this level
    const previousSessions = MOCK_LEARNING_SESSIONS.filter(
        s => s.userId === userId && s.levelId === levelId
    );

    const newHighScore = previousSessions.length === 0 ||
        previousSessions.every(s => s.score < score);

    // Create new session
    const newSession: MockLearningSession = {
        sessionId: MOCK_LEARNING_SESSIONS.length + 1,
        userId,
        levelId,
        levelName: 'Level', // This would be looked up from levels
        score,
        totalQuestions,
        durationSeconds,
        accuracyPercentage: accuracy,
        stars,
        completedAt: new Date()
    };

    MOCK_LEARNING_SESSIONS.push(newSession);

    // Check for improvement achievement
    let improvementAchievement = null;
    if (previousSessions.length > 0) {
        const bestPrevious = Math.max(...previousSessions.map(s => s.score));
        if (score > bestPrevious && accuracy >= 90) {
            improvementAchievement = {
                id: 'phieu-be-ngoan',
                title: 'Phiếu Bé Ngoan',
                description: 'Cải thiện thành tích xuất sắc!',
                icon: '🏆',
                rarity: 'legendary',
                points: 100
            };
        }
    }

    return {
        success: true,
        starsEarned: stars,
        newHighScore,
        accuracy,
        sessionId: newSession.sessionId,
        completed: true,
        improvementAchievement
    };
}

// Get completion time stats for a level
export function getCompletionTimeStats(userId: string, levelId?: string) {
    let sessions = MOCK_LEARNING_SESSIONS.filter(s => s.userId === userId);

    if (levelId) {
        sessions = sessions.filter(s => s.levelId === levelId);
    }

    if (sessions.length === 0) {
        return null;
    }

    const times = sessions.map(s => s.durationSeconds);
    const totalTime = times.reduce((a, b) => a + b, 0);
    const avgTime = Math.round(totalTime / times.length);
    const fastestTime = Math.min(...times);
    const slowestTime = Math.max(...times);

    return {
        userId,
        levelId: levelId || 'all',
        totalSessions: sessions.length,
        averageTimeSeconds: avgTime,
        fastestTimeSeconds: fastestTime,
        slowestTimeSeconds: slowestTime,
        totalTimeSeconds: totalTime,
        recentSessions: sessions.slice(-5).reverse()
    };
}

// Get today's stats
export function getTodayStats(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaySessions = MOCK_LEARNING_SESSIONS.filter(s => {
        const sessionDate = new Date(s.completedAt);
        sessionDate.setHours(0, 0, 0, 0);
        return s.userId === userId && sessionDate.getTime() === today.getTime();
    });

    const lessonsCompleted = todaySessions.length;
    const correctAnswers = todaySessions.reduce((sum, s) => sum + s.score, 0);
    const minutesLearned = Math.round(
        todaySessions.reduce((sum, s) => sum + s.durationSeconds, 0) / 60
    );

    return {
        lessonsCompleted,
        correctAnswers,
        minutesLearned
    };
}
