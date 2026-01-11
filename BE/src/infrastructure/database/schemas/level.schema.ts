import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { SubjectSchema } from './subject.schema';

@Entity('levels')
export class LevelSchema {
    @PrimaryColumn()
    id: string; // 'counting', 'simple-words'

    @Column({ name: 'subject_id' })
    subjectId: string;

    @Column()
    title: string;

    @Column({ nullable: true })
    subtitle: string;

    @Column({ nullable: true })
    icon: string;

    @Column({ nullable: true })
    route: string;

    @Column({ name: 'is_free', default: true })
    isFree: boolean;

    @Column({ name: 'level_number' })
    levelNumber: number;

    @Column({ type: 'json', name: 'ui_config', nullable: true })
    uiConfig: any;

    @Column({ name: 'min_age', nullable: true })
    minAge: number;

    @Column({ name: 'max_age', nullable: true })
    maxAge: number;

    @Column({ name: 'estimated_duration', nullable: true })
    estimatedDuration: number;

    @ManyToOne(() => SubjectSchema)
    @JoinColumn({ name: 'subject_id' })
    subject: SubjectSchema;

    @Column({ name: 'is_deleted', default: false })
    isDeleted: boolean;
}

