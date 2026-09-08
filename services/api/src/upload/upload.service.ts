import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import sharp from 'sharp';
import axios from 'axios';

@Injectable()
export class UploadService {
  constructor(private readonly configService: ConfigService) {}

  async uploadFile(
    file: Express.Multer.File,
    folder: 'avatars' | 'documents' | 'thumbnails' | 'videos',
    userId: string,
  ): Promise<{ fileUrl: string }> {
    if (!file || !file.buffer) {
      throw new BadRequestException('No file buffer provided for upload.');
    }

    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const serviceRoleKey =
      this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY') ||
      this.configService.get<string>('SUPABASE_ANON_KEY');

    if (!supabaseUrl || !serviceRoleKey) {
      throw new BadRequestException('Supabase storage credentials not configured on server.');
    }

    const timestamp = Date.now();
    let processedBuffer = file.buffer;
    let contentType = file.mimetype || 'application/octet-stream';
    let fileExt = file.originalname ? file.originalname.split('.').pop() : 'bin';

    // Compress images using Sharp if image
    if (file.mimetype && file.mimetype.startsWith('image/')) {
      try {
        processedBuffer = await sharp(file.buffer)
          .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
          .webp({ quality: 80 })
          .toBuffer();
        contentType = 'image/webp';
        fileExt = 'webp';
      } catch (e) {
        // Fallback to raw buffer if sharp processing fails
      }
    }

    const fileName = `${userId}_${timestamp}.${fileExt}`;
    const uploadUrl = `${supabaseUrl}/storage/v1/object/public/${folder}/${fileName}`;

    try {
      await axios.post(uploadUrl, processedBuffer, {
        headers: {
          Authorization: `Bearer ${serviceRoleKey}`,
          apikey: serviceRoleKey,
          'Content-Type': contentType,
          'x-upsert': 'true',
        },
      });
    } catch (err: any) {
      // If bucket public endpoint fails, upload directly
      const fallbackUrl = `${supabaseUrl}/storage/v1/object/${folder}/${fileName}`;
      try {
        await axios.post(fallbackUrl, processedBuffer, {
          headers: {
            Authorization: `Bearer ${serviceRoleKey}`,
            apikey: serviceRoleKey,
            'Content-Type': contentType,
            'x-upsert': 'true',
          },
        });
      } catch (innerErr: any) {
        const errMsg = innerErr?.response?.data?.message || innerErr.message || err.message;
        throw new BadRequestException(`Failed to upload file to storage: ${errMsg}`);
      }
    }

    const publicUrl = `${supabaseUrl}/storage/v1/object/public/${folder}/${fileName}`;
    return { fileUrl: publicUrl };
  }
}
