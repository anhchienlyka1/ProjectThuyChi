
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
    synchronize: false, // Don't sync, just check
    logging: false,
});

async function check() {
    try {
        await AppDataSource.initialize();
        const userRepo = AppDataSource.getRepository(UserSchema);

        const invalidUsers = await userRepo.query(`SELECT * FROM users WHERE pin_code IS NULL OR pin_code = ''`);
        console.log('Invalid users count:', invalidUsers.length);

        if (invalidUsers.length > 0) {
            console.log('Deleting invalid users...');
            await userRepo.query(`DELETE FROM users WHERE pin_code IS NULL OR pin_code = ''`);
            console.log('Deleted.');
        }

        const allUsers = await userRepo.find();
        console.log('--- All Users ---');
        allUsers.forEach(u => console.log(`${u.name} - Pin: ${u.pinCode}`));

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await AppDataSource.destroy();
    }
}

check();
