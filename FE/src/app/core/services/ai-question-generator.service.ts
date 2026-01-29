import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import {
    SimpleWordQuestion,
    SpellingQuestion,
    FillInBlankQuestion,
    ExerciseType
} from '../models/exercise.model';

export interface AIGenerationParams {
    exerciseType: 'simple-words' | 'spelling' | 'fill-in-blank';
    questionCount: number;
    difficulty: 'easy' | 'medium' | 'hard';

    // Simple Words specific
    wordCategory?: 'animals' | 'family' | 'objects' | 'nature' | 'food';
    syllableCount?: 1 | 2;
    includeDistractors?: boolean;

    // Spelling specific
    focusArea?: 'tones' | 'vowels' | 'consonants' | 'mixed';
}

export interface AIGenerationRequest {
    exerciseType: 'simple-words' | 'spelling' | 'fill-in-blank';
    parameters: AIGenerationParams;
}

export interface AIResponse {
    questions: any[];
}

@Injectable({
    providedIn: 'root'
})
export class AIQuestionGeneratorService {

    /**
     * Generate questions using AI (or mock data for now)
     */
    generateQuestions(request: AIGenerationRequest): Observable<SimpleWordQuestion[] | SpellingQuestion[] | FillInBlankQuestion[]> {
        const prompt = this.buildPrompt(request);

        // TODO: Replace with actual AI API call
        // For now, return mock data
        return this.mockAICall(request).pipe(
            map(response => this.parseResponse(response, request.exerciseType))
        );
    }

    /**
     * Build AI prompt based on request parameters
     */
    private buildPrompt(request: AIGenerationRequest): string {
        switch (request.exerciseType) {
            case 'simple-words':
                return this.buildSimpleWordsPrompt(request.parameters);
            case 'spelling':
                return this.buildSpellingPrompt(request.parameters);
            case 'fill-in-blank':
                return this.buildFillInBlankPrompt(request.parameters);
            default:
                return '';
        }
    }

    private buildSimpleWordsPrompt(params: AIGenerationParams): string {
        return `
You are a Vietnamese language education assistant. Generate word-building exercises for children aged 5-7.

TASK: Create ${params.questionCount} simple Vietnamese word questions where children assemble syllables to form words.

PARAMETERS:
- Word Category: ${params.wordCategory}
- Syllable Count: ${params.syllableCount}
- Difficulty Level: ${params.difficulty}
- Include Distractors: ${params.includeDistractors}

OUTPUT FORMAT (JSON):
{
  "questions": [
    {
      "word": "CÁ",
      "meaning": "Con cá",
      "syllables": ["C", "Á"],
      "distractors": ["A", "Ă", "E"]
    }
  ]
}

Generate ${params.questionCount} questions now in valid JSON format.
    `.trim();
    }

    private buildSpellingPrompt(params: AIGenerationParams): string {
        return `
You are a Vietnamese language education assistant. Generate spelling exercises for children aged 6-8.

TASK: Create ${params.questionCount} spelling questions where children identify the correct tone/vowel.

PARAMETERS:
- Focus Area: ${params.focusArea}
- Word Category: ${params.wordCategory}
- Difficulty Level: ${params.difficulty}

OUTPUT FORMAT (JSON):
{
  "questions": [
    {
      "word": "BÀ",
      "hint": "Bà ngoại",
      "parts": [
        {"text": "B", "missing": false},
        {"text": "À", "missing": true}
      ],
      "options": ["À", "Á", "Ả", "Ã"]
    }
  ]
}

Generate ${params.questionCount} questions now in valid JSON format.
    `.trim();
    }

    private buildFillInBlankPrompt(params: AIGenerationParams): string {
        return `
You are a Vietnamese language education assistant. Generate fill-in-the-blank exercises for children aged 6-8.

TASK: Create ${params.questionCount} questions where children complete a word or phrase by choosing the correct missing part.

PARAMETERS:
- Word Category: ${params.wordCategory}
- Difficulty Level: ${params.difficulty}

OUTPUT FORMAT (JSON):
{
  "questions": [
    {
      "phrase": "Con _á",
      "correctAnswer": "c",
      "options": ["c", "k", "t"],
      "fullText": "Con cá"
    }
  ]
}

Generate ${params.questionCount} questions now in valid JSON format.
        `.trim();
    }

    /**
     * Mock AI call - replace with actual API integration later
     */
    private mockAICall(request: AIGenerationRequest): Observable<AIResponse> {
        // Simulate API delay
        let mockData: AIResponse;

        if (request.exerciseType === 'simple-words') {
            mockData = this.getMockSimpleWordsData(request.parameters);
        } else if (request.exerciseType === 'spelling') {
            mockData = this.getMockSpellingData(request.parameters);
        } else {
            mockData = this.getMockFillInBlankData(request.parameters);
        }

        return of(mockData).pipe(delay(1500));
    }

    private getMockSimpleWordsData(params: AIGenerationParams): AIResponse {
        const mockQuestions = [
            {
                word: "CÁ",
                meaning: "Con cá",
                syllables: ["C", "Á"],
                distractors: ["A", "Ă", "E"]
            },
            {
                word: "MÈO",
                meaning: "Con mèo",
                syllables: ["M", "È", "O"],
                distractors: ["É", "Ê", "Ò"]
            },
            {
                word: "CHÓ",
                meaning: "Con chó",
                syllables: ["CH", "Ó"],
                distractors: ["Ò", "O", "T"]
            }
        ];

        return {
            questions: mockQuestions.slice(0, params.questionCount || 3)
        };
    }

    private getMockSpellingData(params: AIGenerationParams): AIResponse {
        const mockQuestions = [
            {
                word: "BÀ",
                hint: "Bà ngoại",
                parts: [
                    { text: "B", missing: false },
                    { text: "À", missing: true }
                ],
                options: ["À", "Á", "Ả", "Ã"]
            },
            {
                word: "MẸ",
                hint: "Mẹ của con",
                parts: [
                    { text: "M", missing: false },
                    { text: "Ẹ", missing: true }
                ],
                options: ["Ẹ", "É", "È", "Ẻ"]
            },
            {
                word: "BỐ",
                hint: "Bố của con",
                parts: [
                    { text: "B", missing: false },
                    { text: "Ố", missing: true }
                ],
                options: ["Ố", "Ò", "Ỏ", "Ó"]
            }
        ];

        return {
            questions: mockQuestions.slice(0, params.questionCount || 3)
        };
    }

    private getMockFillInBlankData(params: AIGenerationParams): AIResponse {
        const mockQuestions = [
            {
                phrase: "Con _á",
                correctAnswer: "c",
                options: ["c", "k", "t"],
                fullText: "Con cá"
            },
            {
                phrase: "Quả _áo",
                correctAnswer: "t",
                options: ["t", "c", "th"],
                fullText: "Quả táo"
            },
            {
                phrase: "_à nội",
                correctAnswer: "B",
                options: ["B", "C", "Đ"],
                fullText: "Bà nội"
            }
        ];
        return {
            questions: mockQuestions.slice(0, params.questionCount || 3)
        };
    }

    /**
     * Parse AI JSON response to typed Question objects
     */
    private parseResponse(
        response: AIResponse,
        exerciseType: 'simple-words' | 'spelling' | 'fill-in-blank'
    ): SimpleWordQuestion[] | SpellingQuestion[] | FillInBlankQuestion[] {
        if (exerciseType === 'simple-words') {
            return this.parseSimpleWords(response);
        } else if (exerciseType === 'spelling') {
            return this.parseSpelling(response);
        } else {
            return this.parseFillInBlank(response);
        }
    }

    private parseSimpleWords(response: AIResponse): SimpleWordQuestion[] {
        return response.questions.map(q => ({
            word: q.word,
            meaning: q.meaning,
            imageUrl: q.imageUrl || undefined,
            audioUrl: q.audioUrl || undefined,
            syllables: q.syllables || [],
            distractors: q.distractors || []
        }));
    }

    private parseSpelling(response: AIResponse): SpellingQuestion[] {
        return response.questions.map(q => ({
            word: q.word,
            correctSpelling: q.word,
            parts: q.parts || [],
            options: q.options || [],
            audioUrl: q.audioUrl || undefined,
            imageUrl: q.imageUrl || undefined,
            hint: q.hint || ''
        }));
    }

    private parseFillInBlank(response: AIResponse): FillInBlankQuestion[] {
        return response.questions.map(q => ({
            imageUrl: q.imageUrl || undefined,
            phrase: q.phrase,
            correctAnswer: q.correctAnswer,
            options: q.options || [],
            fullText: q.fullText
        }));
    }
}
