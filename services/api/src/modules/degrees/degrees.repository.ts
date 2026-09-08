import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Prisma, Degree, MasterStatus } from '@prisma/client';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';

@Injectable()
export class DegreesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.DegreeCreateInput): Promise<Degree> {
    return this.prisma.degree.create({ data });
  }

  async findById(id: string): Promise<Degree | null> {
    return this.prisma.degree.findUnique({ where: { id } });
  }

  async findAll(params: {
    page: number;
    limit: number;
    sort: string;
    order: 'asc' | 'desc';
    where?: Prisma.DegreeWhereInput;
  }): Promise<PaginatedResult<Degree>> {
    const { page, limit, sort, order, where } = params;
    const skip = (page - 1) * limit;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.degree.findMany({
        where: { ...where, status: { not: MasterStatus.DELETED } },
        skip,
        take: limit,
        orderBy: { [sort]: order },
      }),
      this.prisma.degree.count({
        where: { ...where, status: { not: MasterStatus.DELETED } },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);
    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  async search(query: string, page: number, limit: number): Promise<PaginatedResult<Degree>> {
    const where: Prisma.DegreeWhereInput = {
      status: { not: MasterStatus.DELETED },
      name: { contains: query, mode: 'insensitive' },
    };
    return this.findAll({ page, limit, sort: 'name', order: 'asc', where });
  }

  async update(id: string, data: Prisma.DegreeUpdateInput): Promise<Degree> {
    return this.prisma.degree.update({ where: { id }, data });
  }

  async softDelete(id: string): Promise<Degree> {
    return this.prisma.degree.update({
      where: { id },
      data: { status: MasterStatus.DELETED },
    });
  }

  async restore(id: string): Promise<Degree> {
    return this.prisma.degree.update({
      where: { id },
      data: { status: MasterStatus.ACTIVE },
    });
  }

  async bulkCreate(data: Prisma.DegreeCreateManyInput[]): Promise<{ count: number }> {
    return this.prisma.degree.createMany({ data, skipDuplicates: true });
  }
}
