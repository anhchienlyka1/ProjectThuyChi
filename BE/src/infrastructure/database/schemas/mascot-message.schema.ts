import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('mascot_messages')
export class MascotMessageSchema {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'level_id', nullable: true })
    levelId: string;

    @Column({ name: 'trigger_type' })
    triggerType: string;

    @Column({ name: 'message_template', type: 'text' })
    messageTemplate: string;

    @Column({ default: 0 })
    priority: number;

    @Column({ name: 'is_deleted', default: false })
    isDeleted: boolean;
}

