import { Controller, Get, Post, Param, Body, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PrismaService } from '../../database/prisma.service';

@ApiTags('Admin Verification')
@Controller('admin/verifications')
export class AdminVerificationController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('pending')
  @ApiOperation({ summary: 'Get all pending experience and education verification requests' })
  @ApiResponse({ status: 200, description: 'List of pending verifications' })
  async getPendingVerifications() {
    const [pendingExperiences, pendingEducations] = await Promise.all([
      this.prisma.experience.findMany({
        where: { verificationStatus: 'PENDING' },
        include: { profile: { include: { user: true } } },
      }),
      this.prisma.education.findMany({
        where: { verificationStatus: 'PENDING' },
        include: { profile: { include: { user: true } } },
      }),
    ]);

    return {
      experiences: pendingExperiences,
      educations: pendingEducations,
    };
  }

  @Post('experience/:id/approve')
  @ApiOperation({ summary: 'Approve an experience verification document' })
  async approveExperience(@Param('id') id: string) {
    const exp = await this.prisma.experience.findUnique({ where: { id } });
    if (!exp) throw new NotFoundException('Experience record not found');

    return this.prisma.experience.update({
      where: { id },
      data: {
        verified: true,
        verificationStatus: 'VERIFIED',
      },
    });
  }

  @Post('experience/:id/reject')
  @ApiOperation({ summary: 'Reject an experience verification document' })
  async rejectExperience(@Param('id') id: string, @Body() _body: { reason?: string }) {
    const exp = await this.prisma.experience.findUnique({ where: { id } });
    if (!exp) throw new NotFoundException('Experience record not found');

    return this.prisma.experience.update({
      where: { id },
      data: {
        verified: false,
        verificationStatus: 'REJECTED',
      },
    });
  }

  @Post('education/:id/approve')
  @ApiOperation({ summary: 'Approve an education verification document' })
  async approveEducation(@Param('id') id: string) {
    const edu = await this.prisma.education.findUnique({ where: { id } });
    if (!edu) throw new NotFoundException('Education record not found');

    return this.prisma.education.update({
      where: { id },
      data: {
        verified: true,
        verificationStatus: 'VERIFIED',
      },
    });
  }

  @Post('education/:id/reject')
  @ApiOperation({ summary: 'Reject an education verification document' })
  async rejectEducation(@Param('id') id: string, @Body() _body: { reason?: string }) {
    const edu = await this.prisma.education.findUnique({ where: { id } });
    if (!edu) throw new NotFoundException('Education record not found');

    return this.prisma.education.update({
      where: { id },
      data: {
        verified: false,
        verificationStatus: 'REJECTED',
      },
    });
  }
}
