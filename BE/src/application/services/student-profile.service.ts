import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { UserSchema } from '../../infrastructure/database/schemas/user.schema';
import { UserProgressSchema } from '../../infrastructure/database/schemas/user-progress.schema';
import { LearningSessionSchema } from '../../infrastructure/database/schemas/learning-session.schema';
import { UserAchievementSchema } from '../../infrastructure/database/schemas/user-achievement.schema';
import { AchievementSchema } from '../../infrastructure/database/schemas/achievement.schema';

@Injectable()
export class StudentProfileService {
    constructor(
        @InjectRepository(UserSchema)
        private userRepo: Repository<UserSchema>,
        @InjectRepository(UserProgressSchema)
        private progressRepo: Repository<UserProgressSchema>,
        @InjectRepository(LearningSessionSchema)
        private learningSessionRepo: Repository<LearningSessionSchema>,
        @InjectRepository(UserAchievementSchema)
        private userAchievementRepo: Repository<UserAchievementSchema>,
        @InjectRepository(AchievementSchema)
        private achievementRepo: Repository<AchievementSchema>,
    ) { }

    /**
     * Get student profile overview for parent dashboard
     */
    async getStudentProfile(userId: string) {
        // 1. Get user basic info
        const user = await this.userRepo.findOne({
            where: { id: userId, isDeleted: false }
        });

        if (!user) {
            throw new Error('User not found');
        }

        // 2. Calculate total XP from all user progress (stars = XP)
        const allProgress = await this.progressRepo.find({
            where: { userId, isDeleted: false }
        });
        const totalXP = allProgress.reduce((sum, p) => sum + (p.stars || 0), 0) * 10; // Each star = 10 XP

        const level = this.calculateLevel(totalXP);
        const xpForCurrentLevel = this.getXPForLevel(level);
        const xpForNextLevel = this.getXPForLevel(level + 1);
        const currentLevelProgress = totalXP - xpForCurrentLevel;
        const xpNeededForNextLevel = xpForNextLevel - xpForCurrentLevel;

        // 3. Get today's stats
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const todaySessions = await this.learningSessionRepo.find({
            where: {
                userId,
                startedAt: MoreThanOrEqual(today),
                isDeleted: false
            }
        });

        const todayStats = {
            lessonsCompleted: todaySessions.length,
            correctAnswers: todaySessions.reduce((sum, s) => sum + (s.score || 0), 0),
            minutesLearned: Math.round(
                todaySessions.reduce((sum, s) => sum + (s.durationSeconds || 0), 0) / 60
            )
        };

        // 4. Get total stars
        const totalStars = allProgress.reduce((sum, p) => sum + (p.stars || 0), 0);

        return {
            student: {
                id: user.id,
                name: user.name || user.fullName,
                avatar: user.avatarUrl,
                level,
                totalStars,
                xp: {
                    current: totalXP,
                    currentLevelProgress,
                    xpNeededForNextLevel,
                    percentage: Math.round((currentLevelProgress / xpNeededForNextLevel) * 100)
                }
            },
            todayStats
        };
    }

    /**
     * Get student's achievements (Phiếu Bé Ngoan)
     */
    async getStudentAchievements(userId: string, page: number = 1, limit: number = 10) {
        const query = this.userAchievementRepo
            .createQueryBuilder('ua')
            .leftJoinAndSelect('ua.achievement', 'achievement')
            .where('ua.userId = :userId', { userId })
            .andWhere('ua.isDeleted = :isDeleted', { isDeleted: false })
            .orderBy('ua.earnedAt', 'DESC');

        const [data, total] = await query
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();

        const achievements = data.map(ua => ({
            id: ua.id,
            achievementId: ua.achievement.achievementId,
            title: ua.achievement.title,
            description: ua.achievement.description,
            icon: ua.achievement.icon,
            rarity: ua.achievement.rarity,
            earnedAt: ua.earnedAt,
            earnedContext: ua.earnedContext
        }));

        return {
            data: achievements,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    }

    /**
     * Get weekly achievements for the student
     */
    async getWeeklyAchievements(userId: string) {
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Start of week (Sunday)
        weekStart.setHours(0, 0, 0, 0);

        const achievements = await this.userAchievementRepo.find({
            where: {
                userId,
                earnedAt: MoreThanOrEqual(weekStart),
                isDeleted: false
            },
            relations: ['achievement'],
            order: { earnedAt: 'DESC' }
        });

        return achievements.map(ua => ({
            id: ua.id,
            title: ua.achievement.title,
            description: ua.achievement.description,
            icon: ua.achievement.icon,
            earnedAt: ua.earnedAt,
            weekNumber: this.getWeekNumber(ua.earnedAt)
        }));
    }

    /**
     * Calculate level based on total XP
     * Formula: Level = floor(sqrt(XP / 100))
     */
    private calculateLevel(totalXP: number): number {
        return Math.floor(Math.sqrt(totalXP / 100)) + 1;
    }

    /**
     * Get XP required for a specific level
     */
    private getXPForLevel(level: number): number {
        return Math.pow(level - 1, 2) * 100;
    }

    /**
     * Get week number for a date
     */
    private getWeekNumber(date: Date): number {
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
        return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    }
}
