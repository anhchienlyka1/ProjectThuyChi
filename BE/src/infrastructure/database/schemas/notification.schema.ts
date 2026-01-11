import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserSchema } from './user.schema';

@Entity('notifications')
export class NotificationSchema {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'user_id' })
    userId: string;

    @Column()
    type: string;

    @Column()
    title: string;

    @Column({ type: 'text' })
    message: string;

    @Column({ type: 'json', nullable: true })
    data: any;

    @Column({ default: false })
    read: boolean;

    @Column({ name: 'scheduled_for', nullable: true })
    scheduledFor: Date;

    @Column({ name: 'sent_at', nullable: true })
    sentAt: Date;

    @Column({ name: 'read_at', nullable: true })
    readAt: Date;

    @ManyToOne(() => UserSchema)
    @JoinColumn({ name: 'user_id' })
    user: UserSchema;

    @Column({ name: 'is_deleted', default: false })
    isDeleted: boolean;
}

