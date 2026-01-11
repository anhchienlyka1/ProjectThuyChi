import { Controller, Get, Query } from '@nestjs/common';
import { LevelService } from '../../application/services/level.service';

@Controller('levels')
export class LevelController {
    constructor(private readonly levelService: LevelService) { }

    @Get()
    async getLevels(
        @Query('subjectId') subjectId: string,
        @Query('userId') userId: string
    ) {
        if (!subjectId) {
            // Default to math if not provided, just for safety
            subjectId = 'math';
        }
        return this.levelService.findBySubject(subjectId, userId);
    }
}
