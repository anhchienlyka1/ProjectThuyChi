import { IsOptional, IsString, MinLength } from 'class-validator';

/**
 * Data Transfer Object - Update User
 */
export class UpdateUserDto {
    @IsOptional()
    @IsString()
    @MinLength(2)
    name?: string;
}
