import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshDto {
  @ApiProperty({ example: 'some-jwt-refresh-token' })
  @IsNotEmpty({ message: 'Refresh token is required' })
  refreshToken!: string;
}
