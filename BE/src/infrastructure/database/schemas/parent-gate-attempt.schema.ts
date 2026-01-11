import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserSchema } from './user.schema';

@Entity('parent_gate_attempts')
export class ParentGateAttemptSchema {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'user_id', nullable: true })
    userId: string;

    @Column()
    num1: number;

    @Column()
    num2: number;

    @Column({ name: 'user_answer' })
    userAnswer: number;

    @Column({ name: 'is_correct' })
    isCorrect: boolean;

    @Column({ name: 'ip_address', nullable: true })
    ipAddress: string;

    @Column({ name: 'attempted_at' })
    attemptedAt: Date;

    @ManyToOne(() => UserSchema)
    @JoinColumn({ name: 'user_id' })
    user: UserSchema;

    @Column({ name: 'is_deleted', default: false })
    isDeleted: boolean;
}

