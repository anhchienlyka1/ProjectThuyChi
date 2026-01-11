import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from '../presentation/controllers/dashboard.controller';
import { DashboardService } from '../application/services/dashboard.service';
import { LearningSessionSchema } from '../infrastructure/database/schemas/learning-session.schema';
import { UserProgressSchema } from '../infrastructure/database/schemas/user-progress.schema';
import { UserAchievementSchema } from '../infrastructure/database/schemas/user-achievement.schema';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            LearningSessionSchema,
            UserProgressSchema,
            UserAchievementSchema
        ])
    ],
    controllers: [DashboardController],
    providers: [DashboardService],
})
export class DashboardModule { }
