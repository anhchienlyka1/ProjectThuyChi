import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserSchema } from './user.schema';
import { LevelSchema } from './level.schema';

@Entity('user_progress')
export class UserProgressSchema {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'user_id' })
    userId: string;

    @Column({ name: 'level_id' })
    levelId: string;

    @Column({ default: 0 })
    stars: number;

    @Column({ default: 'LOCKED' })
    status: string; // LOCKED, UNLOCKED, IN_PROGRESS, COMPLETED

    @Column({ name: 'high_score', default: 0 })
    highScore: number;

    @Column({ name: 'total_attempts', default: 0 })
    totalAttempts: number;

    @Column({ name: 'first_played_at', nullable: true })
    firstPlayedAt: Date;

    @Column({ name: 'last_played_at', nullable: true })
    lastPlayedAt: Date;

    @Column({ name: 'completed_at', nullable: true })
    completedAt: Date;

    @ManyToOne(() => UserSchema)
    @JoinColumn({ name: 'user_id' })
    user: UserSchema;

    @ManyToOne(() => LevelSchema)
    @JoinColumn({ name: 'level_id' })
    level: LevelSchema;

    @Column({ name: 'is_deleted', default: false })
    isDeleted: boolean;
}

