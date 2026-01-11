import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserSchema } from './user.schema';
import { AchievementSchema } from './achievement.schema';

@Entity('user_achievements')
export class UserAchievementSchema {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'user_id' })
    userId: string;

    @Column({ name: 'achievement_id' })
    achievementId: number;

    @Column({ name: 'earned_at' })
    earnedAt: Date;

    @Column({ name: 'earned_context', type: 'json', nullable: true })
    earnedContext: any;

    @Column({ default: false })
    notified: boolean;

    @ManyToOne(() => UserSchema)
    @JoinColumn({ name: 'user_id' })
    user: UserSchema;

    @ManyToOne(() => AchievementSchema)
    @JoinColumn({ name: 'achievement_id' })
    achievement: AchievementSchema;

    @Column({ name: 'is_deleted', default: false })
    isDeleted: boolean;
}

