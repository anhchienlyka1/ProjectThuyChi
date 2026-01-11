// Test script để tạo dữ liệu hoàn thành cho badges
// Chạy: node test-create-completion.js

const http = require('http');

const createCompletion = (levelId, score, total) => {
    const data = JSON.stringify({
        userId: 'demo-user-id',
        levelId: levelId,
        score: score,
        totalQuestions: total,
        durationSeconds: 120,
        answers: []
    });

    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/learning/complete',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let responseData = '';

            res.on('data', (chunk) => {
                responseData += chunk;
            });

            res.on('end', () => {
                console.log(`✅ Created completion for ${levelId}:`, responseData);
                resolve(JSON.parse(responseData));
            });
        });

        req.on('error', (error) => {
            console.error(`❌ Error for ${levelId}:`, error.message);
            reject(error);
        });

        req.write(data);
        req.end();
    });
};

// Tạo dữ liệu test
async function createTestData() {
    console.log('🚀 Creating test completion data...\n');

    try {
        // Tạo 3 lần hoàn thành cho level-1 (Phép Cộng)
        console.log('📝 Creating completions for level-1 (3 times)...');
        await createCompletion('level-1', 9, 10);
        await new Promise(resolve => setTimeout(resolve, 500));
        await createCompletion('level-1', 8, 10);
        await new Promise(resolve => setTimeout(resolve, 500));
        await createCompletion('level-1', 10, 10);

        // Tạo 1 lần hoàn thành cho level-2 (So Sánh)
        console.log('\n📝 Creating completion for level-2 (1 time)...');
        await createCompletion('level-2', 7, 10);

        // Tạo 2 lần hoàn thành cho level-3 (Phép Trừ)
        console.log('\n📝 Creating completions for level-3 (2 times)...');
        await createCompletion('level-3', 8, 10);
        await new Promise(resolve => setTimeout(resolve, 500));
        await createCompletion('level-3', 9, 10);

        console.log('\n✅ Test data created successfully!');
        console.log('\n📊 Expected badges:');
        console.log('   - level-1: ✓ badge + 🔥 3x badge');
        console.log('   - level-2: ✓ badge + 🔥 1x badge');
        console.log('   - level-3: ✓ badge + 🔥 2x badge');
        console.log('\n🔄 Reload the app to see the badges!');
        console.log('   URL: http://192.168.31.77:4200/');

    } catch (error) {
        console.error('\n❌ Failed to create test data:', error.message);
        console.log('\n💡 Make sure the backend is running:');
        console.log('   cd BE');
        console.log('   npm run start:dev');
    }
}

createTestData();
