# Clean Architecture - Backend Project

## 📐 Tổng quan kiến trúc

Project này được xây dựng theo **Clean Architecture** (Kiến trúc sạch), giúp code dễ bảo trì, test và mở rộng.

## 🏗️ Cấu trúc thư mục

```
src/
├── domain/                    # Domain Layer - Entities & Interfaces
│   ├── entities/             # Business Entities
│   ├── value-objects/        # Value Objects
│   └── repositories/         # Repository Interfaces
│
├── application/              # Application Layer - Business Logic & Use Cases
│   ├── use-cases/           # Business Logic Implementation
│   ├── dtos/                # Data Transfer Objects
│   └── ports/               # Application Interfaces
│
├── infrastructure/           # Infrastructure Layer - External Services
│   ├── database/            # Database Configuration
│   ├── repositories/        # Repository Implementations
│   ├── config/              # App Configuration
│   └── external-services/   # Third-party Services
│
├── presentation/            # Presentation Layer - API
│   ├── controllers/         # REST Controllers
│   ├── guards/              # Authentication Guards
│   ├── filters/             # Exception Filters
│   └── interceptors/        # Request/Response Interceptors
│
├── shared/                  # Shared Layer - Common Code
│   ├── exceptions/          # Custom Exceptions
│   ├── interfaces/          # Shared Interfaces
│   ├── constants/           # Constants
│   └── utils/               # Utility Functions
│
└── modules/                 # NestJS Modules
    └── user.module.ts       # User Module
```

## 📚 Các Layer và trách nhiệm

### 1. Domain Layer (Lớp Domain)
- **Mục đích**: Chứa các Entities và Interfaces định nghĩa cấu trúc dữ liệu cốt lõi.
- **Thành phần**:
  - **Entities**: Đối tượng, cấu trúc dữ liệu (VD: User, Product)
  - **Value Objects**: Các giá trị bất biến
  - **Repository Interfaces**: Định nghĩa contract cho data access

### 2. Application Layer (Lớp Ứng dụng)
- **Mục đích**: **Chứa toàn bộ Business Logic**, xử lý nghiệp vụ, điều phối luồng dữ liệu.
- **Thành phần**:
  - **Use Cases**: Triển khai chi tiết logic nghiệp vụ (VD: tính toán, validation, flow)
  - **DTOs**: Validate và format dữ liệu input/output
  - **Ports**: Interfaces cho external services

### 3. Infrastructure Layer (Lớp Hạ tầng)
- **Mục đích**: Implement chi tiết kỹ thuật, kết nối với external services
- **Thành phần**:
  - **Repositories**: Implement repository interfaces
  - **Database**: ORM configuration (TypeORM, Prisma, etc.)
  - **External Services**: Email, SMS, Payment gateways

### 4. Presentation Layer (Lớp Trình bày)
- **Mục đích**: Xử lý HTTP requests/responses
- **Thành phần**:
  - **Controllers**: REST API endpoints
  - **Guards**: Authentication & Authorization
  - **Filters**: Exception handling
  - **Interceptors**: Request/Response transformation

## 🔄 Luồng dữ liệu (Data Flow)

```
Client Request
    ↓
Controller (Presentation)
    ↓
Use Case (Application)
    ↓
Repository Interface (Domain)
    ↓
Repository Implementation (Infrastructure)
    ↓
Database
```

## 🎯 Nguyên tắc Dependency Rule

**Quy tắc quan trọng**: Dependencies chỉ được point từ ngoài vào trong:

```
Presentation → Application → Domain
Infrastructure → Domain
```

- **Domain Layer**: Không phụ thuộc vào layer nào khác
- **Application Layer**: Chỉ phụ thuộc vào Domain
- **Infrastructure & Presentation**: Phụ thuộc vào Application và Domain

## 📝 Ví dụ: User Module

### 1. Tạo Entity (Domain)
```typescript
// domain/entities/user.entity.ts
export class User {
  constructor(
    public readonly id: string,
    public email: string,
    public name: string,
  ) {}

  updateProfile(name: string): void {
    this.name = name;
  }
}
```

### 2. Định nghĩa Repository Interface (Domain)
```typescript
// domain/repositories/user.repository.interface.ts
export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  create(user: User): Promise<User>;
}
```

### 3. Tạo Use Case (Application)
```typescript
// application/use-cases/create-user.use-case.ts
@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(dto: CreateUserDto): Promise<UserResponseDto> {
    const user = new User(uuid(), dto.email, dto.name);
    const savedUser = await this.userRepository.create(user);
    return new UserResponseDto(savedUser);
  }
}
```

### 4. Implement Repository (Infrastructure)
```typescript
// infrastructure/repositories/in-memory-user.repository.ts
@Injectable()
export class InMemoryUserRepository implements IUserRepository {
  private users: User[] = [];

  async create(user: User): Promise<User> {
    this.users.push(user);
    return user;
  }
}
```

### 5. Tạo Controller (Presentation)
```typescript
// presentation/controllers/user.controller.ts
@Controller('users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
  ) {}

  @Post()
  async createUser(@Body() dto: CreateUserDto) {
    return this.createUserUseCase.execute(dto);
  }
}
```

### 6. Cấu hình Module
```typescript
// modules/user.module.ts
@Module({
  controllers: [UserController],
  providers: [
    CreateUserUseCase,
    {
      provide: 'IUserRepository',
      useClass: InMemoryUserRepository, // Có thể swap với TypeORMUserRepository
    },
  ],
})
export class UserModule {}
```

## 🚀 Cách chạy project

```bash
# Install dependencies
npm install

# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

## 🧪 Test API

### Create User
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User"
  }'
```

### Get User
```bash
curl http://localhost:3000/users/{userId}
```

### Update User
```bash
curl -X PUT http://localhost:3000/users/{userId} \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name"
  }'
```

## ✅ Lợi ích của Clean Architecture

1. **Testability**: Dễ dàng unit test từng layer độc lập
2. **Maintainability**: Code rõ ràng, dễ bảo trì
3. **Flexibility**: Dễ thay đổi database, framework mà không ảnh hưởng business logic
4. **Scalability**: Dễ mở rộng thêm features mới
5. **Independence**: Business logic không phụ thuộc vào framework hay database

## 🔧 Các bước tiếp theo

1. **Thêm Database thật**: Thay InMemoryRepository bằng TypeORM hoặc Prisma
2. **Authentication**: Thêm JWT authentication
3. **Validation**: Sử dụng class-validator cho DTOs
4. **Error Handling**: Custom exceptions và global filters
5. **Logging**: Thêm Winston hoặc Pino
6. **Testing**: Viết unit tests và e2e tests
7. **Documentation**: Thêm Swagger/OpenAPI

## 📖 Tài liệu tham khảo

- [Clean Architecture by Uncle Bob](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
