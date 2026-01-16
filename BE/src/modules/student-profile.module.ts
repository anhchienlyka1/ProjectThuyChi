import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentProfileController } from '../presentation/controllers/student-profile.controller';
import { StudentProfileService } from '../application/services/student-profile.service';
import { UserSchema } from '../infrastructure/database/schemas/user.schema';
import { UserProgressSchema } from '../infrastructure/database/schemas/user-progress.schema';
import { LearningSessionSchema } from '../infrastructure/database/schemas/learning-session.schema';
import { UserAchievementSchema } from '../infrastructure/database/schemas/user-achievement.schema';
import { AchievementSchema } from '../infrastructure/database/schemas/achievement.schema';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            UserSchema,
            UserProgressSchema,
            LearningSessionSchema,
            UserAchievementSchema,
            AchievementSchema
        ])
    ],
    controllers: [StudentProfileController],
    providers: [StudentProfileService],
    exports: [StudentProfileService]
})
export class StudentProfileModule { }
