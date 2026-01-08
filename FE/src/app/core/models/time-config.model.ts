export interface TimeQuestion {
    id: number;
    time: string;
    hour: number;
    minute: number;
    question: string;
    options: string[];
    correctAnswer: string;
}

export interface TimeConfig {
    title: string;
    questions: TimeQuestion[];
    mascotPrompts: {
        start: string;
        question: string;
    };
    feedback: {
        correct: string[];
        wrong: string[];
    };
}
