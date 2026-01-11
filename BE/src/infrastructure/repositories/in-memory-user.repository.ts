import { Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';

/**
 * In-Memory Repository Implementation
 * Đây là implementation cụ thể của IUserRepository
 * Trong thực tế, bạn sẽ thay thế bằng TypeORM, Prisma, hoặc MongoDB
 */
@Injectable()
export class InMemoryUserRepository implements IUserRepository {
    private users: User[] = [];

    async findById(id: string): Promise<User | null> {
        const user = this.users.find((u) => u.id === id);
        return user || null;
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = this.users.find((u) => u.email === email);
        return user || null;
    }

    async findByPin(pin: string): Promise<User | null> {
        const user = this.users.find((u) => u.pinCode === pin);
        return user || null;
    }

    async findAll(): Promise<User[]> {
        return [...this.users];
    }

    async create(user: User): Promise<User> {
        this.users.push(user);
        return user;
    }

    async update(user: User): Promise<User> {
        const index = this.users.findIndex((u) => u.id === user.id);
        if (index === -1) {
            throw new Error('User not found');
        }
        this.users[index] = user;
        return user;
    }

    async delete(id: string): Promise<void> {
        const index = this.users.findIndex((u) => u.id === id);
        if (index === -1) {
            throw new Error('User not found');
        }
        this.users.splice(index, 1);
    }

    async findByParentId(parentId: string): Promise<User[]> {
        return this.users.filter(user => user.parentId === parentId);
    }
}
