import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { LevelSchema } from './level.schema';

@Entity('questions')
export class QuestionSchema {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'level_id' })
    levelId: string;

    @Column({ name: 'question_type' })
    questionType: string;

    @Column({ type: 'json' })
    content: any;

    @Column({ name: 'order_index' })
    orderIndex: number;

    @Column({ default: 0 })
    points: number;

    @Column({ type: 'json', nullable: true })
    metadata: any;

    @ManyToOne(() => LevelSchema)
    @JoinColumn({ name: 'level_id' })
    level: LevelSchema;

    @Column({ name: 'is_deleted', default: false })
    isDeleted: boolean;
}

