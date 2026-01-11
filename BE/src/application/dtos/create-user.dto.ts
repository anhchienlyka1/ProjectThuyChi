import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, IsIn } from 'class-validator';

/**
 * Data Transfer Object - Create User
 * Dùng để validate input từ client
 */
export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    name: string;

    @IsOptional()
    @IsString()
    @IsIn(['male', 'female', 'other'], { message: 'Giới tính phải là "male", "female", hoặc "other"' })
    gender?: string;

    @IsOptional()
    @IsString()
    parentId?: string;
}
