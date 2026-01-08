import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Put,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { CreateUserDto } from '../../application/dtos/create-user.dto';
import { UpdateUserDto } from '../../application/dtos/update-user.dto';
import { UserResponseDto } from '../../application/dtos/user-response.dto';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { GetUserByIdUseCase } from '../../application/use-cases/get-user-by-id.use-case';
import { UpdateUserUseCase } from '../../application/use-cases/update-user.use-case';

/**
 * User Controller - Presentation Layer
 * Chỉ chịu trách nhiệm nhận request và gọi use case tương ứng
 */
@Controller('users')
export class UserController {
    constructor(
        private readonly createUserUseCase: CreateUserUseCase,
        private readonly getUserByIdUseCase: GetUserByIdUseCase,
        private readonly updateUserUseCase: UpdateUserUseCase,
    ) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createUser(
        @Body() createUserDto: CreateUserDto,
    ): Promise<UserResponseDto> {
        return this.createUserUseCase.execute(createUserDto);
    }

    @Get(':id')
    async getUserById(@Param('id') id: string): Promise<UserResponseDto> {
        return this.getUserByIdUseCase.execute(id);
    }

    @Put(':id')
    async updateUser(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<UserResponseDto> {
        return this.updateUserUseCase.execute(id, updateUserDto);
    }
}
