import { IsString, IsBoolean, IsOptional, IsDateString, IsArray, IsUUID, IsEnum, IsInt } from 'class-validator';
import { FoodPostCategory, FoodPostStatus, FoodPostUrgency } from '../../entities/foodpost.entity';

export enum AvailabilityStatus {
  AVAILABLE = 'available',
  UNAVAILABLE = 'unavailable',
}

export enum PostStatus {
  NEW = 'new',
  PICKED = 'picked',
  COMPLETED = 'completed',
  EXPIRED = 'expired',
}

export class CreateFoodpostDto {
  @IsInt()
  donorId: number;

  @IsOptional()
  @IsInt()
  recipientId?: number | null;

  @IsOptional()
  @IsInt()
  riderId?: number | null;

  @IsOptional()
  @IsBoolean()
  availability?: boolean;

  @IsOptional()
  @IsString()
  picture_url?: string | null;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsOptional()
  @IsDateString()
  posting_date?: string;

  @IsOptional()
  @IsDateString()
  expiry_date?: string;

  @IsOptional()
  @IsDateString()
  pickup_date?: string | null;

  @IsOptional()
  @IsEnum(FoodPostCategory)
  category?: FoodPostCategory;

  @IsOptional()
  @IsString()
  tags?: string | null;

  @IsOptional()
  @IsEnum(FoodPostStatus)
  status?: FoodPostStatus;

  @IsOptional()
  @IsEnum(FoodPostUrgency)
  urgency?: FoodPostUrgency;
}
