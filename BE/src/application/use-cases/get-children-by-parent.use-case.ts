import { Injectable, Inject } from '@nestjs/common';
import type { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { UserResponseDto } from '../dtos/user-response.dto';

/**
 * Use Case: Get Children by Parent ID
 * Lấy danh sách học sinh (children) của một phụ huynh
 */
@Injectable()
export class GetChildrenByParentUseCase {
    constructor(
        @Inject('IUserRepository')
        private readonly userRepository: IUserRepository,
    ) { }

    async execute(parentId: string): Promise<UserResponseDto[]> {
        // Lấy tất cả users có parentId = parentId
        const children = await this.userRepository.findByParentId(parentId);

        // Map sang DTO
        return children.map(child => ({
            id: child.id,
            email: child.email,
            username: '',
            name: child.name,
            fullName: child.name,
            age: 0,
            avatarUrl: '',
            role: 'child',
            gender: child.gender || '',
            parentId: child.parentId || '',
            createdAt: child.createdAt,
            updatedAt: child.updatedAt,
        }));
    }
}
