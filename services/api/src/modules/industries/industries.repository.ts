import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Prisma, Industry, MasterStatus } from '@prisma/client';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';

@Injectable()
export class IndustriesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.IndustryCreateInput): Promise<Industry> {
    return this.prisma.industry.create({ data });
  }

  async findById(id: string): Promise<Industry | null> {
    return this.prisma.industry.findUnique({ where: { id } });
  }

  async findAll(params: {
    page: number;
    limit: number;
    sort: string;
    order: 'asc' | 'desc';
    where?: Prisma.IndustryWhereInput;
  }): Promise<PaginatedResult<Industry>> {
    const { page, limit, sort, order, where } = params;
    const skip = (page - 1) * limit;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.industry.findMany({
        where: { ...where, status: { not: MasterStatus.DELETED } },
        skip,
        take: limit,
        orderBy: { [sort]: order },
      }),
      this.prisma.industry.count({
        where: { ...where, status: { not: MasterStatus.DELETED } },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);
    return {
      data,
      meta: { total, page, limit, totalPages, hasNext: page < totalPages, hasPrev: page > 1 },
    };
  }

  async search(query: string, page: number, limit: number): Promise<PaginatedResult<Industry>> {
    const where: Prisma.IndustryWhereInput = {
      status: { not: MasterStatus.DELETED },
      name: { contains: query, mode: 'insensitive' },
    };
    return this.findAll({ page, limit, sort: 'name', order: 'asc', where });
  }

  async update(id: string, data: Prisma.IndustryUpdateInput): Promise<Industry> {
    return this.prisma.industry.update({ where: { id }, data });
  }

  async softDelete(id: string): Promise<Industry> {
    return this.prisma.industry.update({ where: { id }, data: { status: MasterStatus.DELETED } });
  }

  async restore(id: string): Promise<Industry> {
    return this.prisma.industry.update({ where: { id }, data: { status: MasterStatus.ACTIVE } });
  }

  async bulkCreate(data: Prisma.IndustryCreateManyInput[]): Promise<{ count: number }> {
    return this.prisma.industry.createMany({ data, skipDuplicates: true });
  }
}
