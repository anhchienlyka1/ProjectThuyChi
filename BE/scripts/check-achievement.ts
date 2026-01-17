import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { AchievementSchema } from '../src/infrastructure/database/schemas/achievement.schema';

async function checkAchievement() {
    // Load .env from BE root
    const beRoot = path.resolve(__dirname, '../');
    dotenv.config({ path: path.join(beRoot, '.env') });

    console.log('--- 🔍 Checking Achievement ---');
    console.log(`Connecting to MySQL at ${process.env.DB_HOST}:${process.env.DB_PORT || 3306}, DB: ${process.env.DB_NAME}...`);

    const dataSource = new DataSource({
        type: 'mysql',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '3306'),
        username: process.env.DB_USERNAME || 'root',
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME || 'ThuychiDatabase',
        entities: [AchievementSchema],
        synchronize: false,
    });

    try {
        await dataSource.initialize();
        console.log('✅ Connected!');

        const achievementRepo = dataSource.getRepository(AchievementSchema);

        // Check for improvement-certificate achievement
        const improvementAchievement = await achievementRepo.findOne({
            where: { achievementId: 'improvement-certificate' }
        });

        if (improvementAchievement) {
            console.log('✅ Achievement "improvement-certificate" exists:');
            console.log({
                id: improvementAchievement.id,
                achievementId: improvementAchievement.achievementId,
                title: improvementAchievement.title,
                description: improvementAchievement.description,
                icon: improvementAchievement.icon,
                active: improvementAchievement.active,
                isDeleted: improvementAchievement.isDeleted
            });
        } else {
            console.log('❌ Achievement "improvement-certificate" NOT FOUND!');
            console.log('Please run: npm run seed');
        }

        // List all achievements
        const allAchievements = await achievementRepo.find();
        console.log(`\n📋 Total achievements in database: ${allAchievements.length}`);
        allAchievements.forEach(a => {
            console.log(`  - ${a.achievementId}: ${a.title} (active: ${a.active})`);
        });

        await dataSource.destroy();
    } catch (err) {
        console.error('❌ Error:', err);
        process.exit(1);
    }
}

checkAchievement();
