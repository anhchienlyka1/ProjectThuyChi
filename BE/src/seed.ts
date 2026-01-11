import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { UserSchema } from './infrastructure/database/schemas/user.schema';

dotenv.config();

const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '123456@@',
    database: process.env.DB_NAME || 'ThuychiDatabase',
    entities: [UserSchema],
    synchronize: true, // Use carefully in production
    logging: false,
});

async function seed() {
    try {
        await AppDataSource.initialize();
        console.log('Database connected for seeding...');

        const userRepo = AppDataSource.getRepository(UserSchema);

        // 0. Cleanup invalid users (empty pin) to allow Unique Constraint later
        console.log('Cleaning up invalid users...');
        await userRepo.query(`DELETE FROM users WHERE pin_code IS NULL OR pin_code = ''`);

        // 1. Create Parent
        console.log('Creating Parent...');
        const parentEmail = 'parent@example.com';
        let parent = await userRepo.findOne({ where: { email: parentEmail } });

        if (!parent) {
            parent = userRepo.create({
                email: parentEmail,
                name: 'Phụ huynh Test',
                pinCode: '999999', // Unique PIN for Parent
                role: 'parent',
                gender: 'male',
            });
            await userRepo.save(parent);
            console.log(`Parent created [${parent.id}]`);
        } else {
            // Update existing parent to have correct pin/pass/role
            parent.pinCode = '999999';
            parent.role = 'parent';
            await userRepo.save(parent);
            console.log(`Parent updated [${parent.id}]`);
        }

        // 2. Create Children
        const childrenData = [
            { email: 'thuychi@example.com', name: 'Bé Thủy Chi', gender: 'female', pin: '111111' },
            { email: 'subin@example.com', name: 'Bé Su Bin', gender: 'male', pin: '222222' },
            { email: 'bong@example.com', name: 'Bé Bông', gender: 'female', pin: '333333' },
        ];

        for (const child of childrenData) {
            let childUser = await userRepo.findOne({ where: { email: child.email } });

            if (!childUser) {
                childUser = userRepo.create({
                    email: child.email,
                    name: child.name,
                    pinCode: child.pin,
                    role: 'student',
                    gender: child.gender,
                    parentId: parent.id
                });
                await userRepo.save(childUser);
                console.log(`Child created: ${child.name}`);
            } else {
                // Link child to parent and ensure pin
                childUser.parentId = parent.id;
                childUser.pinCode = child.pin;
                childUser.role = 'student';
                await userRepo.save(childUser);
                console.log(`Child updated and linked to parent: ${child.name}`);
            }
        }

        console.log('Seeding completed successfully!');
    } catch (error) {
        console.error('Error during seeding:', error);
    } finally {
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
        }
    }
}

seed();
