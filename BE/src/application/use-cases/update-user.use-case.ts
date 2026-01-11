import { Inject, Injectable } from '@nestjs/common';
import type { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UserResponseDto } from '../dtos/user-response.dto';
import { NotFoundException } from '../../shared/exceptions/business.exception';

/**
 * Use Case - Update User
 */
@Injectable()
export class UpdateUserUseCase {
    constructor(
        @Inject('IUserRepository')
        private readonly userRepository: IUserRepository,
    ) { }

    async execute(
        id: string,
        updateUserDto: UpdateUserDto,
    ): Promise<UserResponseDto> {
        const user = await this.userRepository.findById(id);

        if (!user) {
            throw new NotFoundException('User', id);
        }

        // Update using domain method
        if (updateUserDto.name) {
            user.updateProfile(updateUserDto.name);
        }

        // Update gender if provided
        if (updateUserDto.gender) {
            user.setGender(updateUserDto.gender);
        }

        const updatedUser = await this.userRepository.update(user);

        return new UserResponseDto({
            id: updatedUser.id,
            email: updatedUser.email,
            name: updatedUser.name,
            createdAt: updatedUser.createdAt,
            updatedAt: updatedUser.updatedAt,
            hasPinCode: !!updatedUser.pinCode,
            gender: updatedUser.gender,
        });
    }
}
