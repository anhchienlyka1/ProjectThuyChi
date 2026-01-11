# 🗄️ Database Setup Guide

## Cài đặt đã hoàn thành ✅

1. ✅ Đã cài đặt dependencies: `@nestjs/typeorm`, `typeorm`, `pg`, `@nestjs/config`
2. ✅ Đã tạo file cấu hình: `src/infrastructure/config/database.config.ts`
3. ✅ Đã cập nhật `app.module.ts` với ConfigModule và TypeOrmModule
4. ✅ Đã cập nhật `user.module.ts` để đăng ký UserSchema entity
5. ✅ Đã tạo `docker-compose.yml` để chạy PostgreSQL

## 🚀 Các bước tiếp theo

### 1. Tạo file .env

Copy file `.env.example` thành `.env` và cập nhật thông tin:

```bash
cp .env.example .env
```

Sau đó chỉnh sửa file `.env`:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=thuychi_db

# Application
NODE_ENV=development
PORT=3000
```

### 2. Cài đặt MySQL Database

Bạn cần cài đặt và chạy MySQL trên máy tính của mình (hoặc dùng XAMPP/WAMP/Docker).

- Download MySQL: <https://dev.mysql.com/downloads/installer/>
- Tạo database mới tên `thuychi_db`:

  ```sql
  CREATE DATABASE thuychi_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  ```

### 3. Cấu hình kết nối

Kiểm tra và cập nhật file `.env`:

```env
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root      <-- User của bạn (thường là root)
DB_PASSWORD=          <-- Mật khẩu của bạn (để trống nếu không có)
DB_NAME=thuychi_db    <-- Tên database bạn đã tạo
```

### 4. Tạo TypeORM Repository

Hiện tại đang dùng `InMemoryUserRepository`. Cần tạo `TypeORMUserRepository`:

```typescript
// src/infrastructure/repositories/typeorm-user.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { User } from '../../domain/entities/user.entity';
import { UserSchema } from '../database/schemas/user.schema';

@Injectable()
export class TypeORMUserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserSchema)
    private readonly userRepository: Repository<UserSchema>,
  ) {}

  async create(user: User): Promise<User> {
    const userSchema = this.userRepository.create({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
    
    const saved = await this.userRepository.save(userSchema);
    return this.toDomain(saved);
  }

  async findById(id: string): Promise<User | null> {
    const userSchema = await this.userRepository.findOne({ where: { id } });
    return userSchema ? this.toDomain(userSchema) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const userSchema = await this.userRepository.findOne({ where: { email } });
    return userSchema ? this.toDomain(userSchema) : null;
  }

  async update(user: User): Promise<User> {
    await this.userRepository.update(user.id, {
      name: user.name,
      email: user.email,
      updatedAt: user.updatedAt,
    });
    
    const updated = await this.userRepository.findOne({ where: { id: user.id } });
    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

  private toDomain(schema: UserSchema): User {
    return new User(
      schema.id,
      schema.name,
      schema.email,
      schema.createdAt,
      schema.updatedAt,
    );
  }
}
```

### 4. Chuyển từ InMemory sang TypeORM Repository

Trong `src/modules/user.module.ts`, thay đổi:

```typescript
// Trước
{
  provide: 'IUserRepository',
  useClass: InMemoryUserRepository,
}

// Sau
{
  provide: 'IUserRepository',
  useClass: TypeORMUserRepository,
}
```

### 5. Chạy ứng dụng

```bash
npm run start:dev
```

Ứng dụng sẽ tự động tạo bảng trong database (vì `synchronize: true` trong development).

## 🔍 Kiểm tra kết nối

Khi chạy ứng dụng, bạn sẽ thấy logs như:

```
[TypeOrmModule] Successfully connected to the database
```

## 📝 Lưu ý quan trọng

1. **synchronize: true** chỉ dùng trong development. Trong production, dùng migrations.
2. Cần tạo file `.env` từ `.env.example` (file `.env` không được commit vào git).
3. Đảm bảo PostgreSQL đang chạy trước khi start ứng dụng.
4. Nếu dùng Docker, chạy `docker-compose up -d` trước.

## 🐛 Troubleshooting

### Lỗi: "Connection refused"

- Kiểm tra PostgreSQL đã chạy chưa
- Kiểm tra port 5432 có bị chiếm không
- Kiểm tra thông tin trong `.env` có đúng không

### Lỗi: "Database does not exist"

- Tạo database bằng lệnh: `CREATE DATABASE thuychi_db;`
- Hoặc dùng Docker Compose (đã tự động tạo)

### Lỗi: "Authentication failed"

- Kiểm tra username/password trong `.env`
- Kiểm tra PostgreSQL user có quyền truy cập không
