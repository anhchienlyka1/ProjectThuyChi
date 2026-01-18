import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { LearningSessionSchema } from '../../infrastructure/database/schemas/learning-session.schema';
import { UserProgressSchema } from '../../infrastructure/database/schemas/user-progress.schema';
import { UserAchievementSchema } from '../../infrastructure/database/schemas/user-achievement.schema';
import { SubjectSchema } from '../../infrastructure/database/schemas/subject.schema';
import { LevelSchema } from '../../infrastructure/database/schemas/level.schema';
import { QuestionAttemptSchema } from '../../infrastructure/database/schemas/question-attempt.schema';

@Injectable()
export class DashboardService {
    constructor(
        @InjectRepository(LearningSessionSchema)
        private sessionRepo: Repository<LearningSessionSchema>,
        @InjectRepository(UserProgressSchema)
        private progressRepo: Repository<UserProgressSchema>,
        @InjectRepository(UserAchievementSchema)
        private achievementRepo: Repository<UserAchievementSchema>,
        @InjectRepository(SubjectSchema)
        private subjectRepo: Repository<SubjectSchema>,
        @InjectRepository(LevelSchema)
        private levelRepo: Repository<LevelSchema>,
        @InjectRepository(QuestionAttemptSchema)
        private questionAttemptRepo: Repository<QuestionAttemptSchema>,
    ) { }

    async getOverview(userId: string) {
        // 1. Calculate learning stats
        const sessions = await this.sessionRepo.find({ where: { userId, completed: true, isDeleted: false } });


        const totalSeconds = sessions.reduce((sum, s) => sum + s.durationSeconds, 0);
        const totalHours = Math.floor(totalSeconds / 3600);
        const totalMinutes = Math.floor((totalSeconds % 3600) / 60);

        const completedLessons = sessions.length;

        const avgScore = sessions.length > 0
            ? Math.round(sessions.reduce((sum, s) => sum + s.accuracyPercentage, 0) / sessions.length)
            : 0;

        const achievementsCount = await this.achievementRepo.count({ where: { userId, isDeleted: false } });


        // 2. Weekly Activity Chart (Last 7 days)
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toISOString().split('T')[0];
        }).reverse();

        const activityData = last7Days.map(dateStr => {
            const daySessions = sessions.filter(s => s.startedAt.toISOString().startsWith(dateStr));
            return {
                date: dateStr,
                minutes: Math.round(daySessions.reduce((sum, s) => sum + s.durationSeconds, 0) / 60),
                score: daySessions.length > 0 ? Math.round(daySessions.reduce((sum, s) => sum + s.score, 0) / daySessions.length) : 0
            };
        });

        return {
            stats: {
                totalTime: `${totalHours}g ${totalMinutes}p`,
                completedLessons,
                avgScore,
                achievements: achievementsCount
            },
            chartData: activityData
        };
    }

    async getParentOverview(childId: string) {
        // 1. Daily Summary (Today)
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date(todayStart);
        todayEnd.setDate(todayEnd.getDate() + 1);

        const todaySessions = await this.sessionRepo.find({
            where: {
                userId: childId,
                completedAt: Between(todayStart, todayEnd), // Use completedAt instead of startedAt
                completed: true,
                isDeleted: false
            }
        });

        const dailySummary = {
            minutesLearned: Math.round(todaySessions.reduce((sum, s) => sum + s.durationSeconds, 0) / 60),
            lessonsCompleted: todaySessions.length,
            avgScore: todaySessions.length > 0
                ? Math.round(todaySessions.reduce((sum, s) => sum + s.accuracyPercentage, 0) / todaySessions.length)
                : 0
        };

        // 2. Weekly Stats (This Week vs Last Week)
        // Determine start of this week (Monday)
        const now = new Date();
        const day = now.getDay() || 7; // Get current day number, make Sunday (0) -> 7
        if (day !== 1) now.setHours(-24 * (day - 1));
        else now.setHours(0, 0, 0, 0); // It is Monday
        // The above logic is tricky for timezones. Let's use simple logic: "This Week" = Start of User's Week (Monday).

        const getMonday = (d: Date) => {
            const dC = new Date(d);
            const day = dC.getDay();
            const diff = dC.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
            const monday = new Date(dC.setDate(diff));
            monday.setHours(0, 0, 0, 0);
            return monday;
        }

        const thisWeekStart = getMonday(new Date());
        const lastWeekStart = new Date(thisWeekStart);
        lastWeekStart.setDate(lastWeekStart.getDate() - 7);
        const lastWeekEnd = new Date(thisWeekStart); // Midnight Monday is end of last week (technically Sunday 23:59:59 but Between handles exclusiveness logic usually or we check < thisWeekStart)

        // Fetch All relevant sessions to avoid multiple DB calls?
        // Or fetch This Week and Last Week separately.

        const thisWeekSessions = await this.sessionRepo.find({
            where: {
                userId: childId,
                completedAt: Between(thisWeekStart, new Date()), // Use completedAt instead of startedAt
                completed: true,
                isDeleted: false
            }
        });

        const lastWeekSessions = await this.sessionRepo.find({
            where: {
                userId: childId,
                completedAt: Between(lastWeekStart, lastWeekEnd), // Use completedAt instead of startedAt
                completed: true,
                isDeleted: false
            }
        });

        const calcStats = (sessions: LearningSessionSchema[]) => ({
            timeMinutes: Math.round(sessions.reduce((sum, s) => sum + s.durationSeconds, 0) / 60),
            lessons: sessions.length,
            avgScore: sessions.length > 0 ? Math.round(sessions.reduce((sum, s) => sum + s.accuracyPercentage, 0) / sessions.length) : 0
        });

        const thisWeekStats = calcStats(thisWeekSessions);
        const lastWeekStats = calcStats(lastWeekSessions);

        const diffTime = thisWeekStats.timeMinutes - lastWeekStats.timeMinutes; // Absolute minutes diff? UI says +15% or +X. UI says "+15% so voi tuan truoc". 
        // If last week 0, and this week > 0, it is +100% or infinity. UI shows string.
        // Let's return raw numbers and maybe specific formatted strings or diffs.
        // Let's return objects like { value: 12h35m, change: "+15%" }

        const formatDiff = (curr: number, prev: number, isPercent: boolean = false, suffix: string = '') => {
            if (prev === 0) return curr > 0 ? `+100%` : `0%`; // Or just new
            const diff = curr - prev;
            if (isPercent) return diff > 0 ? `+${diff}%` : `${diff}%`;
            // For value diff:
            return diff > 0 ? `+${diff} ${suffix}` : `${diff} ${suffix}`;
        }

        // Careful with Score, it is difference in Percentage Points, not percent change of percent. 
        // 87% vs 82% -> +5%.

        // Badges
        const totalBadges = await this.achievementRepo.count({ where: { userId: childId, isDeleted: false } });
        const newBadgesThisWeek = await this.achievementRepo.count({
            where: {
                userId: childId,
                earnedAt: Between(thisWeekStart, new Date()),
                isDeleted: false
            }
        });

        // 3. Subject Progress
        const subjects = await this.subjectRepo.find({ where: { active: true, isDeleted: false }, order: { sortOrder: 'ASC' } });

        const subjectProgress = await Promise.all(subjects.map(async sub => {
            const totalLevels = await this.levelRepo.count({ where: { subjectId: sub.id, isDeleted: false } });

            // For completed, we need to filter by subject. UserProgress has relation to Level.
            // Using QueryBuilder is safer for relations filter in count
            const completedLevels = await this.progressRepo.createQueryBuilder('up')
                .innerJoin('up.level', 'level')
                .where('up.userId = :userId', { userId: childId })
                .andWhere('up.status = :status', { status: 'COMPLETED' })
                .andWhere('level.subjectId = :subjectId', { subjectId: sub.id })
                .getCount();

            return {
                subjectId: sub.id,
                subjectName: sub.title,
                totalLevels,
                completedLevels,
                percentage: totalLevels > 0 ? Math.round((completedLevels / totalLevels) * 100) : 0,
                color: sub.themeConfig?.primaryColor || '#000000' // Optional styling helper
            };
        }));

        // Helper to format time
        const formatTime = (minutes: number) => {
            const h = Math.floor(minutes / 60);
            const m = minutes % 60;
            if (h > 0) return `${h}h ${m}m`;
            return `${m}m`;
        }

        return {
            dailySummary,
            weeklyStats: {
                totalTime: {
                    value: formatTime(thisWeekStats.timeMinutes),
                    trend: thisWeekStats.timeMinutes >= lastWeekStats.timeMinutes
                        ? `+${Math.round(((thisWeekStats.timeMinutes - lastWeekStats.timeMinutes) / (lastWeekStats.timeMinutes || 1)) * 100)}%`
                        : `${Math.round(((thisWeekStats.timeMinutes - lastWeekStats.timeMinutes) / (lastWeekStats.timeMinutes || 1)) * 100)}%`
                },
                lessonsCompleted: {
                    value: thisWeekStats.lessons,
                    trend: thisWeekStats.lessons - lastWeekStats.lessons >= 0
                        ? `+${thisWeekStats.lessons - lastWeekStats.lessons}`
                        : `${thisWeekStats.lessons - lastWeekStats.lessons}`
                },
                avgScore: {
                    value: `${thisWeekStats.avgScore}%`,
                    trend: thisWeekStats.avgScore - lastWeekStats.avgScore >= 0
                        ? `+${thisWeekStats.avgScore - lastWeekStats.avgScore}%`
                        : `${thisWeekStats.avgScore - lastWeekStats.avgScore}%`
                },
                badges: {
                    value: totalBadges,
                    newThisWeek: newBadgesThisWeek
                }
            },
            subjectProgress
        };
    }

    async getRecentHistory(userId: string) {
        return this.sessionRepo.find({
            where: { userId, completed: true, isDeleted: false },

            order: { startedAt: 'DESC' },
            take: 20,
            relations: ['level', 'level.subject']
        });
    }

    async getProgress(userId: string) {
        return this.progressRepo.find({
            where: { userId, isDeleted: false },

            relations: ['level']
        });
    }

    async getAchievements(userId: string) {
        return this.achievementRepo.find({
            where: { userId, isDeleted: false },
            relations: ['achievement'],
            order: { earnedAt: 'DESC' }
        });
    }

    /**
     * Get certificates (Phiếu Bé Ngoan) for a student
     * Returns all weekly achievements with details
     */
    async getCertificates(userId: string, options?: { limit?: number; offset?: number; status?: 'locked' | 'unlocked' }) {
        const queryBuilder = this.achievementRepo.createQueryBuilder('ua')
            .leftJoinAndSelect('ua.achievement', 'achievement')
            .where('ua.userId = :userId', { userId })
            .andWhere('ua.isDeleted = :isDeleted', { isDeleted: false })
            .orderBy('ua.earnedAt', 'DESC');

        if (options?.limit) {
            queryBuilder.take(options.limit);
        }

        if (options?.offset) {
            queryBuilder.skip(options.offset);
        }

        const achievements = await queryBuilder.getMany();

        // Transform to certificate format
        const certificates = achievements.map((ua, index) => {
            // Calculate week number from earnedAt
            const earnedDate = new Date(ua.earnedAt);
            const startOfYear = new Date(earnedDate.getFullYear(), 0, 1);
            const weekNumber = Math.ceil((((earnedDate.getTime() - startOfYear.getTime()) / 86400000) + startOfYear.getDay() + 1) / 7);

            return {
                id: ua.id,
                achievementId: ua.achievementId,
                title: ua.achievement?.title || `Phiếu Bé Ngoan Tuần ${weekNumber}`,
                description: ua.achievement?.description || ua.earnedContext?.description || 'Hoàn thành xuất sắc các bài tập tuần này',
                icon: ua.achievement?.icon || '🌟',
                rarity: ua.achievement?.rarity || 'common',
                earnedAt: ua.earnedAt,
                weekNumber,
                isUnlocked: true, // All earned achievements are unlocked
                earnedContext: ua.earnedContext
            };
        });

        // Get total count for pagination
        const total = await this.achievementRepo.count({
            where: { userId, isDeleted: false }
        });

        return {
            certificates,
            total,
            hasMore: options?.limit ? (options.offset || 0) + certificates.length < total : false
        };
    }

    /**
     * Get detailed learning history with question-level data
     * Supports filtering by subject, time range, and performance
     */
    async getDetailedLearningHistory(
        userId: string,
        filters?: {
            subject?: string;
            timeRange?: 'all' | 'today' | 'week' | 'month';
            result?: 'excellent' | 'good' | 'average' | 'needs-improvement';
            limit?: number;
            offset?: number;
        }
    ) {
        // Build query for sessions
        let queryBuilder = this.sessionRepo.createQueryBuilder('session')
            .leftJoinAndSelect('session.level', 'level')
            .leftJoinAndSelect('level.subject', 'subject')
            .where('session.userId = :userId', { userId })
            .andWhere('session.completed = :completed', { completed: true })
            .andWhere('session.isDeleted = :isDeleted', { isDeleted: false });

        // Filter by subject
        if (filters?.subject) {
            queryBuilder.andWhere('subject.title = :subjectTitle', { subjectTitle: filters.subject });
        }

        // Filter by time range
        if (filters?.timeRange && filters.timeRange !== 'all') {
            const now = new Date();
            let startDate: Date;

            switch (filters.timeRange) {
                case 'today':
                    startDate = new Date(now.setHours(0, 0, 0, 0));
                    break;
                case 'week':
                    startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    break;
                case 'month':
                    startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                    break;
            }

            queryBuilder.andWhere('session.startedAt >= :startDate', { startDate });
        }

        // Apply pagination
        if (filters?.limit) {
            queryBuilder.take(filters.limit);
        }
        if (filters?.offset) {
            queryBuilder.skip(filters.offset);
        }

        // Order by most recent first
        queryBuilder.orderBy('session.startedAt', 'DESC');

        // Execute query
        let sessions = await queryBuilder.getMany();

        // Filter by result/performance (client-side since it's percentage-based)
        if (filters?.result) {
            sessions = sessions.filter(session => {
                const percentage = session.accuracyPercentage;
                switch (filters.result) {
                    case 'excellent': return percentage >= 90;
                    case 'good': return percentage >= 70 && percentage < 90;
                    case 'average': return percentage >= 50 && percentage < 70;
                    case 'needs-improvement': return percentage < 50;
                    default: return true;
                }
            });
        }

        // Fetch question attempts for each session
        const detailedActivities = await Promise.all(sessions.map(async (session) => {
            const questionAttempts = await this.questionAttemptRepo.find({
                where: {
                    sessionId: session.id,
                    isDeleted: false
                },
                order: { questionNumber: 'ASC' }
            });

            return {
                id: session.id,
                date: session.startedAt,
                subject: session.level?.subject?.title || 'Unknown',
                module: session.level?.title || 'Unknown Module',
                totalDuration: Math.round(session.durationSeconds / 60), // Convert to minutes
                score: session.score,
                totalQuestions: session.totalQuestions,
                accuracyPercentage: session.accuracyPercentage,
                questions: questionAttempts.map(qa => ({
                    questionNumber: qa.questionNumber,
                    question: qa.questionText || '',
                    userAnswer: qa.userAnswer || '',
                    correctAnswer: qa.correctAnswer || '',
                    isCorrect: qa.isCorrect,
                    timeSpent: qa.timeSpentSeconds
                }))
            };
        }));

        // Get total count for pagination
        const totalQuery = this.sessionRepo.createQueryBuilder('session')
            .leftJoin('session.level', 'level')
            .leftJoin('level.subject', 'subject')
            .where('session.userId = :userId', { userId })
            .andWhere('session.completed = :completed', { completed: true })
            .andWhere('session.isDeleted = :isDeleted', { isDeleted: false });

        if (filters?.subject) {
            totalQuery.andWhere('subject.title = :subjectTitle', { subjectTitle: filters.subject });
        }

        const total = await totalQuery.getCount();

        return {
            activities: detailedActivities,
            total,
            hasMore: filters?.limit ? (filters.offset || 0) + detailedActivities.length < total : false
        };
    }

    /**
     * Get detailed subject achievements for parent dashboard
     * Returns per-subject stats including time spent, average score, strengths and weaknesses
     */
    async getSubjectAchievements(childId: string) {
        // Get all subjects
        const subjects = await this.subjectRepo.find({
            where: { active: true, isDeleted: false },
            order: { sortOrder: 'ASC' }
        });

        const subjectAchievements = await Promise.all(subjects.map(async subject => {
            // Get all levels for this subject
            const levels = await this.levelRepo.find({
                where: { subjectId: subject.id, isDeleted: false }
            });

            // Get completed sessions for this subject
            const sessions = await this.sessionRepo.createQueryBuilder('session')
                .leftJoinAndSelect('session.level', 'level')
                .where('session.userId = :userId', { userId: childId })
                .andWhere('session.completed = :completed', { completed: true })
                .andWhere('session.isDeleted = :isDeleted', { isDeleted: false })
                .andWhere('level.subjectId = :subjectId', { subjectId: subject.id })
                .getMany();

            // Calculate total time in minutes
            const totalTimeMinutes = Math.round(sessions.reduce((sum, s) => sum + s.durationSeconds, 0) / 60);

            // Calculate average score
            const avgScore = sessions.length > 0
                ? Math.round(sessions.reduce((sum, s) => sum + s.accuracyPercentage, 0) / sessions.length)
                : 0;

            // Count completed lessons (unique levels)
            const completedLevelIds = [...new Set(sessions.map(s => s.levelId))];
            const completedLessons = completedLevelIds.length;

            // Calculate per-level performance for strengths/weaknesses
            const levelPerformance: { levelId: string; levelTitle: string; avgScore: number; count: number }[] = [];

            for (const level of levels) {
                const levelSessions = sessions.filter(s => s.levelId === level.id);
                if (levelSessions.length > 0) {
                    const levelAvgScore = Math.round(
                        levelSessions.reduce((sum, s) => sum + s.accuracyPercentage, 0) / levelSessions.length
                    );
                    levelPerformance.push({
                        levelId: level.id,
                        levelTitle: level.title,
                        avgScore: levelAvgScore,
                        count: levelSessions.length
                    });
                }
            }

            // Sort by avgScore to find strengths (high scores) and weaknesses (low scores)
            const sortedByScore = [...levelPerformance].sort((a, b) => b.avgScore - a.avgScore);

            // Strengths: levels with score >= 80%
            const strengths = sortedByScore
                .filter(l => l.avgScore >= 80)
                .slice(0, 3)
                .map(l => l.levelTitle);

            // Needs improvement: levels with score < 70% (but at least 1 attempt)
            const needsImprovement = sortedByScore
                .filter(l => l.avgScore < 70)
                .sort((a, b) => a.avgScore - b.avgScore) // Lowest first
                .slice(0, 3)
                .map(l => l.levelTitle);

            // Get subject theme color
            const themeColors: { [key: string]: { bgGradient: string; headerGradient: string; textColor: string } } = {
                'math': {
                    bgGradient: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
                    headerGradient: 'linear-gradient(135deg, #42A5F5 0%, #1E88E5 100%)',
                    textColor: '#1565C0'
                },
                'vietnamese': {
                    bgGradient: 'linear-gradient(135deg, #FCE4EC 0%, #F8BBD0 100%)',
                    headerGradient: 'linear-gradient(135deg, #EC407A 0%, #D81B60 100%)',
                    textColor: '#AD1457'
                },
                'english': {
                    bgGradient: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
                    headerGradient: 'linear-gradient(135deg, #66BB6A 0%, #43A047 100%)',
                    textColor: '#2E7D32'
                }
            };

            const colors = themeColors[subject.id] || {
                bgGradient: 'linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%)',
                headerGradient: 'linear-gradient(135deg, #AB47BC 0%, #8E24AA 100%)',
                textColor: '#6A1B9A'
            };

            return {
                subjectId: subject.id,
                subjectName: subject.title,
                icon: this.getSubjectIcon(subject.id),
                completedLessons,
                totalLevels: levels.length,
                totalTimeMinutes,
                avgScore,
                strengths,
                needsImprovement,
                colors
            };
        }));

        return { subjectAchievements };
    }

    private getSubjectIcon(subjectId: string): string {
        switch (subjectId) {
            case 'math': return '🔢';
            case 'vietnamese': return '📝';
            case 'english': return '🔤';
            default: return '📚';
        }
    }

    /**
     * Get daily activities for learning report chart
     * Returns aggregated data per day based on time range
     * @param childId - Student ID
     * @param timeRange - 'week' | 'month' | 'year'
     */
    async getDailyActivities(childId: string, timeRange: 'week' | 'month' | 'year' = 'week') {
        const now = new Date();
        let startDate: Date;
        let groupBy: 'day' | 'week' | 'month';

        switch (timeRange) {
            case 'week':
                // Get start of current week (Monday)
                startDate = new Date(now);
                const dayOfWeek = startDate.getDay();
                const diff = startDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
                startDate = new Date(startDate.setDate(diff));
                startDate.setHours(0, 0, 0, 0);
                groupBy = 'day';
                break;
            case 'month':
                // Get start of current month
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                startDate.setHours(0, 0, 0, 0);
                groupBy = 'day';
                break;
            case 'year':
                // Get start of current year
                startDate = new Date(now.getFullYear(), 0, 1);
                startDate.setHours(0, 0, 0, 0);
                groupBy = 'month';
                break;
            default:
                startDate = new Date(now);
                startDate.setDate(startDate.getDate() - 7);
                groupBy = 'day';
        }

        // Fetch all completed sessions in the time range
        const sessions = await this.sessionRepo.find({
            where: {
                userId: childId,
                completedAt: Between(startDate, now),
                completed: true,
                isDeleted: false
            },
            order: { completedAt: 'ASC' }
        });

        // Generate date range based on time range
        const activities: Array<{
            date: string;
            totalMinutes: number;
            lessonsCompleted: number;
            averageScore: number;
        }> = [];

        if (groupBy === 'day') {
            const current = new Date(startDate);
            while (current <= now) {
                // Use local date string format YYYY-MM-DD
                const year = current.getFullYear();
                const month = String(current.getMonth() + 1).padStart(2, '0');
                const day = String(current.getDate()).padStart(2, '0');
                const dateStr = `${year}-${month}-${day}`;

                const daySessions = sessions.filter(s => {
                    if (!s.completedAt) return false;
                    const sDate = new Date(s.completedAt);
                    const sYear = sDate.getFullYear();
                    const sMonth = String(sDate.getMonth() + 1).padStart(2, '0');
                    const sDay = String(sDate.getDate()).padStart(2, '0');
                    const sDateStr = `${sYear}-${sMonth}-${sDay}`;
                    return sDateStr === dateStr;
                });

                const totalMinutes = Math.round(daySessions.reduce((sum, s) => sum + s.durationSeconds, 0) / 60);
                const lessonsCompleted = daySessions.length;
                const averageScore = daySessions.length > 0
                    ? Math.round(daySessions.reduce((sum, s) => sum + s.accuracyPercentage, 0) / daySessions.length)
                    : 0;

                activities.push({
                    date: dateStr,
                    totalMinutes,
                    lessonsCompleted,
                    averageScore
                });

                current.setDate(current.getDate() + 1);
            }
        } else if (groupBy === 'month') {
            // Group by month for yearly view
            for (let month = 0; month <= now.getMonth(); month++) {
                const monthStart = new Date(now.getFullYear(), month, 1);
                const monthEnd = new Date(now.getFullYear(), month + 1, 0, 23, 59, 59);

                const monthSessions = sessions.filter(s => {
                    if (!s.completedAt) return false;
                    const completedDate = new Date(s.completedAt);
                    return completedDate >= monthStart && completedDate <= monthEnd;
                });

                const totalMinutes = Math.round(monthSessions.reduce((sum, s) => sum + s.durationSeconds, 0) / 60);
                const lessonsCompleted = monthSessions.length;
                const averageScore = monthSessions.length > 0
                    ? Math.round(monthSessions.reduce((sum, s) => sum + s.accuracyPercentage, 0) / monthSessions.length)
                    : 0;

                activities.push({
                    date: monthStart.toISOString().split('T')[0],
                    totalMinutes,
                    lessonsCompleted,
                    averageScore
                });
            }
        }

        // Calculate summary stats
        const totalMinutes = activities.reduce((sum, a) => sum + a.totalMinutes, 0);
        const totalLessons = activities.reduce((sum, a) => sum + a.lessonsCompleted, 0);
        const avgScore = sessions.length > 0
            ? Math.round(sessions.reduce((sum, s) => sum + s.accuracyPercentage, 0) / sessions.length)
            : 0;

        // Calculate streak (consecutive days with learning)
        let streak = 0;
        const sortedActivities = [...activities].reverse();
        for (const activity of sortedActivities) {
            if (activity.lessonsCompleted > 0) {
                streak++;
            } else {
                break;
            }
        }

        return {
            activities,
            summary: {
                totalMinutes,
                totalLessons,
                averageScore: avgScore,
                streak,
                improvement: 0 // TODO: Calculate improvement compared to previous period
            },
            timeRange,
            groupBy
        };
    }
}
