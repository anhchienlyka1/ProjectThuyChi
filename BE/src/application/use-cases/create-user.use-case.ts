import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import type { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserResponseDto } from '../dtos/user-response.dto';
import { v4 as uuidv4 } from 'uuid';
import {
    AlreadyExistsException,
    ValidationException,
} from '../../shared/exceptions/business.exception';

/**
 * Use Case - Create User
 * Chứa toàn bộ business logic cho việc tạo user mới
 */
@Injectable()
export class CreateUserUseCase {
    constructor(
        @Inject('IUserRepository')
        private readonly userRepository: IUserRepository,
    ) { }

    async execute(createUserDto: CreateUserDto): Promise<UserResponseDto> {
        // 1. Normalize và validate email (Business Logic)
        const normalizedEmail = this.normalizeEmail(createUserDto.email);

        if (!this.isValidEmail(normalizedEmail)) {
            throw new ValidationException('Invalid email format');
        }

        if (this.isDisposableEmail(normalizedEmail)) {
            throw new ValidationException(
                'Disposable email addresses are not allowed',
            );
        }

        // 2. Kiểm tra email đã tồn tại (Database operation)
        const existingUser = await this.userRepository.findByEmail(normalizedEmail);
        if (existingUser) {
            throw new AlreadyExistsException('User', 'email', normalizedEmail);
        }

        // 3. Tạo user entity
        const user = new User(
            uuidv4(),
            normalizedEmail,
            createUserDto.name,
            new Date(),
            new Date(),
            undefined, // pinCode
            createUserDto.gender, // gender
            createUserDto.parentId, // parentId
        );

        // 4. Lưu vào database
        const savedUser = await this.userRepository.create(user);

        // 5. Trả về response DTO
        return new UserResponseDto({
            id: savedUser.id,
            email: savedUser.email,
            name: savedUser.name,
            createdAt: savedUser.createdAt,
            updatedAt: savedUser.updatedAt,
            hasPinCode: !!savedUser.pinCode,
            gender: savedUser.gender,
            parentId: savedUser.parentId,
        });
    }

    /**
     * Business Logic: Normalize email
     */
    private normalizeEmail(email: string): string {
        return email.trim().toLowerCase();
    }

    /**
     * Business Logic: Validate email format
     */
    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Business Logic: Check if email is disposable
     */
    private isDisposableEmail(email: string): boolean {
        const disposableDomains = [
            'tempmail.com',
            'throwaway.email',
            '10minutemail.com',
            'guerrillamail.com',
        ];

        const domain = email.split('@')[1]?.toLowerCase();
        return disposableDomains.some((disposable) => domain === disposable);
    }
}

