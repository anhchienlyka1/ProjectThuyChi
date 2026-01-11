import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';

export enum LoginType {
    STUDENT = 'student',
    PARENT = 'parent',
}

export class LoginDto {
    @IsOptional()
    @IsString()
    username?: string;

    @IsNotEmpty()
    @IsString()
    pinCode: string;

    @IsNotEmpty()
    @IsEnum(LoginType)
    type: LoginType;
}
