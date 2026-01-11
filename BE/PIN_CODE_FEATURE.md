# Tính năng Mã PIN và Giới tính cho User

## Tổng quan

Đã thêm hai trường mới cho bảng `users`:

1. **Mã PIN** (6 chữ số) để tăng cường bảo mật tài khoản
2. **Giới tính** (male/female/other) để lưu thông tin giới tính của user

## Thay đổi Database

### Schema

- **Bảng**: `users`
- **Column mới 1**: `pin_code`
  - Type: `VARCHAR(6)`
  - Nullable: `true`
  - Mô tả: Mã PIN 6 chữ số để bảo vệ tài khoản

- **Column mới 2**: `gender`
  - Type: `VARCHAR(10)`
  - Nullable: `true`
  - Mô tả: Giới tính (male, female, other)

### Migration

File migration SQL đã được tạo tại: `BE/migrations/add-pin-code-to-users.sql`

Để chạy migration:

```sql
-- Nếu dùng PostgreSQL/MySQL
ALTER TABLE users 
ADD COLUMN pin_code VARCHAR(6) NULL;

ALTER TABLE users 
ADD COLUMN gender VARCHAR(10) NULL;
```

Hoặc nếu bạn đang dùng TypeORM với `synchronize: true` (development mode), bảng sẽ tự động được cập nhật khi chạy ứng dụng.

## Thay đổi Backend

### 1. Domain Entity (`user.entity.ts`)

Đã thêm:

- Thuộc tính `pinCode?: string`
- Method `isPinCodeValid(pin?: string): boolean` - Validate mã PIN
- Method `setPinCode(pin: string): void` - Cập nhật mã PIN
- Method `clearPinCode(): void` - Xóa mã PIN

### 2. Database Schema (`user.schema.ts`)

Đã thêm column:

```typescript
@Column({ name: 'pin_code', type: 'varchar', length: 6, nullable: true })
pinCode: string;
```

### 3. Repository (`typeorm-user.repository.ts`)

Đã cập nhật các methods:

- `create()` - Lưu pinCode khi tạo user mới
- `update()` - Cập nhật pinCode
- `toDomain()` - Map pinCode từ schema sang entity

### 4. DTO (`set-pin-code.dto.ts`)

DTO mới để validate input:

```typescript
export class SetPinCodeDto {
    @IsString()
    @Length(6, 6)
    @Matches(/^\d{6}$/)
    pinCode: string;
}
```

### 5. Use Case (`set-user-pin-code.use-case.ts`)

Use case mới để xử lý business logic cập nhật mã PIN.

### 6. Controller (`user.controller.ts`)

Endpoint mới:

- **PUT** `/users/:id/pin`
- Body: `{ "pinCode": "123456" }`
- Response: `{ "message": "Mã PIN đã được cập nhật thành công" }`

## API Usage

### Cập nhật mã PIN

```bash
curl -X PUT http://localhost:3000/users/{userId}/pin \
  -H "Content-Type: application/json" \
  -d '{"pinCode": "123456"}'
```

**Response thành công:**

```json
{
  "message": "Mã PIN đã được cập nhật thành công"
}
```

**Response lỗi (mã PIN không hợp lệ):**

```json
{
  "statusCode": 400,
  "message": "Mã PIN phải là 6 chữ số",
  "error": "Bad Request"
}
```

**Response lỗi (user không tồn tại):**

```json
{
  "statusCode": 404,
  "message": "User với ID {userId} không tồn tại",
  "error": "Not Found"
}
```

## Validation Rules

Mã PIN phải thỏa mãn các điều kiện sau:

1. ✅ Là chuỗi ký tự (string)
2. ✅ Có đúng 6 ký tự
3. ✅ Chỉ chứa chữ số (0-9)

Ví dụ mã PIN hợp lệ:

- `123456` ✅
- `000000` ✅
- `999999` ✅

Ví dụ mã PIN không hợp lệ:

- `12345` ❌ (chỉ 5 số)
- `1234567` ❌ (7 số)
- `12345a` ❌ (có chữ cái)
- `123 456` ❌ (có khoảng trắng)

## Testing

### Test với Postman/Thunder Client

1. **Tạo user mới** (nếu chưa có):

```json
POST http://localhost:3000/users
{
  "email": "test@example.com",
  "name": "Test User"
}
```

1. **Set mã PIN**:

```json
PUT http://localhost:3000/users/{userId}/pin
{
  "pinCode": "123456"
}
```

1. **Verify** - Get user để kiểm tra (nếu có endpoint get user):

```json
GET http://localhost:3000/users/{userId}
```

## Frontend Integration

Để tích hợp với frontend, bạn có thể tạo một service:

```typescript
// user.service.ts
async setUserPinCode(userId: string, pinCode: string): Promise<void> {
  const response = await this.http.put(
    `${this.apiUrl}/users/${userId}/pin`,
    { pinCode }
  ).toPromise();
  
  return response;
}
```

## Security Notes

⚠️ **Lưu ý bảo mật:**

1. Mã PIN hiện tại được lưu dưới dạng plain text trong database
2. Trong production, nên hash mã PIN trước khi lưu (sử dụng bcrypt)
3. Nên thêm rate limiting cho endpoint set PIN để tránh brute force
4. Có thể thêm tính năng "quên mã PIN" với xác thực qua email

## Next Steps

Các tính năng có thể mở rộng:

- [ ] Hash mã PIN trước khi lưu database
- [ ] Thêm endpoint verify PIN
- [ ] Thêm endpoint reset PIN (với xác thực email)
- [ ] Thêm rate limiting
- [ ] Thêm history log khi thay đổi PIN
- [ ] Thêm tính năng khóa tài khoản sau N lần nhập sai PIN
