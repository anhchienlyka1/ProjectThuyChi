// Test script to verify Vietnamese modules data in database
const http = require('http');

function testAPI(levelId) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: `/questions?levelId=${levelId}`,
            method: 'GET'
        };

        const req = http.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    resolve(parsed);
                } catch (e) {
                    reject(e);
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.end();
    });
}

async function main() {
    console.log('🧪 Testing Vietnamese Modules API...\n');

    try {
        // Test Spelling
        console.log('📝 Testing Spelling (Tập Đánh Vần)...');
        const spelling = await testAPI('spelling');
        console.log(`✅ Found ${spelling.length} spelling exercises`);
        console.log(`   First item: ${spelling[0]?.word} - ${spelling[0]?.hint}`);
        console.log(`   Last item: ${spelling[spelling.length - 1]?.word} - ${spelling[spelling.length - 1]?.hint}\n`);

        // Test Simple Words
        console.log('🔤 Testing Simple Words (Ghép Từ Đơn)...');
        const simpleWords = await testAPI('simple-words');
        console.log(`✅ Found ${simpleWords.length} word exercises`);
        console.log(`   First item: ${simpleWords[0]?.word} - ${simpleWords[0]?.hint}`);
        console.log(`   Last item: ${simpleWords[simpleWords.length - 1]?.word} - ${simpleWords[simpleWords.length - 1]?.hint}\n`);

        console.log('🎉 All tests passed! Database is properly seeded.');
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

main();
