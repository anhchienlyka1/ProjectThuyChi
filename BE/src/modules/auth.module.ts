import { Module } from '@nestjs/common';
import { UserModule } from './user.module';
import { AuthController } from '../presentation/controllers/auth.controller';
import { LoginUseCase } from '../application/use-cases/login.use-case';

@Module({
    imports: [UserModule],
    controllers: [AuthController],
    providers: [LoginUseCase],
})
export class AuthModule { }
