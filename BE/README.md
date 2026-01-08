# 🎯 Clean Architecture - Quick Start Guide

## 📚 Tài liệu

- **[CLEAN_ARCHITECTURE.md](./CLEAN_ARCHITECTURE.md)** - Giải thích chi tiết về Clean Architecture
- **[ARCHITECTURE_DIAGRAM.md](./ARCHITECTURE_DIAGRAM.md)** - Sơ đồ và visualization
- **[DATABASE_INTEGRATION.md](./DATABASE_INTEGRATION.md)** - Hướng dẫn tích hợp database

## 🚀 Quick Start

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Chạy development server
```bash
npm run start:dev
```

### 3. Test API

**Create User:**
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "name": "John Doe"
  }'
```

**Get User:**
```bash
curl http://localhost:3000/users/{userId}
```

**Update User:**
```bash
curl -X PUT http://localhost:3000/users/{userId} \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe"
  }'
```

## 📁 Cấu trúc Project

```
src/
├── domain/                    # Layer Entities & Interfaces (No Logic)
│   ├── entities/             # Data Structures
│   └── repositories/         # Repository Interfaces
│
├── application/              # Layer Business Logic
│   ├── use-cases/           # Implementation of Business Logic
│   └── dtos/                # Data Transfer Objects
│
├── infrastructure/           # External Services
│   ├── repositories/        # Repository Implementations
│   └── database/            # Database Schemas
│
├── presentation/            # API Layer
│   └── controllers/         # REST Controllers
│
├── shared/                  # Common Code
│   ├── exceptions/          # Custom Exceptions
│   ├── constants/           # Constants
│   └── interfaces/          # Shared Interfaces
│
└── modules/                 # NestJS Modules
    └── user.module.ts       # User Module
```

## 🎨 Các Layer

### 1️⃣ Domain Layer (Core)
- **Entities**: `user.entity.ts`
- **Repository Interfaces**: `user.repository.interface.ts`
- **Không phụ thuộc vào bất kỳ layer nào**

### 2️⃣ Application Layer
- **Use Cases**: `create-user.use-case.ts`, `get-user-by-id.use-case.ts`, `update-user.use-case.ts`
- **DTOs**: `create-user.dto.ts`, `update-user.dto.ts`, `user-response.dto.ts`
- **Chỉ phụ thuộc vào Domain Layer**

### 3️⃣ Infrastructure Layer
- **Repositories**: `in-memory-user.repository.ts`, `typeorm-user.repository.ts`
- **Database Schemas**: `user.schema.ts`
- **Implement interfaces từ Domain Layer**

### 4️⃣ Presentation Layer
- **Controllers**: `user.controller.ts`
- **Filters**: `all-exceptions.filter.ts`
- **Gọi Use Cases từ Application Layer**

## 🔄 Workflow: Thêm Feature Mới

### Ví dụ: Thêm chức năng "Product"

#### Bước 1: Domain Layer
```typescript
// domain/entities/product.entity.ts
export class Product {
  constructor(
    public readonly id: string,
    public name: string,
    public price: number,
  ) {}
}

// domain/repositories/product.repository.interface.ts
export interface IProductRepository {
  findById(id: string): Promise<Product | null>;
  create(product: Product): Promise<Product>;
}
```

#### Bước 2: Application Layer
```typescript
// application/dtos/create-product.dto.ts
export class CreateProductDto {
  @IsString()
  name: string;

  @IsNumber()
  price: number;
}

// application/use-cases/create-product.use-case.ts
@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject('IProductRepository')
    private repository: IProductRepository,
  ) {}

  async execute(dto: CreateProductDto): Promise<ProductResponseDto> {
    const product = new Product(uuid(), dto.name, dto.price);
    const saved = await this.repository.create(product);
    return new ProductResponseDto(saved);
  }
}
```

#### Bước 3: Infrastructure Layer
```typescript
// infrastructure/repositories/in-memory-product.repository.ts
@Injectable()
export class InMemoryProductRepository implements IProductRepository {
  private products: Product[] = [];

  async create(product: Product): Promise<Product> {
    this.products.push(product);
    return product;
  }
}
```

#### Bước 4: Presentation Layer
```typescript
// presentation/controllers/product.controller.ts
@Controller('products')
export class ProductController {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateProductDto) {
    return this.createProductUseCase.execute(dto);
  }
}
```

#### Bước 5: Module Configuration
```typescript
// modules/product.module.ts
@Module({
  controllers: [ProductController],
  providers: [
    CreateProductUseCase,
    {
      provide: 'IProductRepository',
      useClass: InMemoryProductRepository,
    },
  ],
})
export class ProductModule {}
```

## 🧪 Testing Strategy

### Unit Tests
```typescript
describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let repository: IUserRepository;

  beforeEach(() => {
    repository = new InMemoryUserRepository();
    useCase = new CreateUserUseCase(repository);
  });

  it('should create a user', async () => {
    const dto = { email: 'test@test.com', name: 'Test' };
    const result = await useCase.execute(dto);
    expect(result.email).toBe(dto.email);
  });
});
```

### Integration Tests
```typescript
describe('UserController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/users (POST)', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({ email: 'test@test.com', name: 'Test' })
      .expect(201);
  });
});
```

## 🔧 Các bước tiếp theo

- [ ] Tích hợp database thật (xem [DATABASE_INTEGRATION.md](./DATABASE_INTEGRATION.md))
- [ ] Thêm Authentication & Authorization
- [ ] Implement Logging (Winston/Pino)
- [ ] Thêm API Documentation (Swagger)
- [ ] Setup CI/CD
- [ ] Viết Unit Tests & E2E Tests
- [ ] Implement Caching (Redis)
- [ ] Add Rate Limiting

## 📖 Tài nguyên học tập

- [Clean Architecture - Uncle Bob](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)

## 💡 Tips

1. **Luôn bắt đầu từ Domain Layer** - Định nghĩa entities và business logic trước
2. **Use Cases nên nhỏ và focused** - Mỗi use case làm 1 việc duy nhất
3. **DTOs cho validation** - Validate input ở Application Layer
4. **Repository pattern** - Abstraction cho data access
5. **Dependency Injection** - Dễ dàng swap implementations

## 🤝 Contributing

Khi thêm feature mới, hãy tuân theo:
1. Tạo Entity trong Domain Layer
2. Định nghĩa Repository Interface
3. Tạo Use Cases và DTOs
4. Implement Repository
5. Tạo Controller
6. Cấu hình Module
7. Viết Tests

---

**Happy Coding! 🚀**
