import { IsNotEmpty, IsNumber, IsString, IsOptional, IsArray } from 'class-validator';

export class CreateLearningSessionDto {
    @IsNotEmpty()
    @IsString()
    userId: string;

    @IsNotEmpty()
    @IsString()
    levelId: string;

    @IsNotEmpty()
    @IsNumber()
    score: number;

    @IsNotEmpty()
    @IsNumber()
    totalQuestions: number;

    @IsNotEmpty()
    @IsNumber()
    durationSeconds: number;

    @IsOptional()
    @IsArray()
    answers?: any[];
}
