import { Inject, Injectable } from '@nestjs/common';
import type { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { UserResponseDto } from '../dtos/user-response.dto';
import { NotFoundException } from '../../shared/exceptions/business.exception';

/**
 * Use Case - Get User By ID
 */
@Injectable()
export class GetUserByIdUseCase {
    constructor(
        @Inject('IUserRepository')
        private readonly userRepository: IUserRepository,
    ) { }

    async execute(id: string): Promise<UserResponseDto> {
        const user = await this.userRepository.findById(id);

        if (!user) {
            throw new NotFoundException('User', id);
        }

        return new UserResponseDto({
            id: user.id,
            email: user.email,
            name: user.name,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            hasPinCode: !!user.pinCode, // Flag để check có PIN hay chưa
            gender: user.gender,
        });
    }
}
