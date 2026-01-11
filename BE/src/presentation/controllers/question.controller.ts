import { Controller, Get, Post, Put, Delete, Body, Param, Query, NotFoundException } from '@nestjs/common';
import { QuestionService } from '../../application/services/question.service';

@Controller('questions')
export class QuestionController {
    constructor(private readonly questionService: QuestionService) { }

    @Get()
    async getQuestions(@Query('levelId') levelId: string) {
        if (!levelId) {
            throw new NotFoundException('Level ID is required');
        }
        const content = await this.questionService.findByLevelId(levelId);
        // Note: We don't throw 404 if content is null, maybe return empty?
        // Service returns null if 0 items.
        if (!content) {
            // For "list" based views, empty array is better than 404.
            // But existing logic threw 404. Let's keep it safe.
            // Actually, if I add a new level, it has 0 questions initially.
            // Returning [] is better.
            return [];
        }
        return content;
    }

    @Post()
    async createQuestion(@Body() body: { levelId: string, content: any, type: string }) {
        return this.questionService.create(body.levelId, body.content, body.type);
    }

    @Put(':id')
    async updateQuestion(@Param('id') id: string, @Body() body: { content: any }) {
        return this.questionService.update(+id, body.content);
    }

    @Delete(':id')
    async deleteQuestion(@Param('id') id: string) {
        return this.questionService.delete(+id);
    }
}
