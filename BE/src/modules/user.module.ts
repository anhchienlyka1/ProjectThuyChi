import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from '../presentation/controllers/user.controller';
import { CreateUserUseCase } from '../application/use-cases/create-user.use-case';
import { GetUserByIdUseCase } from '../application/use-cases/get-user-by-id.use-case';
import { UpdateUserUseCase } from '../application/use-cases/update-user.use-case';
import { SetUserPinCodeUseCase } from '../application/use-cases/set-user-pin-code.use-case';
import { GetChildrenByParentUseCase } from '../application/use-cases/get-children-by-parent.use-case';
import { TypeORMUserRepository } from '../infrastructure/repositories/typeorm-user.repository';
import { UserSchema } from '../infrastructure/database/schemas/user.schema';

/**
 * User Module
 * Kết nối tất cả các layer lại với nhau
 */
@Module({
    imports: [
        TypeOrmModule.forFeature([UserSchema]), // Đăng ký entity
    ],
    controllers: [UserController],
    providers: [
        // Use Cases (Application Layer)
        CreateUserUseCase,
        GetUserByIdUseCase,
        UpdateUserUseCase,
        SetUserPinCodeUseCase,
        GetChildrenByParentUseCase,

        // Repository Implementation (Infrastructure Layer)
        {
            provide: 'IUserRepository',
            useClass: TypeORMUserRepository,
        },
    ],
    exports: [CreateUserUseCase, GetUserByIdUseCase, UpdateUserUseCase, SetUserPinCodeUseCase, GetChildrenByParentUseCase, 'IUserRepository'],
})
export class UserModule { }
