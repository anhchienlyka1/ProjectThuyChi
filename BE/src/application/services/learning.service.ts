import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LearningSessionSchema } from '../../infrastructure/database/schemas/learning-session.schema';
import { UserProgressSchema } from '../../infrastructure/database/schemas/user-progress.schema';
import { CreateLearningSessionDto } from '../dtos/create-learning-session.dto';
import { UserSchema } from '../../infrastructure/database/schemas/user.schema';
import { QuestionAttemptService } from './question-attempt.service';

@Injectable()
export class LearningService {
    constructor(
        @InjectRepository(LearningSessionSchema)
        private sessionRepo: Repository<LearningSessionSchema>,
        @InjectRepository(UserProgressSchema)
        private progressRepo: Repository<UserProgressSchema>,
        @InjectRepository(UserSchema)
        private userRepo: Repository<UserSchema>,
        private questionAttemptService: QuestionAttemptService,
    ) { }

    async completeSession(dto: CreateLearningSessionDto) {
        const userId = dto.userId;

        // 1. Calculate accuracy & stars
        const accuracy = dto.totalQuestions > 0 ? (dto.score / dto.totalQuestions) * 100 : 0;
        let stars = 0;
        if (accuracy >= 90) stars = 3;
        else if (accuracy >= 70) stars = 2;
        else if (accuracy >= 50) stars = 1;

        // 2. Save Session
        const session = this.sessionRepo.create({
            userId: userId,
            levelId: dto.levelId,
            startedAt: new Date(Date.now() - dto.durationSeconds * 1000),
            completedAt: new Date(),
            durationSeconds: dto.durationSeconds,
            score: dto.score,
            totalQuestions: dto.totalQuestions,
            accuracyPercentage: accuracy,
            completed: true,
            sessionMetadata: { answers: dto.answers }
        });
        await this.sessionRepo.save(session);

        // 2b. Save Question Attempts (NEW!)
        if (dto.answers && dto.answers.length > 0) {
            try {
                const attempts = dto.answers.map((answer, index) => ({
                    questionId: answer.questionId || null,
                    questionNumber: index + 1,
                    questionText: answer.questionText || answer.question || '',
                    userAnswer: answer.userAnswer || answer.answer || '',
                    correctAnswer: answer.correctAnswer || answer.correct || '',
                    isCorrect: answer.isCorrect || answer.correct === answer.answer || false,
                    timeSpentSeconds: answer.timeSpent || answer.duration || 0,
                    attemptsCount: answer.attempts || 1
                }));

                await this.questionAttemptService.createBulkAttempts(session.id, attempts);
            } catch (error) {
                console.error('Failed to save question attempts:', error);
                // Don't fail the whole session if attempts fail
            }
        }

        // 3. Update User Progress
        let progress = await this.progressRepo.findOne({ where: { userId: userId, levelId: dto.levelId, isDeleted: false } });


        if (!progress) {
            progress = this.progressRepo.create({
                userId: userId,
                levelId: dto.levelId,
                totalAttempts: 0,
                highScore: 0,
                stars: 0,
                status: 'UNLOCKED' // Or IN_PROGRESS upon first attempt
            });
        }

        progress.totalAttempts += 1;
        progress.lastPlayedAt = new Date();

        // Update high score
        if (dto.score > progress.highScore) {
            progress.highScore = dto.score;
        }

        // Update stars (only if better)
        if (stars > progress.stars) {
            progress.stars = stars;
        }

        // Update status to COMPLETED if pass (e.g. >= 1 star)
        if (stars >= 1) {
            progress.status = 'COMPLETED';
        } else if (progress.status !== 'COMPLETED') {
            // If not completed yet and failed, mark as IN_PROGRESS
            progress.status = 'IN_PROGRESS';
        }

        await this.progressRepo.save(progress);

        return {
            success: true,
            starsEarned: stars,
            newHighScore: progress.highScore === dto.score,
            accuracy: accuracy,
            sessionId: session.id,
            completed: stars >= 1
        };
    }

    async getTodayCompletions(userId: string) {
        // Get start and end of today
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

        // Query sessions completed today
        const sessions = await this.sessionRepo
            .createQueryBuilder('session')
            .select('session.levelId', 'levelId')
            .addSelect('COUNT(*)', 'count')
            .where('session.userId = :userId', { userId })
            .andWhere('session.completed = :completed', { completed: true })
            .andWhere('session.completedAt >= :startOfDay', { startOfDay })
            .andWhere('session.completedAt <= :endOfDay', { endOfDay })
            .andWhere('session.isDeleted = :isDeleted', { isDeleted: false })
            .groupBy('session.levelId')
            .getRawMany();

        // Transform to object format: { levelId: count }
        const completions = {};
        sessions.forEach(session => {
            completions[session.levelId] = parseInt(session.count, 10);
        });

        return {
            date: now.toISOString().split('T')[0], // YYYY-MM-DD
            completions
        };
    }
}
