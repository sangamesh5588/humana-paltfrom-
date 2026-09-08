import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Prisma, Company, MasterStatus } from '@prisma/client';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';

@Injectable()
export class CompaniesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.CompanyCreateInput): Promise<Company> {
    return this.prisma.company.create({ data });
  }

  async findById(id: string): Promise<Company | null> {
    return this.prisma.company.findUnique({ where: { id }, include: { industry: true, country: true } });
  }

  async findAll(params: {
    page: number; limit: number; sort: string; order: 'asc' | 'desc';
    where?: Prisma.CompanyWhereInput;
  }): Promise<PaginatedResult<Company>> {
    const { page, limit, sort, order, where } = params;
    const skip = (page - 1) * limit;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.company.findMany({
        where: { ...where, status: { not: MasterStatus.DELETED } },
        skip, take: limit, orderBy: { [sort]: order },
        include: { industry: true, country: true },
      }),
      this.prisma.company.count({ where: { ...where, status: { not: MasterStatus.DELETED } } }),
    ]);

    const totalPages = Math.ceil(total / limit);
    return { data, meta: { total, page, limit, totalPages, hasNext: page < totalPages, hasPrev: page > 1 } };
  }

  async search(query: string, page: number, limit: number): Promise<PaginatedResult<Company>> {
    const where: Prisma.CompanyWhereInput = {
      status: { not: MasterStatus.DELETED },
      name: { contains: query, mode: 'insensitive' },
    };
    return this.findAll({ page, limit, sort: 'name', order: 'asc', where });
  }

  async update(id: string, data: Prisma.CompanyUpdateInput): Promise<Company> {
    return this.prisma.company.update({ where: { id }, data });
  }

  async softDelete(id: string): Promise<Company> {
    return this.prisma.company.update({ where: { id }, data: { status: MasterStatus.DELETED } });
  }

  async restore(id: string): Promise<Company> {
    return this.prisma.company.update({ where: { id }, data: { status: MasterStatus.ACTIVE } });
  }

  async bulkCreate(data: Prisma.CompanyCreateManyInput[]): Promise<{ count: number }> {
    return this.prisma.company.createMany({ data, skipDuplicates: true });
  }

  async findBySlug(slug: string): Promise<Company | null> {
    return this.prisma.company.findUnique({
      where: { slug },
      include: { industry: true, country: true },
    });
  }

  async findOrCreate(name: string): Promise<Company> {
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    // Try to find by slug first
    const existing = await this.prisma.company.findUnique({
      where: { slug },
      include: { industry: true, country: true },
    });
    if (existing) return existing;

    // Try fuzzy match by name (case-insensitive)
    const fuzzyMatch = await this.prisma.company.findFirst({
      where: {
        status: { not: MasterStatus.DELETED },
        name: { equals: name, mode: 'insensitive' },
      },
      include: { industry: true, country: true },
    });
    if (fuzzyMatch) return fuzzyMatch;

    // Extract domain for logo (best guess: companyname.com)
    const domain = slug.replace(/-/g, '') + '.com';

    // Create new unverified company
    return this.prisma.company.create({
      data: {
        name: name.trim(),
        slug,
        logo: `https://logo.clearbit.com/${domain}`,
        verified: false,
        status: MasterStatus.ACTIVE,
      },
      include: { industry: true, country: true },
    });
  }
}
