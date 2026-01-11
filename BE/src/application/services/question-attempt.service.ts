import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuestionAttemptSchema } from '../../infrastructure/database/schemas/question-attempt.schema';
import { CreateQuestionAttemptDto, QuestionAttemptAnalysisDto } from '../dtos/question-attempt.dto';

@Injectable()
export class QuestionAttemptService {
    constructor(
        @InjectRepository(QuestionAttemptSchema)
        private attemptRepo: Repository<QuestionAttemptSchema>,
    ) { }

    /**
     * Lưu chi tiết 1 câu hỏi
     */
    async createAttempt(dto: CreateQuestionAttemptDto) {
        const attempt = this.attemptRepo.create({
            sessionId: dto.sessionId,
            questionId: dto.questionId,
            questionNumber: dto.questionNumber,
            questionText: dto.questionText,
            userAnswer: dto.userAnswer,
            correctAnswer: dto.correctAnswer,
            isCorrect: dto.isCorrect,
            timeSpentSeconds: dto.timeSpentSeconds,
            attemptsCount: dto.attemptsCount || 1,
            answeredAt: new Date()
        });

        return this.attemptRepo.save(attempt);
    }

    /**
     * Lưu nhiều câu hỏi cùng lúc (khi hoàn thành session)
     */
    async createBulkAttempts(sessionId: number, attempts: Omit<CreateQuestionAttemptDto, 'sessionId'>[]) {
        const entities = attempts.map(dto => this.attemptRepo.create({
            sessionId,
            questionId: dto.questionId,
            questionNumber: dto.questionNumber,
            questionText: dto.questionText,
            userAnswer: dto.userAnswer,
            correctAnswer: dto.correctAnswer,
            isCorrect: dto.isCorrect,
            timeSpentSeconds: dto.timeSpentSeconds,
            attemptsCount: dto.attemptsCount || 1,
            answeredAt: new Date()
        }));

        return this.attemptRepo.save(entities);
    }

    /**
     * Lấy chi tiết các câu hỏi trong 1 session
     */
    async getAttemptsBySession(sessionId: number) {
        return this.attemptRepo.find({
            where: { sessionId, isDeleted: false },
            order: { questionNumber: 'ASC' }
        });
    }

    /**
     * Lấy tất cả attempts của 1 user (qua sessions)
     */
    async getAttemptsByUser(userId: number, limit: number = 100) {
        return this.attemptRepo
            .createQueryBuilder('qa')
            .innerJoin('qa.session', 'session')
            .where('session.userId = :userId', { userId })
            .andWhere('qa.isDeleted = false')
            .orderBy('qa.answeredAt', 'DESC')
            .limit(limit)
            .getMany();
    }

    /**
     * Phân tích câu hỏi nào bé hay sai
     * Nhóm theo questionText và đếm số lần đúng/sai
     */
    async analyzeUserPerformance(userId: number, levelId?: string) {
        const query = this.attemptRepo
            .createQueryBuilder('qa')
            .select('qa.questionText', 'questionText')
            .addSelect('COUNT(*)', 'totalAttempts')
            .addSelect('SUM(CASE WHEN qa.isCorrect = 1 THEN 1 ELSE 0 END)', 'correctAttempts')
            .addSelect('SUM(CASE WHEN qa.isCorrect = 0 THEN 1 ELSE 0 END)', 'wrongAttempts')
            .addSelect('AVG(qa.timeSpentSeconds)', 'averageTimeSpent')
            .innerJoin('qa.session', 'session')
            .where('session.userId = :userId', { userId })
            .andWhere('qa.isDeleted = false')
            .groupBy('qa.questionText');

        if (levelId) {
            query.andWhere('session.levelId = :levelId', { levelId });
        }

        const rawResults = await query.getRawMany();

        // Transform to DTO
        const analysis: QuestionAttemptAnalysisDto[] = rawResults.map(row => ({
            questionText: row.questionText,
            totalAttempts: parseInt(row.totalAttempts),
            correctAttempts: parseInt(row.correctAttempts),
            wrongAttempts: parseInt(row.wrongAttempts),
            successRate: (parseInt(row.correctAttempts) / parseInt(row.totalAttempts)) * 100,
            averageTimeSpent: parseFloat(row.averageTimeSpent),
            commonWrongAnswers: [] // TODO: Implement if needed
        }));

        // Sort by wrong attempts (descending) to show problematic questions first
        return analysis.sort((a, b) => b.wrongAttempts - a.wrongAttempts);
    }

    /**
     * Lấy các câu trả lời sai phổ biến cho 1 câu hỏi cụ thể
     */
    async getCommonWrongAnswers(userId: number, questionText: string) {
        const results = await this.attemptRepo
            .createQueryBuilder('qa')
            .select('qa.userAnswer', 'answer')
            .addSelect('COUNT(*)', 'count')
            .innerJoin('qa.session', 'session')
            .where('session.userId = :userId', { userId })
            .andWhere('qa.questionText = :questionText', { questionText })
            .andWhere('qa.isCorrect = false')
            .andWhere('qa.isDeleted = false')
            .groupBy('qa.userAnswer')
            .orderBy('count', 'DESC')
            .limit(5)
            .getRawMany();

        return results.map(r => ({
            answer: r.answer,
            count: parseInt(r.count)
        }));
    }

    /**
     * Thống kê tổng quan
     */
    async getOverallStats(userId: number) {
        const result = await this.attemptRepo
            .createQueryBuilder('qa')
            .select('COUNT(*)', 'totalQuestions')
            .addSelect('SUM(CASE WHEN qa.isCorrect = 1 THEN 1 ELSE 0 END)', 'totalCorrect')
            .addSelect('SUM(CASE WHEN qa.isCorrect = 0 THEN 1 ELSE 0 END)', 'totalWrong')
            .addSelect('AVG(qa.timeSpentSeconds)', 'avgTimePerQuestion')
            .innerJoin('qa.session', 'session')
            .where('session.userId = :userId', { userId })
            .andWhere('qa.isDeleted = false')
            .getRawOne();

        return {
            totalQuestions: parseInt(result.totalQuestions) || 0,
            totalCorrect: parseInt(result.totalCorrect) || 0,
            totalWrong: parseInt(result.totalWrong) || 0,
            accuracy: result.totalQuestions > 0
                ? (parseInt(result.totalCorrect) / parseInt(result.totalQuestions)) * 100
                : 0,
            avgTimePerQuestion: parseFloat(result.avgTimePerQuestion) || 0
        };
    }
}
