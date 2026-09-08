import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Prisma, University, MasterStatus } from '@prisma/client';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';

@Injectable()
export class UniversitiesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.UniversityCreateInput): Promise<University> {
    return this.prisma.university.create({ data });
  }

  async findById(id: string): Promise<University | null> {
    return this.prisma.university.findUnique({
      where: { id },
      include: { country: true },
    });
  }

  async findAll(params: {
    page: number;
    limit: number;
    sort: string;
    order: 'asc' | 'desc';
    where?: Prisma.UniversityWhereInput;
  }): Promise<PaginatedResult<University>> {
    const { page, limit, sort, order, where } = params;
    const skip = (page - 1) * limit;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.university.findMany({
        where: { ...where, status: { not: MasterStatus.DELETED } },
        skip,
        take: limit,
        orderBy: { [sort]: order },
        include: { country: true },
      }),
      this.prisma.university.count({
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

  async search(query: string, page: number, limit: number): Promise<PaginatedResult<University>> {
    const where: Prisma.UniversityWhereInput = {
      status: { not: MasterStatus.DELETED },
      name: { contains: query, mode: 'insensitive' },
    };
    return this.findAll({ page, limit, sort: 'name', order: 'asc', where });
  }

  async update(id: string, data: Prisma.UniversityUpdateInput): Promise<University> {
    return this.prisma.university.update({ where: { id }, data });
  }

  async softDelete(id: string): Promise<University> {
    return this.prisma.university.update({
      where: { id },
      data: { status: MasterStatus.DELETED },
    });
  }

  async restore(id: string): Promise<University> {
    return this.prisma.university.update({
      where: { id },
      data: { status: MasterStatus.ACTIVE },
    });
  }

  async bulkCreate(data: Prisma.UniversityCreateManyInput[]): Promise<{ count: number }> {
    return this.prisma.university.createMany({ data, skipDuplicates: true });
  }

  async findOrCreate(name: string): Promise<University> {
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    const existing = await this.prisma.university.findFirst({
      where: {
        OR: [
          { slug },
          { name: { equals: name, mode: 'insensitive' } },
        ],
      },
      include: { country: true },
    });
    if (existing) return existing;

    return this.prisma.university.create({
      data: {
        name: name.trim(),
        slug,
        status: MasterStatus.ACTIVE,
      },
      include: { country: true },
    });
  }
}
