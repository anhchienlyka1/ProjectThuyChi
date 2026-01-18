import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Put,
    HttpCode,
    HttpStatus,
    UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from '../../application/dtos/create-user.dto';
import { UpdateUserDto } from '../../application/dtos/update-user.dto';
import { UserResponseDto } from '../../application/dtos/user-response.dto';
import { SetPinCodeDto } from '../../application/dtos/set-pin-code.dto';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { GetUserByIdUseCase } from '../../application/use-cases/get-user-by-id.use-case';
import { UpdateUserUseCase } from '../../application/use-cases/update-user.use-case';
import { SetUserPinCodeUseCase } from '../../application/use-cases/set-user-pin-code.use-case';
import { GetChildrenByParentUseCase } from '../../application/use-cases/get-children-by-parent.use-case';
import { JwtAuthGuard } from '../../infrastructure/auth/jwt-auth.guard';

/**
 * User Controller - Presentation Layer
 * Chỉ chịu trách nhiệm nhận request và gọi use case tương ứng
 */
@Controller('users')
@UseGuards(JwtAuthGuard) // Protect all user routes
export class UserController {
    constructor(
        private readonly createUserUseCase: CreateUserUseCase,
        private readonly getUserByIdUseCase: GetUserByIdUseCase,
        private readonly updateUserUseCase: UpdateUserUseCase,
        private readonly setUserPinCodeUseCase: SetUserPinCodeUseCase,
        private readonly getChildrenByParentUseCase: GetChildrenByParentUseCase,
    ) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createUser(
        @Body() createUserDto: CreateUserDto,
    ): Promise<UserResponseDto> {
        return this.createUserUseCase.execute(createUserDto);
    }

    @Get(':parentId/children')
    async getChildrenByParent(@Param('parentId') parentId: string): Promise<UserResponseDto[]> {
        return this.getChildrenByParentUseCase.execute(parentId);
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

    @Put(':id/pin')
    @HttpCode(HttpStatus.OK)
    async setUserPinCode(
        @Param('id') id: string,
        @Body() setPinCodeDto: SetPinCodeDto,
    ): Promise<{ message: string }> {
        await this.setUserPinCodeUseCase.execute(id, setPinCodeDto.pinCode);
        return { message: 'Mã PIN đã được cập nhật thành công' };
    }
}
