import { Inject, Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import type { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { LoginDto, LoginType } from '../dtos/login.dto';
import { UserResponseDto } from '../dtos/user-response.dto';
import { User } from '../../domain/entities/user.entity';

/**
 * Use Case - Login
 * Xử lý business logic đăng nhập cho Parent và Student
 */
@Injectable()
export class LoginUseCase {
    constructor(
        @Inject('IUserRepository')
        private readonly userRepository: IUserRepository,
    ) { }

    async execute(loginDto: LoginDto): Promise<{ success: boolean; user?: UserResponseDto; message?: string; token?: string }> {
        let user: User | null = null;

        // 1. Xác thực dựa trên loại đăng nhập
        if (loginDto.type === LoginType.STUDENT) {
            // Đăng nhập học sinh: Chỉ cần Mã PIN
            if (!loginDto.pinCode) {
                throw new UnauthorizedException('Vui lòng nhập mã PIN');
            }

            // Tìm user bằng PIN
            user = await this.userRepository.findByPin(loginDto.pinCode);

            if (!user) {
                throw new NotFoundException('Mã PIN không tồn tại');
            }

        } else if (loginDto.type === LoginType.PARENT) {
            // Đăng nhập phụ huynh: Email + PIN
            if (!loginDto.username) {
                throw new UnauthorizedException('Vui lòng nhập Email/Tên đăng nhập');
            }

            user = await this.userRepository.findByEmail(loginDto.username);

            if (!user) {
                throw new NotFoundException('Tài khoản không tồn tại');
            }

            if (!loginDto.pinCode) {
                throw new UnauthorizedException('Vui lòng nhập mã PIN');
            }

            if (!user.isPinCodeValid(loginDto.pinCode)) {
                throw new UnauthorizedException('Mã PIN không đúng');
            }
        }

        // 3. Trả về thông tin user
        if (!user) {
            throw new UnauthorizedException('Xác thực thất bại');
        }

        // 3. Tạo token (Giả lập)
        const token = 'mock-jwt-token-' + user.id;

        return {
            success: true,
            user: UserResponseDto.fromEntity(user),
            token,
        };
    }
}

