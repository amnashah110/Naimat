import { PartialType } from '@nestjs/mapped-types';
import { CreateFoodpostDto } from './createFoodpost.dto';

export class UpdateFoodpostDto extends PartialType(CreateFoodpostDto) {}
