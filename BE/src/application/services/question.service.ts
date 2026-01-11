import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuestionSchema } from '../../infrastructure/database/schemas/question.schema';

@Injectable()
export class QuestionService {
    constructor(
        @InjectRepository(QuestionSchema)
        private questionRepo: Repository<QuestionSchema>,
    ) { }

    async findByLevelId(levelId: string) {
        const questions = await this.questionRepo.find({
            where: { levelId, isDeleted: false },
            order: { orderIndex: 'ASC' }
        });

        if (questions.length === 0) {
            return null;
        }

        // If multiple questions exist, return them as an array mixed with DB id
        if (questions.length > 1) {
            return questions.map(q => ({
                ...q.content,
                id: q.id // Expose DB ID for CRUD
            }));
        }

        // If only 1 question exists, check if it's meant to be an array or config.
        // For now, return content to support legacy "Config" style.
        // If the content is an array, returning it is fine.
        // If the content is an object, returning it is fine.
        // But what if we added just 1 word for Spelling? It would return Object instead of Array[1].
        // This is a risk.
        // Solution: Check levelId prefix or maintain a list of "Array-based" levels.

        // HACK: For Vietnamese levels, ALWAYS return array.
        // Even if there is only 1 word.
        if (levelId === 'spelling' || levelId === 'simple-words' || levelId.startsWith('vietnamese-')) {
            return questions.map(q => ({
                ...q.content,
                id: q.id
            }));
        }

        return questions[0].content;
    }

    async create(levelId: string, content: any, type: string) {
        const count = await this.questionRepo.count({ where: { levelId } });
        const question = this.questionRepo.create({
            levelId,
            content,
            questionType: type,
            orderIndex: count + 1
        });
        return this.questionRepo.save(question);
    }

    async update(id: number, content: any) {
        await this.questionRepo.update(id, { content });
        return this.questionRepo.findOne({ where: { id } });
    }

    async delete(id: number) {
        return this.questionRepo.update(id, { isDeleted: true });
    }
}
