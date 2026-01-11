require('dotenv').config();
const mysql = require('mysql2/promise');

async function testConnection() {
    console.log('--- Database Connection Test (Debug Mode) ---');

    const host = process.env.DB_HOST || 'localhost';
    const user = process.env.DB_USERNAME || 'root';
    const password = process.env.DB_PASSWORD || '';
    const database = process.env.DB_NAME || 'thuychi_db';

    console.log(`Host: [${host}]`);
    console.log(`User: [${user}]`);
    console.log(`Password Length: ${password.length}`);
    if (password.length > 0) {
        console.log(`Password First Char: '${password[0]}'`);
        console.log(`Password Last Char: '${password[password.length - 1]}'`);
        console.log(`(Nếu có khoảng trắng ở đầu hoặc cuối, hãy xóa chúng trong file .env)`);
    } else {
        console.log(`Password is EMPTY (Rỗng). Nếu MySQL của bạn có pass, hãy điền vào .env`);
    }
    console.log(`Database: [${database}]`);

    try {
        console.log('\nĐang thử kết nối...');
        // Thử kết nối không cần database trước để kiểm tra User/Pass
        const connection = await mysql.createConnection({
            host,
            port: parseInt(process.env.DB_PORT) || 3306,
            user,
            password,
        });

        console.log('✅ ĐĂNG NHẬP THÀNH CÔNG! (User/Pass đúng)');

        // Kiểm tra database có tồn tại không
        try {
            await connection.query(`USE \`${database}\``);
            console.log(`✅ DATABASE '${database}' TỒN TẠI!`);
        } catch (err) {
            console.log(`⚠️ DATABASE '${database}' CHƯA TỒN TẠI.`);
            console.log(`   Đang thử tạo database '${database}'...`);
            try {
                await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
                console.log(`✅ Đã tạo database '${database}' thành công!`);
            } catch (createErr) {
                console.error(`❌ Không thể tạo database: ${createErr.message}`);
            }
        }

        await connection.end();
    } catch (error) {
        console.error('❌ KẾT NỐI THẤT BẠI:');
        console.error(`Code: ${error.code}`);
        console.error(`Message: ${error.message}`);

        if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.log('\n>>> LỜI KHUYÊN: Mật khẩu hoặc Username sai.');
            console.log('1. Kiểm tra xem có khoảng trắng thừa trong file .env không.');
            console.log('2. Đảm bảo bạn đang dùng đúng mật khẩu cho user "root".');
            console.log('3. Nếu mật khẩu có ký tự đặc biệt (#, @...), hãy bao quanh bằng dấu ngoặc kép "..."');
        }
    }
}

testConnection();
