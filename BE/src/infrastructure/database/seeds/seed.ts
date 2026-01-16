import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Entities
import { SubjectSchema } from '../schemas/subject.schema';
import { LevelSchema } from '../schemas/level.schema';
import { QuestionSchema } from '../schemas/question.schema';
import { AchievementSchema } from '../schemas/achievement.schema';
import { MascotMessageSchema } from '../schemas/mascot-message.schema';
import { UserSchema } from '../schemas/user.schema';
import { UserSettingsSchema } from '../schemas/user-settings.schema';
import { UserProgressSchema } from '../schemas/user-progress.schema';
import { LearningSessionSchema } from '../schemas/learning-session.schema';
import { UserAchievementSchema } from '../schemas/user-achievement.schema';
import { NotificationSchema } from '../schemas/notification.schema';

async function seed() {
    // Load .env from BE root
    const beRoot = path.resolve(__dirname, '../../../../');
    dotenv.config({ path: path.join(beRoot, '.env') });

    console.log('--- 🌱 Seeding Database ---');
    console.log(`Connecting to MySQL at ${process.env.DB_HOST}:${process.env.DB_PORT || 3306}, DB: ${process.env.DB_NAME}...`);

    const dataSource = new DataSource({
        type: 'mysql',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '3306'),
        username: process.env.DB_USERNAME || 'root',
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME || 'ThuychiDatabase',
        entities: [
            SubjectSchema,
            LevelSchema,
            QuestionSchema,
            MascotMessageSchema,
            AchievementSchema,
            UserSchema,
            UserSettingsSchema,
            UserProgressSchema,
            LearningSessionSchema,
            UserAchievementSchema,
            NotificationSchema
        ],
        synchronize: true,
    });

    try {
        await dataSource.initialize();
        console.log('✅ Connected!');

        const subjectRepo = dataSource.getRepository(SubjectSchema);
        const levelRepo = dataSource.getRepository(LevelSchema);
        const questionRepo = dataSource.getRepository(QuestionSchema);

        // Path to seed data (moved from FE)
        const feDataPath = path.resolve(__dirname, 'data');
        console.log(`Reading data from: ${feDataPath}`);


        // 0. Clean old data (Optional, handle foreign keys carefully)
        // await questionRepo.delete({});
        // await levelRepo.delete({});
        // await subjectRepo.delete({});
        // console.log('🧹 Cleaned old data.');

        // 1. Seed Subjects
        console.log('Processing Subjects...');
        const subjectsData = JSON.parse(fs.readFileSync(path.join(feDataPath, 'subjects.json'), 'utf8'));

        for (const s of subjectsData) {
            // Check if exists
            const exists = await subjectRepo.findOne({ where: { id: s.id } });
            if (exists) {
                // Update
                await subjectRepo.update(s.id, {
                    title: s.title,
                    icon: s.icon,
                    themeConfig: { color: s.color, gradient: s.gradient },
                    active: true
                });
            } else {
                // Create
                const subject = subjectRepo.create({
                    id: s.id,
                    title: s.title,
                    icon: s.icon,
                    themeConfig: { color: s.color, gradient: s.gradient },
                    active: true,
                    description: s.title
                });
                await subjectRepo.save(subject);
            }
        }
        console.log(`✅ Seeded ${subjectsData.length} subjects.`);

        // 2. Seed Levels (Math)
        console.log('Processing Math Levels...');
        const mathLevelsData = JSON.parse(fs.readFileSync(path.join(feDataPath, 'math-levels.json'), 'utf8'));

        for (const l of mathLevelsData) {
            const levelId = l.id;
            const subjectId = 'math';

            // Insert/Update Level
            let level = await levelRepo.findOne({ where: { id: levelId } });
            if (!level) {
                level = levelRepo.create({
                    id: levelId,
                    subjectId,
                    title: l.title,
                    subtitle: l.subtitle,
                    icon: l.icon,
                    levelNumber: l.levelNumber,
                    route: l.route,
                    isFree: !l.isLocked,
                    uiConfig: { color: l.color, gradient: l.gradient }
                });
                await levelRepo.save(level);
            } else {
                await levelRepo.update(levelId, {
                    title: l.title,
                    levelNumber: l.levelNumber,
                    uiConfig: { color: l.color, gradient: l.gradient }
                });
            }

            // Seed Question Content
            let configFileName = '';
            switch (levelId) {
                case 'addition': configFileName = 'addition-config.json'; break;
                case 'subtraction': configFileName = 'subtraction-config.json'; break;

                case 'comparison': configFileName = 'comparison-config.json'; break;
                case 'fill-in-blank': configFileName = 'fill-in-blank-config.json'; break;
                case 'sorting': configFileName = 'sorting-config.json'; break;
            }

            if (configFileName) {
                const configPath = path.join(feDataPath, configFileName);
                if (fs.existsSync(configPath)) {
                    const configContent = JSON.parse(fs.readFileSync(configPath, 'utf8'));

                    // Check if question exists for this level
                    const qExists = await questionRepo.findOne({ where: { levelId } });
                    if (!qExists) {
                        const question = questionRepo.create({
                            levelId,
                            questionType: levelId,
                            content: configContent,
                            orderIndex: 1,
                            points: configContent.pointsPerQuestion || 10
                        });
                        await questionRepo.save(question);
                        console.log(`   + Created questions for ${levelId}`);
                    } else {
                        // Update content
                        await questionRepo.update(qExists.id, {
                            content: configContent
                        });
                        console.log(`   ~ Updated questions for ${levelId}`);
                    }
                } else {
                    console.warn(`   ⚠️ Missing config file: ${configFileName}`);
                }
            }
        }
        console.log(`✅ Seeded Math Levels.`);

        // 2b. Seed Levels (Vietnamese)
        console.log('Processing Vietnamese Levels...');
        const vietnameseLevelsData = JSON.parse(fs.readFileSync(path.join(feDataPath, 'vietnamese-levels.json'), 'utf8'));

        // Check if Vietnamese subject exists? It should be in subjects.json
        // But let's assume it is.

        for (const l of vietnameseLevelsData) {
            const levelId = l.id;
            const subjectId = 'vietnamese'; // Ensure this subject ID matches what is in subjects.json

            let level = await levelRepo.findOne({ where: { id: levelId } });
            if (!level) {
                level = levelRepo.create({
                    id: levelId,
                    subjectId,
                    title: l.title,
                    subtitle: l.subtitle,
                    icon: l.icon,
                    levelNumber: l.levelNumber,
                    route: l.route,
                    isFree: !l.isLocked,
                    uiConfig: { color: l.color, gradient: l.gradient }
                });
                await levelRepo.save(level);
            } else {
                // Update
                await levelRepo.update(levelId, {
                    title: l.title,
                    subtitle: l.subtitle,
                    uiConfig: { color: l.color, gradient: l.gradient }
                });
            }

            // Seed Vietnamese Question Content
            let vnConfigFileName = '';
            switch (levelId) {
                case 'spelling': vnConfigFileName = 'spelling-config.json'; break;
                case 'simple-words': vnConfigFileName = 'simple-words-config.json'; break;
            }

            if (vnConfigFileName) {
                const configPath = path.join(feDataPath, vnConfigFileName);
                if (fs.existsSync(configPath)) {
                    const configContent = JSON.parse(fs.readFileSync(configPath, 'utf8'));

                    // For Vietnamese, we store each item as a separate question
                    // Delete old questions for this level first
                    await questionRepo.delete({ levelId });

                    // Insert each item as a question
                    for (let i = 0; i < configContent.length; i++) {
                        const item = configContent[i];
                        const question = questionRepo.create({
                            levelId,
                            questionType: levelId,
                            content: item,
                            orderIndex: i + 1,
                            points: 10
                        });
                        await questionRepo.save(question);
                    }
                    console.log(`   + Created ${configContent.length} questions for ${levelId}`);
                } else {
                    console.warn(`   ⚠️ Missing config file: ${vnConfigFileName}`);
                }
            }
        }
        console.log(`✅ Seeded Vietnamese Levels.`);


        // 3. Seed Achievements
        console.log('Processing Achievements...');
        const achievementRepo = dataSource.getRepository(AchievementSchema);
        const achievementsList = [
            { achievementId: 'math-master-1', title: 'Thần Đồng Toán Học', description: 'Hoàn thành 10 bài toán điểm tuyệt đối', icon: '🏆', rarity: 'legendary', points: 100, category: 'learning' },
            { achievementId: 'week-streak-1', title: 'Chăm Chỉ', description: 'Học liên tiếp 7 ngày', icon: '🔥', rarity: 'epic', points: 50, category: 'streak' },
            { achievementId: 'first-steps', title: 'Khởi Đầu Mới', description: 'Hoàn thành bài học đầu tiên', icon: '🌱', rarity: 'common', points: 10, category: 'learning' },
            { achievementId: 'speed-racer', title: 'Tay Đua Tốc Độ', description: 'Hoàn thành bài học dưới 1 phút', icon: '🏎️', rarity: 'rare', points: 30, category: 'speed' },
            { achievementId: 'perfect-10', title: 'Điểm 10 Tròn Trĩnh', description: 'Đạt 100% chính xác trong 1 bài', icon: '💯', rarity: 'common', points: 20, category: 'perfect_score' },
            // Subject Completion Achievements (Phiếu Bé Ngoan)
            { achievementId: 'math-completion', title: 'Phiếu Bé Ngoan - Toán Học', description: 'Hoàn thành tất cả bài tập Toán Học', icon: '🎖️', rarity: 'epic', points: 100, category: 'subject_completion' },
            { achievementId: 'vietnamese-completion', title: 'Phiếu Bé Ngoan - Tiếng Việt', description: 'Hoàn thành tất cả bài tập Tiếng Việt', icon: '🎖️', rarity: 'epic', points: 100, category: 'subject_completion' },
            { achievementId: 'english-completion', title: 'Phiếu Bé Ngoan - Tiếng Anh', description: 'Hoàn thành tất cả bài tập Tiếng Anh', icon: '🎖️', rarity: 'epic', points: 100, category: 'subject_completion' },
        ];

        for (const a of achievementsList) {
            const exists = await achievementRepo.findOne({ where: { achievementId: a.achievementId } });
            if (!exists) {
                await achievementRepo.save(achievementRepo.create({ ...a, unlockCriteria: {}, active: true }));
            }
        }
        console.log(`✅ Seeded Achievements.`);

        // 4. Seed Mascot Messages
        console.log('Processing Mascot Messages...');
        const mascotRepo = dataSource.getRepository(MascotMessageSchema);
        const mascotMessages = [
            { triggerType: 'start', messageTemplate: 'Chào {name}! Sẵn sàng học bài nào!', priority: 10 },
            { triggerType: 'correct', messageTemplate: 'Giỏi quá! Đúng rồi nè!', priority: 10 },
            { triggerType: 'wrong', messageTemplate: 'Suýt đúng rồi, thử lại nhé!', priority: 10 },
            { triggerType: 'complete', messageTemplate: 'Hoan hô! Con đã hoàn thành bài học!', priority: 10 },
        ];
        for (const m of mascotMessages) {
            await mascotRepo.save(mascotRepo.create(m)); // Save simple for now, can perform check exists if needed
        }
        console.log(`✅ Seeded Mascot Messages.`);



        console.log('🎉 Seeding Completed Successfully! All tables populated.');
        await dataSource.destroy();

    } catch (err) {
        console.error('❌ Seeding Error:', err);
        process.exit(1);
    }
}

seed();
