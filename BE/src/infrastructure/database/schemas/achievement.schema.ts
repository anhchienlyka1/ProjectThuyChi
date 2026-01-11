import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('achievements')
export class AchievementSchema {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'achievement_id', unique: true })
    achievementId: string;

    @Column()
    title: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column()
    icon: string;

    @Column({ type: 'varchar', default: 'common' }) // enum: common, rare, epic, legendary
    rarity: string;

    @Column({ name: 'unlock_criteria', type: 'json' })
    unlockCriteria: any;

    @Column({ default: 0 })
    points: number;

    @Column({ nullable: true })
    category: string;

    @Column({ default: true })
    active: boolean;

    @Column({ name: 'is_deleted', default: false })
    isDeleted: boolean;
}

