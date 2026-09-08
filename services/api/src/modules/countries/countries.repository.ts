import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Prisma, Country, MasterStatus } from '@prisma/client';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';

@Injectable()
export class CountriesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.CountryCreateInput): Promise<Country> {
    return this.prisma.country.create({ data });
  }

  async findById(id: string): Promise<Country | null> {
    return this.prisma.country.findUnique({ where: { id } });
  }

  async findAll(params: {
    page: number;
    limit: number;
    sort: string;
    order: 'asc' | 'desc';
    where?: Prisma.CountryWhereInput;
  }): Promise<PaginatedResult<Country>> {
    const { page, limit, sort, order, where } = params;
    const skip = (page - 1) * limit;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.country.findMany({
        where: { ...where, status: { not: MasterStatus.DELETED } },
        skip,
        take: limit,
        orderBy: { [sort]: order },
      }),
      this.prisma.country.count({
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

  async search(query: string, page: number, limit: number): Promise<PaginatedResult<Country>> {
    const where: Prisma.CountryWhereInput = {
      status: { not: MasterStatus.DELETED },
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { iso2: { contains: query, mode: 'insensitive' } },
        { iso3: { contains: query, mode: 'insensitive' } },
      ],
    };

    return this.findAll({ page, limit, sort: 'name', order: 'asc', where });
  }

  async update(id: string, data: Prisma.CountryUpdateInput): Promise<Country> {
    return this.prisma.country.update({ where: { id }, data });
  }

  async softDelete(id: string): Promise<Country> {
    return this.prisma.country.update({
      where: { id },
      data: { status: MasterStatus.DELETED },
    });
  }

  async restore(id: string): Promise<Country> {
    return this.prisma.country.update({
      where: { id },
      data: { status: MasterStatus.ACTIVE },
    });
  }

  async bulkCreate(data: Prisma.CountryCreateManyInput[]): Promise<{ count: number }> {
    return this.prisma.country.createMany({ data, skipDuplicates: true });
  }
}
