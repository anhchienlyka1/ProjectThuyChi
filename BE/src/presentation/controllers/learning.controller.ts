import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { LearningService } from '../../application/services/learning.service';
import { CreateLearningSessionDto } from '../../application/dtos/create-learning-session.dto';
import { JwtAuthGuard } from '../../infrastructure/auth/jwt-auth.guard';

@Controller('learning')
@UseGuards(JwtAuthGuard) // Protect all learning routes
export class LearningController {
    constructor(private readonly learningService: LearningService) { }

    @Post('complete')
    async complete(@Body() dto: CreateLearningSessionDto) {
        return this.learningService.completeSession(dto);
    }

    @Get('daily-completions')
    async getDailyCompletions(@Query('userId') userId: string) {
        return this.learningService.getTodayCompletions(userId);
    }

    @Get('completion-time')
    async getCompletionTime(
        @Query('userId') userId: string,
        @Query('levelId') levelId?: string
    ) {
        return this.learningService.getExerciseCompletionTime(userId, levelId);
    }
}
