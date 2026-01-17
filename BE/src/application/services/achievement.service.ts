import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { AchievementSchema } from '../../infrastructure/database/schemas/achievement.schema';
import { UserAchievementSchema } from '../../infrastructure/database/schemas/user-achievement.schema';
import { LevelSchema } from '../../infrastructure/database/schemas/level.schema';
import { UserProgressSchema } from '../../infrastructure/database/schemas/user-progress.schema';

@Injectable()
export class AchievementService {
    constructor(
        @InjectRepository(AchievementSchema)
        private achievementRepo: Repository<AchievementSchema>,
        @InjectRepository(UserAchievementSchema)
        private userAchievementRepo: Repository<UserAchievementSchema>,
        @InjectRepository(LevelSchema)
        private levelRepo: Repository<LevelSchema>,
        @InjectRepository(UserProgressSchema)
        private progressRepo: Repository<UserProgressSchema>,
    ) { }

    /**
     * Check if user has completed all levels in a subject
     */
    async hasCompletedSubject(userId: string, subjectId: string): Promise<boolean> {
        // Get all levels for this subject
        const levels = await this.levelRepo.find({
            where: { subjectId, isDeleted: false }
        });

        if (levels.length === 0) {
            return false; // No levels exist for this subject
        }

        // Get user progress for all levels in this subject
        const levelIds = levels.map(l => l.id);
        const completedProgress = await this.progressRepo.count({
            where: {
                userId,
                levelId: In(levelIds),
                status: 'COMPLETED',
                isDeleted: false
            }
        });

        // User has completed the subject if they've completed all levels
        return completedProgress === levels.length;
    }

    /**
     * Award achievement to user if not already earned
     */
    async awardAchievement(userId: string, achievementId: string, context?: any): Promise<UserAchievementSchema | null> {
        // Find the achievement
        const achievement = await this.achievementRepo.findOne({
            where: { achievementId, isDeleted: false, active: true }
        });

        if (!achievement) {
            console.warn(`Achievement ${achievementId} not found or inactive`);
            return null;
        }

        // For improvement certificates, allow multiple awards (each improvement gets a new certificate)
        const allowMultiple = achievementId === 'improvement-certificate';

        if (!allowMultiple) {
            // Check if user already has this achievement
            const existing = await this.userAchievementRepo.findOne({
                where: {
                    userId,
                    achievementId: achievement.id,
                    isDeleted: false
                }
            });

            if (existing) {
                // Already earned
                return null;
            }
        }

        // Award the achievement
        const userAchievement = this.userAchievementRepo.create({
            userId,
            achievementId: achievement.id,
            earnedAt: new Date(),
            earnedContext: context || {},
            notified: false
        });

        await this.userAchievementRepo.save(userAchievement);

        console.log(`✨ Awarded achievement "${achievement.title}" to user ${userId}`);

        return userAchievement;
    }

    /**
     * Check and award subject completion achievement
     */
    async checkAndAwardSubjectCompletion(userId: string, subjectId: string): Promise<UserAchievementSchema | null> {
        // Check if user completed all levels in the subject
        const hasCompleted = await this.hasCompletedSubject(userId, subjectId);

        if (!hasCompleted) {
            return null;
        }

        // Map subject to achievement ID
        const achievementIdMap = {
            'math': 'math-completion',
            'vietnamese': 'vietnamese-completion',
            'english': 'english-completion'
        };

        const achievementId = achievementIdMap[subjectId];
        if (!achievementId) {
            console.warn(`No achievement mapping for subject: ${subjectId}`);
            return null;
        }

        // Award the achievement
        return await this.awardAchievement(userId, achievementId, {
            subjectId,
            completedAt: new Date()
        });
    }

    /**
     * Get all achievements earned by a user
     */
    async getUserAchievements(userId: string) {
        return await this.userAchievementRepo.find({
            where: { userId, isDeleted: false },
            relations: ['achievement'],
            order: { earnedAt: 'DESC' }
        });
    }
}
