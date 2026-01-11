import { IsString, Matches, Length } from 'class-validator';

/**
 * Data Transfer Object - Set PIN Code
 * DTO để cập nhật mã PIN cho user
 */
export class SetPinCodeDto {
    @IsString({ message: 'Mã PIN phải là chuỗi ký tự' })
    @Length(6, 6, { message: 'Mã PIN phải có đúng 6 ký tự' })
    @Matches(/^\d{6}$/, { message: 'Mã PIN phải là 6 chữ số' })
    pinCode: string;
}
