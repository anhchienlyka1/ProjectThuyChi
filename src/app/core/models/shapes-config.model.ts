import { GameFeedback, MascotPrompts } from './addition-config.model';

export interface ShapeOption {
    id: string;
    icon: string;
    color: string;
}

export interface ShapeQuestion {
    id: number;
    question: string;
    correctAnswer: string;
    options: ShapeOption[];
}

export interface ShapesConfig {
    title: string;
    instruction: string;
    totalQuestions: number;
    pointsPerQuestion: number;
    questions: ShapeQuestion[];
    feedback: GameFeedback;
    mascotPrompts: MascotPrompts;
}
