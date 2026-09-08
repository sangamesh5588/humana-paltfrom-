import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UploadService } from './upload.service';

@ApiTags('Upload')
@Controller('upload')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('document')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload verification document (PDF/Image)' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 200, description: 'Document uploaded successfully' })
  async uploadDocument(
    @CurrentUser() user: { id: string },
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('No file attached');
    return this.uploadService.uploadFile(file, 'documents', user.id);
  }

  @Post('thumbnail')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload session thumbnail image' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 200, description: 'Thumbnail uploaded successfully' })
  async uploadThumbnail(
    @CurrentUser() user: { id: string },
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('No file attached');
    return this.uploadService.uploadFile(file, 'thumbnails', user.id);
  }

  @Post('video')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload session intro video' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 200, description: 'Video uploaded successfully' })
  async uploadVideo(
    @CurrentUser() user: { id: string },
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('No file attached');
    return this.uploadService.uploadFile(file, 'videos', user.id);
  }
}
