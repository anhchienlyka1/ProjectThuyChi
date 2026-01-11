import {
    Body,
    Controller,
    Post,
    HttpCode,
    HttpStatus,
    HttpException,
} from '@nestjs/common';
import { LoginDto, LoginType } from '../../application/dtos/login.dto';
import { LoginUseCase } from '../../application/use-cases/login.use-case';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly loginUseCase: LoginUseCase,
    ) { }

    @Post('login/student')
    @HttpCode(HttpStatus.OK)
    async loginStudent(@Body() body: { pinCode: string }) {
        const loginDto = new LoginDto();
        loginDto.type = LoginType.STUDENT;
        loginDto.pinCode = body.pinCode;

        try {
            return await this.loginUseCase.execute(loginDto);
        } catch (error: any) {
            // Re-throw exceptions to be handled by NestJS generic exception filter if any,
            // or return structured error matching LoginResponse interface
            throw error;
        }
    }

    @Post('login/parent')
    @HttpCode(HttpStatus.OK)
    async loginParent(@Body() body: { username: string; pinCode: string }) {
        const loginDto = new LoginDto();
        loginDto.username = body.username;
        loginDto.type = LoginType.PARENT;
        loginDto.pinCode = body.pinCode;

        try {
            return await this.loginUseCase.execute(loginDto);
        } catch (error: any) {
            throw error;
        }
    }
}
