import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, UpdateDateColumn } from 'typeorm';
import { UserSchema } from './user.schema';

@Entity('user_settings')
export class UserSettingsSchema {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'user_id', unique: true })
    userId: string;

    @Column({ name: 'learning_settings', type: 'json', nullable: true })
    learningSettings: any;

    @Column({ name: 'notification_settings', type: 'json', nullable: true })
    notificationSettings: any;

    @Column({ name: 'parental_controls', type: 'json', nullable: true })
    parentalControls: any;

    @Column({ name: 'audio_settings', type: 'json', nullable: true })
    audioSettings: any;

    @Column({ name: 'ui_settings', type: 'json', nullable: true })
    uiSettings: any;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @OneToOne(() => UserSchema)
    @JoinColumn({ name: 'user_id' })
    user: UserSchema;

    @Column({ name: 'is_deleted', default: false })
    isDeleted: boolean;
}

