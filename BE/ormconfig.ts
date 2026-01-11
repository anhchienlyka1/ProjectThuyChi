import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { UserSchema } from './src/infrastructure/database/schemas/user.schema';
import { SubjectSchema } from './src/infrastructure/database/schemas/subject.schema';
import { LevelSchema } from './src/infrastructure/database/schemas/level.schema';
import { QuestionSchema } from './src/infrastructure/database/schemas/question.schema';
import { UserProgressSchema } from './src/infrastructure/database/schemas/user-progress.schema';
import { LearningSessionSchema } from './src/infrastructure/database/schemas/learning-session.schema';
import { QuestionAttemptSchema } from './src/infrastructure/database/schemas/question-attempt.schema';
import { AchievementSchema } from './src/infrastructure/database/schemas/achievement.schema';
import { UserAchievementSchema } from './src/infrastructure/database/schemas/user-achievement.schema';
import { UserSettingsSchema } from './src/infrastructure/database/schemas/user-settings.schema';
import { NotificationSchema } from './src/infrastructure/database/schemas/notification.schema';
import { ParentGateAttemptSchema } from './src/infrastructure/database/schemas/parent-gate-attempt.schema';
import { MascotMessageSchema } from './src/infrastructure/database/schemas/mascot-message.schema';

dotenv.config();

export default new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ThuychiDatabase',
    entities: [
        UserSchema,
        SubjectSchema,
        LevelSchema,
        QuestionSchema,
        UserProgressSchema,
        LearningSessionSchema,
        QuestionAttemptSchema,
        AchievementSchema,
        UserAchievementSchema,
        UserSettingsSchema,
        NotificationSchema,
        ParentGateAttemptSchema,
        MascotMessageSchema
    ],
    migrations: ['src/infrastructure/database/migrations/*.ts'],
    synchronize: false,
});
