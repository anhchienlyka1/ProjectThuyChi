import { GameDifficulty, GameFeedback, MascotPrompts } from './addition-config.model';

export interface FillInBlankConfig {
    title: string;
    instruction: string;
    totalQuestions: number;
    pointsPerQuestion: number;
    difficulty: GameDifficulty;
    feedback: GameFeedback;
    mascotPrompts: MascotPrompts;
}
