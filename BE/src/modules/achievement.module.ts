import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AchievementService } from '../application/services/achievement.service';
import { AchievementSchema } from '../infrastructure/database/schemas/achievement.schema';
import { UserAchievementSchema } from '../infrastructure/database/schemas/user-achievement.schema';
import { LevelSchema } from '../infrastructure/database/schemas/level.schema';
import { UserProgressSchema } from '../infrastructure/database/schemas/user-progress.schema';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            AchievementSchema,
            UserAchievementSchema,
            LevelSchema,
            UserProgressSchema
        ])
    ],
    providers: [AchievementService],
    exports: [AchievementService]
})
export class AchievementModule { }
