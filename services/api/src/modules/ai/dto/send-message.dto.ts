import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendMessageDto {
  @ApiProperty({ description: 'The text message from the user' })
  @IsString()
  @IsNotEmpty()
  message!: string;
}
