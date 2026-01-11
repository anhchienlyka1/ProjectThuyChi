import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { LearningSessionSchema } from './learning-session.schema';
import { QuestionSchema } from './question.schema';

@Entity('question_attempts')
export class QuestionAttemptSchema {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'session_id' })
    sessionId: number;

    @Column({ name: 'question_id', nullable: true })
    questionId: number;

    @Column({ name: 'question_number' })
    questionNumber: number;

    @Column({ name: 'question_text', type: 'text', nullable: true })
    questionText: string;

    @Column({ name: 'user_answer', nullable: true })
    userAnswer: string;

    @Column({ name: 'correct_answer', nullable: true })
    correctAnswer: string;

    @Column({ name: 'is_correct' })
    isCorrect: boolean;

    @Column({ name: 'time_spent_seconds', default: 0 })
    timeSpentSeconds: number;

    @Column({ name: 'attempts_count', default: 1 })
    attemptsCount: number;

    @Column({ name: 'answered_at' })
    answeredAt: Date;

    @ManyToOne(() => LearningSessionSchema)
    @JoinColumn({ name: 'session_id' })
    session: LearningSessionSchema;

    @ManyToOne(() => QuestionSchema)
    @JoinColumn({ name: 'question_id' })
    question: QuestionSchema;

    @Column({ name: 'is_deleted', default: false })
    isDeleted: boolean;
}

