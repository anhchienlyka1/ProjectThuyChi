import { GameDifficulty, GameFeedback, MascotPrompts } from './addition-config.model';

export interface SubtractionConfig {
    title: string;
    instruction: string;
    items: string[];
    totalQuestions: number;
    pointsPerQuestion: number;
    difficulty: GameDifficulty;
    feedback: GameFeedback;
    mascotPrompts: MascotPrompts;
}
