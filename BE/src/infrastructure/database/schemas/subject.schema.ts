import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('subjects')
export class SubjectSchema {
    @PrimaryColumn()
    id: string; // 'math', 'vietnamese', etc.

    @Column()
    title: string;

    @Column()
    icon: string;

    @Column({ type: 'json', name: 'theme_config', nullable: true })
    themeConfig: any;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ default: true })
    active: boolean;

    @Column({ name: 'sort_order', default: 0 })
    sortOrder: number;

    @Column({ name: 'is_deleted', default: false })
    isDeleted: boolean;
}

