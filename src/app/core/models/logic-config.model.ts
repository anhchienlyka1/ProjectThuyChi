import { GameFeedback, MascotPrompts } from './addition-config.model';

export interface LogicQuestion {
    id: number;
    question: string;
    sequence?: string[];
    isOddOneOut?: boolean;
    options: string[];
    correctAnswer: string;
}

export interface LogicConfig {
    title: string;
    instruction: string;
    totalQuestions: number;
    pointsPerQuestion: number;
    questions: LogicQuestion[];
    feedback: GameFeedback;
    mascotPrompts: MascotPrompts;
}
