export interface SortingQuestion {
    id: number;
    question: string;
    order?: 'asc' | 'desc';
    type?: 'sort' | 'find-min' | 'find-max';
    items: number[];
    correctSequence: number[];
}

export interface SortingConfig {
    title: string;
    questions: SortingQuestion[];
    mascotPrompts: {
        start: string;
        question: string;
    };
    feedback: {
        correct: string[];
        wrong: string[];
    };
}
