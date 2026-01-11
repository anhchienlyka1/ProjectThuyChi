import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LevelController } from '../presentation/controllers/level.controller';
import { LevelService } from '../application/services/level.service';
import { LevelSchema } from '../infrastructure/database/schemas/level.schema';
import { UserProgressSchema } from '../infrastructure/database/schemas/user-progress.schema';
import { UserSchema } from '../infrastructure/database/schemas/user.schema';
import { QuestionController } from '../presentation/controllers/question.controller';
import { QuestionService } from '../application/services/question.service';
import { QuestionSchema } from '../infrastructure/database/schemas/question.schema';


@Module({
    imports: [
        TypeOrmModule.forFeature([LevelSchema, UserProgressSchema, UserSchema, QuestionSchema])
    ],
    controllers: [LevelController, QuestionController],
    providers: [LevelService, QuestionService],

})
export class LevelModule { }
