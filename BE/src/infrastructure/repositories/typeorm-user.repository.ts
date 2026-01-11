import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../domain/entities/user.entity';
import type { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { UserSchema } from '../database/schemas/user.schema';

/**
 * TypeORM Repository Implementation
 * Implement IUserRepository sử dụng TypeORM
 * 
 * Để sử dụng:
 * 1. Install: npm install @nestjs/typeorm typeorm pg
 * 2. Configure TypeORM trong app.module.ts
 * 3. Thay InMemoryUserRepository bằng TypeORMUserRepository trong user.module.ts
 */
@Injectable()
export class TypeORMUserRepository implements IUserRepository {
    constructor(
        @InjectRepository(UserSchema)
        private readonly repository: Repository<UserSchema>,
    ) { }

    async findById(id: string): Promise<User | null> {
        const schema = await this.repository.findOne({ where: { id, isDeleted: false } });
        return schema ? this.toDomain(schema) : null;
    }


    async findByEmail(email: string): Promise<User | null> {
        const schema = await this.repository.findOne({ where: { email, isDeleted: false } });
        return schema ? this.toDomain(schema) : null;
    }

    async findByPin(pin: string): Promise<User | null> {
        const schema = await this.repository.findOne({ where: { pinCode: pin, isDeleted: false } });
        return schema ? this.toDomain(schema) : null;
    }

    async findByParentId(parentId: string): Promise<User[]> {
        const schemas = await this.repository.find({ where: { parentId, isDeleted: false } });
        return schemas.map((schema) => this.toDomain(schema));
    }

    async findAll(): Promise<User[]> {
        const schemas = await this.repository.find({ where: { isDeleted: false } });
        return schemas.map((schema) => this.toDomain(schema));
    }


    async create(user: User): Promise<User> {
        const schema = this.repository.create({
            id: user.id,
            email: user.email,
            name: user.name,
            pinCode: user.pinCode,
            gender: user.gender,
            parentId: user.parentId,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        });
        const saved = await this.repository.save(schema);
        return this.toDomain(saved);
    }

    async update(user: User): Promise<User> {
        await this.repository.update(user.id, {
            email: user.email,
            name: user.name,
            pinCode: user.pinCode,
            gender: user.gender,
            // parentId usually doesn't change, but consistent to include
            updatedAt: user.updatedAt,
        });
        const updated = await this.repository.findOne({ where: { id: user.id } });
        if (!updated) {
            throw new Error('User not found after update');
        }
        return this.toDomain(updated);
    }

    async delete(id: string): Promise<void> {
        await this.repository.update(id, { isDeleted: true });
    }


    /**
     * Convert TypeORM Schema to Domain Entity
     */
    private toDomain(schema: UserSchema): User {
        return new User(
            schema.id,
            schema.email,
            schema.name,
            schema.createdAt,
            schema.updatedAt,
            schema.pinCode,
            schema.gender,
            schema.parentId,
        );
    }
}
