import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserSchema } from './user.schema';
import { LevelSchema } from './level.schema';

@Entity('learning_sessions')
export class LearningSessionSchema {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'user_id' })
    userId: string;

    @Column({ name: 'level_id' })
    levelId: string;

    @Column({ name: 'started_at' })
    startedAt: Date;

    @Column({ name: 'completed_at', nullable: true })
    completedAt: Date;

    @Column({ name: 'duration_seconds', default: 0 })
    durationSeconds: number;

    @Column({ default: 0 })
    score: number;

    @Column({ name: 'total_questions', default: 0 })
    totalQuestions: number;

    @Column({ name: 'accuracy_percentage', type: 'float', default: 0 })
    accuracyPercentage: number;

    @Column({ default: false })
    completed: boolean;

    @Column({ name: 'session_metadata', type: 'json', nullable: true })
    sessionMetadata: any;

    @ManyToOne(() => UserSchema)
    @JoinColumn({ name: 'user_id' })
    user: UserSchema;

    @ManyToOne(() => LevelSchema)
    @JoinColumn({ name: 'level_id' })
    level: LevelSchema;

    @Column({ name: 'is_deleted', default: false })
    isDeleted: boolean;
}

