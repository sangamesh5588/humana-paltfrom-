import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Prisma, JobTitle, MasterStatus } from '@prisma/client';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';

@Injectable()
export class JobTitlesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.JobTitleCreateInput): Promise<JobTitle> { return this.prisma.jobTitle.create({ data }); }
  async findById(id: string): Promise<JobTitle | null> { return this.prisma.jobTitle.findUnique({ where: { id } }); }

  async findAll(params: { page: number; limit: number; sort: string; order: 'asc' | 'desc'; where?: Prisma.JobTitleWhereInput; }): Promise<PaginatedResult<JobTitle>> {
    const { page, limit, sort, order, where } = params;
    const skip = (page - 1) * limit;
    const [data, total] = await this.prisma.$transaction([
      this.prisma.jobTitle.findMany({ where: { ...where, status: { not: MasterStatus.DELETED } }, skip, take: limit, orderBy: { [sort]: order } }),
      this.prisma.jobTitle.count({ where: { ...where, status: { not: MasterStatus.DELETED } } }),
    ]);
    const totalPages = Math.ceil(total / limit);
    return { data, meta: { total, page, limit, totalPages, hasNext: page < totalPages, hasPrev: page > 1 } };
  }

  async search(query: string, page: number, limit: number): Promise<PaginatedResult<JobTitle>> {
    return this.findAll({ page, limit, sort: 'title', order: 'asc', where: { status: { not: MasterStatus.DELETED }, title: { contains: query, mode: 'insensitive' } } });
  }

  async update(id: string, data: Prisma.JobTitleUpdateInput): Promise<JobTitle> { return this.prisma.jobTitle.update({ where: { id }, data }); }
  async softDelete(id: string): Promise<JobTitle> { return this.prisma.jobTitle.update({ where: { id }, data: { status: MasterStatus.DELETED } }); }
  async restore(id: string): Promise<JobTitle> { return this.prisma.jobTitle.update({ where: { id }, data: { status: MasterStatus.ACTIVE } }); }
  async bulkCreate(data: Prisma.JobTitleCreateManyInput[]): Promise<{ count: number }> { return this.prisma.jobTitle.createMany({ data, skipDuplicates: true }); }

  async findOrCreate(title: string): Promise<JobTitle> {
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    const existing = await this.prisma.jobTitle.findUnique({ where: { slug } });
    if (existing) return existing;

    const fuzzyMatch = await this.prisma.jobTitle.findFirst({
      where: {
        status: { not: MasterStatus.DELETED },
        title: { equals: title, mode: 'insensitive' },
      },
    });
    if (fuzzyMatch) return fuzzyMatch;

    return this.prisma.jobTitle.create({
      data: {
        title: title.trim(),
        slug,
        status: MasterStatus.ACTIVE,
      },
    });
  }
}
