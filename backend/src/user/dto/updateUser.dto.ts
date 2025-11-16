import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Length, Matches } from 'class-validator';

export class UpdateUserDto {
  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  name?: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  username?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsInt()
  age?: number;

  @IsOptional()
  @IsString()
  @Length(7, 20)
  @Matches(/^\+?[0-9]+$/, { message: 'phone_number must contain only digits and optional leading +' })
  phone_number?: string;

  @IsOptional()
  @IsEnum(['donor', 'recipient', 'volunteer', 'admin'])
  role?: string;
}