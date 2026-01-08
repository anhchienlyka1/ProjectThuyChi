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

export interface AdditionConfig {
    title: string;
    instruction: string;
    items: string[];
    totalQuestions: number;
    pointsPerQuestion: number;
    difficulty: GameDifficulty; // Range for the SUM
    feedback: GameFeedback;
    mascotPrompts: MascotPrompts;
}
