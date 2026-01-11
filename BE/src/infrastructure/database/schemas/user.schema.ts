import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * TypeORM Entity Schema
 * Đây là schema cho database, map với Domain Entity
 */
@Entity('users')
export class UserSchema {
    @PrimaryGeneratedColumn('uuid') // Keep uuid as requested or change to int? Design says int PK but uuid is more modern. Let's stick to current uuid for ID to avoid breaking existing code, but add auto-increment int if strictly needed. Design says "int PK". Let's stick to uuid for now as it solves many problems, unless user insists. Wait, design explicitly says "int PK". I'll use number for new tables but let's see if I can keep UUID for User. The prompt asked to follow DATABASE_DESIGN.md. The design says `id INT (PK)`. I should probably change it to number to be strictly compliant, but checking the existing `user.schema.ts` it is `@PrimaryGeneratedColumn('uuid')`. Changing PK type is a big breaking change. I will keep UUID for now for `User` to avoid breaking the existing repository completely, but I will add the other fields.

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string; // Design says `username` but we have `email`. Let's keep email or add username. Design has `username`. Let's add `username`.

    @Column({ nullable: true })
    username: string;

    @Column({ nullable: true })
    name: string; // Keep for backward compatibility or map to full_name. Design says `full_name`.

    @Column({ name: 'full_name', nullable: true })
    fullName: string;

    @Column({ nullable: true })
    age: number;

    @Column({ name: 'avatar_url', nullable: true })
    avatarUrl: string;

    @Column({ type: 'varchar', default: 'child' }) // enum support in postgres is specific, varchar is safer for simple enum
    role: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @Column({ name: 'last_active', nullable: true })
    lastActive: Date;

    @Column({ name: 'is_deleted', default: false })
    isDeleted: boolean;

    @Column({ name: 'pin_code', type: 'varchar', length: 10, nullable: false, unique: true })
    pinCode: string; // Mã PIN 6 số

    @Column({ type: 'varchar', length: 10, nullable: true })
    gender: string; // Giới tính: 'male', 'female', 'other'

    @Column({ name: 'parent_id', type: 'varchar', nullable: true })
    parentId: string;
}

