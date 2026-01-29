// Exercise Types - Separated by category
export type MathExerciseType = '3-math' | 'fill-blank' | 'sorting' | 'find-even-odd' | 'comparison';
export type VietnameseExerciseType = 'simple-words' | 'spelling' | 'fill-in-blank';
export type ExerciseType = MathExerciseType | VietnameseExerciseType;

export type ExerciseCategory = 'math' | 'vietnamese';
export type ExerciseDifficulty = 'easy' | 'medium' | 'hard';
export type ExerciseStatus = 'draft' | 'published';

// Math Question Types
export interface MathQuestion {
    firstNumber: number;
    secondNumber: number;
    thirdNumber?: number;
    operators: string[];
    correctAnswer: number;
    missingIndex?: number; // For fill-blank type
}

export interface SortingQuestion {
    numbers: number[];
    direction: 'asc' | 'desc';
}

export interface EvenOddQuestion {
    target: 'even' | 'odd';
    options: number[];
    correctAnswer: number;
}

export interface ComparisonQuestion {
    firstNumber: number;
    secondNumber: number;
    correctOperator: '<' | '>' | '=';
}

// Vietnamese Question Types
export interface SimpleWordQuestion {
    word: string;
    meaning: string;
    imageUrl?: string;
    audioUrl?: string;
    syllables?: string[];
    distractors: string[];
}

export interface SpellingQuestion {
    word: string;
    correctSpelling: string;
    parts: { text: string; missing: boolean }[];
    options: string[];
    audioUrl?: string;
    imageUrl?: string;
    hint: string;
}

export interface FillInBlankQuestion {
    imageUrl?: string;
    phrase: string; // Text with blank, e.g., "C_ cá"
    correctAnswer: string;
    options: string[];
    fullText: string;
}

export type Question =
    | { type: '3-math'; data: MathQuestion }
    | { type: 'fill-blank'; data: MathQuestion }
    | { type: 'sorting'; data: SortingQuestion }
    | { type: 'find-even-odd'; data: EvenOddQuestion }
    | { type: 'comparison'; data: ComparisonQuestion }
    | { type: 'simple-words'; data: SimpleWordQuestion }
    | { type: 'spelling'; data: SpellingQuestion }
    | { type: 'fill-in-blank'; data: FillInBlankQuestion };

export interface Exercise {
    id?: string;
    type: ExerciseType;
    category: ExerciseCategory;
    difficulty: ExerciseDifficulty;
    title: string;
    description?: string;
    questions: Question[];
    questionCount: number;
    createdAt: Date;
    updatedAt: Date;
    status: ExerciseStatus;
    tags: string[];
    createdBy?: string;
    level?: string; // e.g., 'level-1', 'level-2' for vietnamese
}

export interface ExerciseFilters {
    type?: ExerciseType;
    category?: ExerciseCategory;
    difficulty?: ExerciseDifficulty;
    status?: ExerciseStatus;
    searchQuery?: string;
    tags?: string[];
    level?: string;
}

export interface ExerciseStats {
    totalExercises: number;
    publishedExercises: number;
    draftExercises: number;
    exercisesByType: Record<ExerciseType, number>;
    exercisesByDifficulty: Record<ExerciseDifficulty, number>;
}
