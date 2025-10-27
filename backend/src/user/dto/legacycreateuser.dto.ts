import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Length, Matches } from 'class-validator';

export class LegacyCreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  name: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  username: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 255)  // enforce min length for security
  password: string;

  @IsEmail()
  @IsNotEmpty()
  @Length(1, 100)
  email: string;

  @IsOptional()
  @IsString()
  @Length(7, 20)
  @Matches(/^\+?[0-9]+$/, { message: 'phone_number must contain only digits and optional leading +' })
  phone_number?: string;

  @IsEnum(['donor', 'recipient', 'volunteer'])
  role: string;

  @IsString()
  auth_provider: string;
}