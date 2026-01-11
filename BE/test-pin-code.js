/**
 * Test script để demo tính năng mã PIN
 * Chạy: node test-pin-code.js
 */

const BASE_URL = 'http://localhost:3000';

// Helper function để gọi API
async function apiCall(method, endpoint, body = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, options);
        const data = await response.json();

        console.log(`\n${method} ${endpoint}`);
        console.log('Status:', response.status);
        console.log('Response:', JSON.stringify(data, null, 2));

        return { status: response.status, data };
    } catch (error) {
        console.error('Error:', error.message);
        return null;
    }
}

async function testPinCodeFeature() {
    console.log('=== TEST TÍNH NĂNG MÃ PIN ===\n');

    // 1. Tạo user mới
    console.log('\n--- 1. Tạo user mới ---');
    const createUserResult = await apiCall('POST', '/users', {
        email: `test${Date.now()}@example.com`,
        name: 'Test User PIN'
    });

    if (!createUserResult || createUserResult.status !== 201) {
        console.error('❌ Không thể tạo user');
        return;
    }

    const userId = createUserResult.data.id;
    console.log('✅ User đã được tạo với ID:', userId);

    // 2. Set mã PIN hợp lệ
    console.log('\n--- 2. Set mã PIN hợp lệ (123456) ---');
    const setPinResult = await apiCall('PUT', `/users/${userId}/pin`, {
        pinCode: '123456'
    });

    if (setPinResult && setPinResult.status === 200) {
        console.log('✅ Mã PIN đã được set thành công');
    } else {
        console.log('❌ Không thể set mã PIN');
    }

    // 3. Test với mã PIN không hợp lệ (chỉ 5 số)
    console.log('\n--- 3. Test mã PIN không hợp lệ (12345 - chỉ 5 số) ---');
    const invalidPin1 = await apiCall('PUT', `/users/${userId}/pin`, {
        pinCode: '12345'
    });

    if (invalidPin1 && invalidPin1.status === 400) {
        console.log('✅ Validation hoạt động đúng - từ chối mã PIN 5 số');
    } else {
        console.log('❌ Validation không hoạt động đúng');
    }

    // 4. Test với mã PIN có chữ cái
    console.log('\n--- 4. Test mã PIN có chữ cái (12345a) ---');
    const invalidPin2 = await apiCall('PUT', `/users/${userId}/pin`, {
        pinCode: '12345a'
    });

    if (invalidPin2 && invalidPin2.status === 400) {
        console.log('✅ Validation hoạt động đúng - từ chối mã PIN có chữ cái');
    } else {
        console.log('❌ Validation không hoạt động đúng');
    }

    // 5. Test với mã PIN 7 số
    console.log('\n--- 5. Test mã PIN 7 số (1234567) ---');
    const invalidPin3 = await apiCall('PUT', `/users/${userId}/pin`, {
        pinCode: '1234567'
    });

    if (invalidPin3 && invalidPin3.status === 400) {
        console.log('✅ Validation hoạt động đúng - từ chối mã PIN 7 số');
    } else {
        console.log('❌ Validation không hoạt động đúng');
    }

    // 6. Update lại mã PIN với giá trị khác
    console.log('\n--- 6. Update mã PIN sang 999999 ---');
    const updatePinResult = await apiCall('PUT', `/users/${userId}/pin`, {
        pinCode: '999999'
    });

    if (updatePinResult && updatePinResult.status === 200) {
        console.log('✅ Mã PIN đã được update thành công');
    } else {
        console.log('❌ Không thể update mã PIN');
    }

    // 7. Get user để verify (nếu có endpoint)
    console.log('\n--- 7. Get user để verify ---');
    const getUserResult = await apiCall('GET', `/users/${userId}`);

    if (getUserResult && getUserResult.status === 200) {
        console.log('✅ User data:', getUserResult.data);
    }

    console.log('\n=== KẾT THÚC TEST ===\n');
}

// Chạy test
testPinCodeFeature().catch(console.error);
