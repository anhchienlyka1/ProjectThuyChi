import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { LearningSessionSchema } from '../../infrastructure/database/schemas/learning-session.schema';
import { UserProgressSchema } from '../../infrastructure/database/schemas/user-progress.schema';
import { UserAchievementSchema } from '../../infrastructure/database/schemas/user-achievement.schema';
import { SubjectSchema } from '../../infrastructure/database/schemas/subject.schema';
import { LevelSchema } from '../../infrastructure/database/schemas/level.schema';

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
                startedAt: Between(todayStart, todayEnd),
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
                startedAt: Between(thisWeekStart, new Date()), // Up to now
                completed: true,
                isDeleted: false
            }
        });

        const lastWeekSessions = await this.sessionRepo.find({
            where: {
                userId: childId,
                startedAt: Between(lastWeekStart, lastWeekEnd),
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
            relations: ['level']
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
}
