import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Exercise, SimpleWordQuestion, SpellingQuestion, FillInBlankQuestion } from '../models/exercise.model';

export interface AIGenerationRequest {
    exerciseType: 'simple-words' | 'spelling' | 'fill-in-blank';
    topic: string;
    questionCount: number;
    difficulty: 'easy' | 'medium' | 'hard';
}

@Injectable({
    providedIn: 'root'
})
export class AiExerciseGeneratorService {
    private readonly GEMINI_API_KEY = 'AIzaSyANucwSnWb2roIJp8iap9LDVqgcDk4pyvc';
    private readonly GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

    constructor(private http: HttpClient) { }

    generateExercise(request: AIGenerationRequest): Observable<Partial<Exercise>> {
        const prompt = this.buildPrompt(request);

        const body = {
            contents: [{
                parts: [{
                    text: prompt
                }]
            }],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 2048,
            }
        };

        return this.http.post<any>(
            `${this.GEMINI_API_URL}?key=${this.GEMINI_API_KEY}`,
            body
        ).pipe(
            map(response => {
                const text = response.candidates[0]?.content?.parts[0]?.text || '';
                return this.parseAIResponse(text, request);
            }),
            catchError(error => {
                console.error('AI Generation Error:', error);
                throw error;
            })
        );
    }

    private buildPrompt(request: AIGenerationRequest): string {
        const { exerciseType, topic, questionCount, difficulty } = request;

        let prompt = `Bạn là một giáo viên tiếng Việt cho trẻ mầm non. Hãy tạo ${questionCount} câu hỏi cho bài tập về chủ đề "${topic}".

Yêu cầu:
- Độ khó: ${difficulty}
- Phù hợp với trẻ 5-7 tuổi
- Từ đơn giản, dễ hiểu
- BẮT BUỘC: Mỗi câu hỏi phải có 1 emoji phù hợp (iconEmoji)

`;

        switch (exerciseType) {
            case 'simple-words':
                prompt += `
Format JSON (STRICT):
{
  "questions": [
    {
      "word": "CÁ",
      "meaning": "Con cá bơi dưới nước",
      "syllables": ["C", "Á"],
      "distractors": ["A", "BA", "M"],
      "iconEmoji": "🐟"
    }
  ]
}

Lưu ý:
- word: CHỮ HOA, tiếng Việt có dấu
- syllables: Tách âm tiết ĐÚNG
- distractors: 3-4 âm tiết KHÁC
- iconEmoji: Emoji phù hợp
`;
                break;

            case 'spelling':
                prompt += `
Format JSON (STRICT):
{
  "questions": [
    {
      "word": "BÀ",
      "correctSpelling": "B-À",
      "hint": "Người sinh ra mẹ",
      "parts": [
        {"text": "B", "missing": false},
        {"text": "À", "missing": true}
      ],
      "options": ["À", "Á", "Ạ", "Ả"],
      "iconEmoji": "👵"
    }
  ]
}
`;
                break;

            case 'fill-in-blank':
                prompt += `
Format JSON (STRICT):
{
  "questions": [
    {
      "phrase": "Cái _àn",
      "correctAnswer": "b",
      "options": ["b", "c", "d", "đ"],
      "fullText": "Cái bàn",
      "iconEmoji": "🪑"
    }
  ]
}
`;
                break;
        }

        prompt += `\n\nCHỈ TRẢ VỀ JSON, KHÔNG CÓ TEXT THÊM.`;
        return prompt;
    }

    private parseAIResponse(text: string, request: AIGenerationRequest): Partial<Exercise> {
        try {
            let jsonText = text.trim();

            if (jsonText.startsWith('```json')) {
                jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
            } else if (jsonText.startsWith('```')) {
                jsonText = jsonText.replace(/```\n?/g, '');
            }

            const parsed = JSON.parse(jsonText);
            const questions = parsed.questions || [];

            const mappedQuestions = questions.map((q: any) => ({
                type: request.exerciseType,
                data: q
            }));

            return {
                type: request.exerciseType,
                category: 'vietnamese',
                difficulty: request.difficulty,
                title: `Bài tập về ${request.topic}`,
                description: `Bài tập về ${request.topic} cho trẻ mầm non`,
                questions: mappedQuestions,
                questionCount: mappedQuestions.length,
                status: 'draft',
                tags: [request.topic, 'AI generated']
            };

        } catch (error) {
            console.error('Failed to parse AI response:', error);
            console.log('Raw response:', text);
            throw new Error('AI response parsing failed. Please try again.');
        }
    }

    suggestTopics(exerciseType: 'simple-words' | 'spelling' | 'fill-in-blank'): string[] {
        const topics: Record<string, string[]> = {
            'simple-words': [
                'Động vật',
                'Hoa quả',
                'Đồ chơi',
                'Phương tiện',
                'Màu sắc',
                'Thiên nhiên',
                'Đồ dùng học tập',
                'Cơ thể'
            ],
            'spelling': [
                'Gia đình',
                'Nghề nghiệp',
                'Hoạt động',
                'Tính từ',
                'Địa điểm',
                'Thời gian'
            ],
            'fill-in-blank': [
                'Đồ vật trong nhà',
                'Đồ dùng học tập',
                'Quần áo',
                'Đồ ăn',
                'Cây cối',
                'Đồ chơi'
            ]
        };

        return topics[exerciseType] || [];
    }
}
