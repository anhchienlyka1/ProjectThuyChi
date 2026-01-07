export interface GameFeedback {
    correct: string[];
    wrong: string[];
}

export interface GameDifficulty {
    minNumber: number;
    maxNumber: number;
}

export interface MascotPrompts {
    start: string;
    question: string;
}

export interface ComparisonConfig {
    title: string;
    instruction: string;
    items: string[];
    totalQuestions: number;
    pointsPerQuestion: number;
    difficulty: GameDifficulty;
    feedback: GameFeedback;
    mascotPrompts: MascotPrompts;
}
