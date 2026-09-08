import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';

export enum DegreeLevelEnum {
  NONE = 'NONE',
  LKG = 'LKG',
  PRIMARY = 'PRIMARY',
  MIDDLE = 'MIDDLE',
  HIGH_SCHOOL = 'HIGH_SCHOOL',
  SENIOR_SECONDARY = 'SENIOR_SECONDARY',
  DIPLOMA = 'DIPLOMA',
  BACHELORS = 'BACHELORS',
  MASTERS = 'MASTERS',
  DOCTORATE = 'DOCTORATE',
  POST_DOCTORATE = 'POST_DOCTORATE',
  CERTIFICATE = 'CERTIFICATE',
  SELF_TAUGHT = 'SELF_TAUGHT',
}

export class CreateDegreeDto {
  @ApiProperty({ example: 'Bachelor of Technology' })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({ example: 'bachelor-of-technology' })
  @IsNotEmpty()
  @IsString()
  slug!: string;

  @ApiPropertyOptional({ enum: DegreeLevelEnum })
  @IsOptional()
  @IsEnum(DegreeLevelEnum)
  level?: DegreeLevelEnum;
}
