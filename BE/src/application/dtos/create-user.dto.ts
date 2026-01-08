import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

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
}
