import { IsOptional, IsString, MinLength, IsIn } from 'class-validator';

/**
 * Data Transfer Object - Update User
 */
export class UpdateUserDto {
    @IsOptional()
    @IsString()
    @MinLength(2)
    name?: string;

    @IsOptional()
    @IsString()
    @IsIn(['male', 'female', 'other'], { message: 'Giới tính phải là "male", "female", hoặc "other"' })
    gender?: string;
}
