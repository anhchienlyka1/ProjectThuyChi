import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from './user.module';
import { AuthController } from '../presentation/controllers/auth.controller';
import { LoginUseCase } from '../application/use-cases/login.use-case';
import { JwtStrategy } from '../infrastructure/auth/jwt.strategy';

@Module({
    imports: [
        UserModule,
        PassportModule,
        JwtModule.register({
            secret: 'super-secret-key-123', // TODO: Use ConfigService in production
            signOptions: { expiresIn: '1d' },
        }),
    ],
    controllers: [AuthController],
    providers: [LoginUseCase, JwtStrategy],
})
export class AuthModule { }
