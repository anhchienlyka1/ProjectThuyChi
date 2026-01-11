export class CreateQuestionAttemptDto {
    sessionId: number;
    questionId?: number;
    questionNumber: number;
    questionText: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    timeSpentSeconds: number;
    attemptsCount?: number;
}

export class QuestionAttemptResponseDto {
    id: number;
    sessionId: number;
    questionNumber: number;
    questionText: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    timeSpentSeconds: number;
    attemptsCount: number;
    answeredAt: Date;
}

export class QuestionAttemptAnalysisDto {
    questionText: string;
    totalAttempts: number;
    correctAttempts: number;
    wrongAttempts: number;
    successRate: number;
    averageTimeSpent: number;
    commonWrongAnswers: { answer: string; count: number }[];
}
