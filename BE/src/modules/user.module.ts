import { Module } from '@nestjs/common';
import { UserController } from '../presentation/controllers/user.controller';
import { CreateUserUseCase } from '../application/use-cases/create-user.use-case';
import { GetUserByIdUseCase } from '../application/use-cases/get-user-by-id.use-case';
import { UpdateUserUseCase } from '../application/use-cases/update-user.use-case';
import { InMemoryUserRepository } from '../infrastructure/repositories/in-memory-user.repository';

/**
 * User Module
 * Kết nối tất cả các layer lại với nhau
 */
@Module({
    controllers: [UserController],
    providers: [
        // Use Cases (Application Layer)
        CreateUserUseCase,
        GetUserByIdUseCase,
        UpdateUserUseCase,



        // Repository Implementation (Infrastructure Layer)
        {
            provide: 'IUserRepository',
            useClass: InMemoryUserRepository,
        },
    ],
    exports: [CreateUserUseCase, GetUserByIdUseCase, UpdateUserUseCase],
})
export class UserModule { }
