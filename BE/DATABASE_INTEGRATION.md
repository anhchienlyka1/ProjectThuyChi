# Hướng dẫn tích hợp Database với TypeORM

## 📦 Cài đặt dependencies

```bash
# PostgreSQL
npm install @nestjs/typeorm typeorm pg

# MySQL
npm install @nestjs/typeorm typeorm mysql2

# MongoDB
npm install @nestjs/mongoose mongoose
```

## ⚙️ Cấu hình TypeORM

### 1. Tạo file cấu hình database

```typescript
// src/infrastructure/config/database.config.ts
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'mydb',
  entities: [__dirname + '/../database/schemas/**/*.schema{.ts,.js}'],
  synchronize: process.env.NODE_ENV === 'development', // Chỉ dùng trong dev
  logging: process.env.NODE_ENV === 'development',
};
```

### 2. Tạo file .env

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=your_database

# Application
NODE_ENV=development
PORT=3000
```

### 3. Cài đặt config module

```bash
npm install @nestjs/config
```

### 4. Cập nhật app.module.ts

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER } from '@nestjs/core';
import { databaseConfig } from './infrastructure/config/database.config';
import { UserModule } from './modules/user.module';
import { AllExceptionsFilter } from './shared/exceptions/all-exceptions.filter';

@Module({
  imports: [
    // Config Module
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // TypeORM Module
    TypeOrmModule.forRoot(databaseConfig),

    // Feature Modules
    UserModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
```

### 5. Cập nhật user.module.ts

```typescript
// src/modules/user.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from '../presentation/controllers/user.controller';
import { CreateUserUseCase } from '../application/use-cases/create-user.use-case';
import { GetUserByIdUseCase } from '../application/use-cases/get-user-by-id.use-case';
import { UpdateUserUseCase } from '../application/use-cases/update-user.use-case';
import { TypeORMUserRepository } from '../infrastructure/repositories/typeorm-user.repository';
import { UserSchema } from '../infrastructure/database/schemas/user.schema';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserSchema]), // Đăng ký entity
  ],
  controllers: [UserController],
  providers: [
    // Use Cases
    CreateUserUseCase,
    GetUserByIdUseCase,
    UpdateUserUseCase,

    // Repository Implementation - Đổi từ InMemory sang TypeORM
    {
      provide: 'IUserRepository',
      useClass: TypeORMUserRepository, // Thay InMemoryUserRepository
    },
  ],
  exports: [CreateUserUseCase, GetUserByIdUseCase, UpdateUserUseCase],
})
export class UserModule {}
```

## 🗄️ Migrations (Khuyến nghị cho Production)

### 1. Tạo file ormconfig.ts

```typescript
// ormconfig.ts (root directory)
import { DataSource } from 'typeorm';
import { UserSchema } from './src/infrastructure/database/schemas/user.schema';

export default new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'password',
  database: 'mydb',
  entities: [UserSchema],
  migrations: ['src/infrastructure/database/migrations/*.ts'],
  synchronize: false, // Tắt synchronize khi dùng migrations
});
```

### 2. Thêm scripts vào package.json

```json
{
  "scripts": {
    "migration:generate": "typeorm-ts-node-commonjs migration:generate -d ormconfig.ts",
    "migration:run": "typeorm-ts-node-commonjs migration:run -d ormconfig.ts",
    "migration:revert": "typeorm-ts-node-commonjs migration:revert -d ormconfig.ts"
  }
}
```

### 3. Tạo migration

```bash
npm run migration:generate -- src/infrastructure/database/migrations/CreateUserTable
```

### 4. Chạy migration

```bash
npm run migration:run
```

## 🐳 Docker Compose (Optional)

Tạo file `docker-compose.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: postgres_db
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: mydb
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

Chạy database:

```bash
docker-compose up -d
```

## 🧪 Testing với Database

### 1. Tạo test database config

```typescript
// src/infrastructure/config/database-test.config.ts
export const testDatabaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'password',
  database: 'mydb_test',
  entities: [__dirname + '/../database/schemas/**/*.schema{.ts,.js}'],
  synchronize: true,
  dropSchema: true, // Reset database mỗi lần test
  logging: false,
};
```

### 2. Setup test module

```typescript
// test/setup.ts
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { testDatabaseConfig } from '../src/infrastructure/config/database-test.config';

export async function createTestingModule() {
  return await Test.createTestingModule({
    imports: [
      TypeOrmModule.forRoot(testDatabaseConfig),
      // ... other modules
    ],
  }).compile();
}
```

## 📝 Lưu ý quan trọng

1. **Không dùng `synchronize: true` trong production** - Dùng migrations thay thế
2. **Luôn validate environment variables** - Dùng class-validator
3. **Connection pooling** - TypeORM tự động quản lý
4. **Transactions** - Sử dụng `@Transaction()` decorator khi cần
5. **Indexes** - Thêm indexes cho các trường thường query

## 🔄 Chuyển đổi từ InMemory sang Database

Bạn chỉ cần thay đổi 1 dòng trong `user.module.ts`:

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

**Không cần thay đổi gì khác!** Đây chính là sức mạnh của Clean Architecture.
