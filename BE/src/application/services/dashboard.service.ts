import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LearningSessionSchema } from '../../infrastructure/database/schemas/learning-session.schema';
import { UserProgressSchema } from '../../infrastructure/database/schemas/user-progress.schema';
import { UserAchievementSchema } from '../../infrastructure/database/schemas/user-achievement.schema';

@Injectable()
export class DashboardService {
    constructor(
        @InjectRepository(LearningSessionSchema)
        private sessionRepo: Repository<LearningSessionSchema>,
        @InjectRepository(UserProgressSchema)
        private progressRepo: Repository<UserProgressSchema>,
        @InjectRepository(UserAchievementSchema)
        private achievementRepo: Repository<UserAchievementSchema>,
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
}
