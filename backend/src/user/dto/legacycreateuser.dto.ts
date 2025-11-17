import { IsEmail, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class LegacyCreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @Length(1, 100)
  email: string;

  @IsString()
  @IsOptional()
  auth_provider?: string;
}