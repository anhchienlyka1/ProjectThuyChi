import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { LearningService } from '../../application/services/learning.service';
import { CreateLearningSessionDto } from '../../application/dtos/create-learning-session.dto';

@Controller('learning')
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
