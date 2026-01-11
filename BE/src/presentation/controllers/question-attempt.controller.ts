import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { QuestionAttemptService } from '../../application/services/question-attempt.service';
import { CreateQuestionAttemptDto } from '../../application/dtos/question-attempt.dto';

@Controller('question-attempts')
export class QuestionAttemptController {
    constructor(private readonly attemptService: QuestionAttemptService) { }

    /**
     * POST /question-attempts
     * Lưu 1 câu hỏi (realtime khi bé trả lời)
     */
    @Post()
    async createAttempt(@Body() dto: CreateQuestionAttemptDto) {
        return this.attemptService.createAttempt(dto);
    }

    /**
     * POST /question-attempts/bulk
     * Lưu nhiều câu cùng lúc (khi hoàn thành session)
     */
    @Post('bulk')
    async createBulkAttempts(
        @Body() body: {
            sessionId: number;
            attempts: Omit<CreateQuestionAttemptDto, 'sessionId'>[]
        }
    ) {
        return this.attemptService.createBulkAttempts(body.sessionId, body.attempts);
    }

    /**
     * GET /question-attempts/session/:sessionId
     * Xem chi tiết các câu trong 1 phiên học
     */
    @Get('session/:sessionId')
    async getBySession(@Param('sessionId') sessionId: string) {
        return this.attemptService.getAttemptsBySession(+sessionId);
    }

    /**
     * GET /question-attempts/user/:userId
     * Xem tất cả attempts của user
     */
    @Get('user/:userId')
    async getByUser(
        @Param('userId') userId: string,
        @Query('limit') limit?: string
    ) {
        return this.attemptService.getAttemptsByUser(
            +userId,
            limit ? +limit : 100
        );
    }

    /**
     * GET /question-attempts/analysis/:userId
     * Phân tích câu nào bé hay sai
     */
    @Get('analysis/:userId')
    async analyzePerformance(
        @Param('userId') userId: string,
        @Query('levelId') levelId?: string
    ) {
        return this.attemptService.analyzeUserPerformance(+userId, levelId);
    }

    /**
     * GET /question-attempts/wrong-answers/:userId
     * Lấy các câu trả lời sai phổ biến
     */
    @Get('wrong-answers/:userId')
    async getCommonWrongAnswers(
        @Param('userId') userId: string,
        @Query('questionText') questionText: string
    ) {
        return this.attemptService.getCommonWrongAnswers(+userId, questionText);
    }

    /**
     * GET /question-attempts/stats/:userId
     * Thống kê tổng quan
     */
    @Get('stats/:userId')
    async getStats(@Param('userId') userId: string) {
        return this.attemptService.getOverallStats(+userId);
    }
}
