import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LearningController } from '../presentation/controllers/learning.controller';
import { QuestionAttemptController } from '../presentation/controllers/question-attempt.controller';
import { LearningService } from '../application/services/learning.service';
import { QuestionAttemptService } from '../application/services/question-attempt.service';
import { LearningSessionSchema } from '../infrastructure/database/schemas/learning-session.schema';
import { UserProgressSchema } from '../infrastructure/database/schemas/user-progress.schema';
import { UserSchema } from '../infrastructure/database/schemas/user.schema';
import { QuestionAttemptSchema } from '../infrastructure/database/schemas/question-attempt.schema';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            LearningSessionSchema,
            UserProgressSchema,
            UserSchema,
            QuestionAttemptSchema
        ])
    ],
    controllers: [LearningController, QuestionAttemptController],
    providers: [LearningService, QuestionAttemptService],
    exports: [QuestionAttemptService]
})
export class LearningModule { }
