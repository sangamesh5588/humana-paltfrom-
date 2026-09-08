import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateSkillDto {
  @ApiProperty({ example: 'React' })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({ example: 'react' })
  @IsNotEmpty()
  @IsString()
  slug!: string;

  @ApiPropertyOptional({ example: 'Frontend' })
  @IsOptional()
  @IsString()
  category?: string;
}
