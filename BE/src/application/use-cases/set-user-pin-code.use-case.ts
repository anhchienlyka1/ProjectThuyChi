import { Inject, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import type { IUserRepository } from '../../domain/repositories/user.repository.interface';

/**
 * Use Case - Set User PIN Code
 * Business logic để cập nhật mã PIN cho user
 */
@Injectable()
export class SetUserPinCodeUseCase {
    constructor(
        @Inject('IUserRepository')
        private readonly userRepository: IUserRepository,
    ) { }

    /**
     * Cập nhật mã PIN cho user
     * @param userId - ID của user
     * @param pinCode - Mã PIN mới (6 chữ số)
     * @returns User đã được cập nhật
     */
    async execute(userId: string, pinCode: string): Promise<void> {
        // Tìm user
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new NotFoundException(`User với ID ${userId} không tồn tại`);
        }

        // Validate và set PIN code (sử dụng business logic trong entity)
        try {
            user.setPinCode(pinCode);
        } catch (error) {
            throw new BadRequestException(error.message);
        }

        // Lưu vào database
        await this.userRepository.update(user);
    }
}
