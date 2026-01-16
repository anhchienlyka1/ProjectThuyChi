import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from '../presentation/controllers/dashboard.controller';
import { DashboardService } from '../application/services/dashboard.service';
import { LearningSessionSchema } from '../infrastructure/database/schemas/learning-session.schema';
import { UserProgressSchema } from '../infrastructure/database/schemas/user-progress.schema';
import { UserAchievementSchema } from '../infrastructure/database/schemas/user-achievement.schema';
import { SubjectSchema } from '../infrastructure/database/schemas/subject.schema';
import { LevelSchema } from '../infrastructure/database/schemas/level.schema';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            LearningSessionSchema,
            UserProgressSchema,
            UserAchievementSchema,
            SubjectSchema,
            LevelSchema
        ])
    ],
    controllers: [DashboardController],
    providers: [DashboardService],
})
export class DashboardModule { }
