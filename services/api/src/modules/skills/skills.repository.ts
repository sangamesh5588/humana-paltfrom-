import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Prisma, Skill, MasterStatus } from '@prisma/client';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';

@Injectable()
export class SkillsRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: Prisma.SkillCreateInput): Promise<Skill> { return this.prisma.skill.create({ data }); }
  async findById(id: string): Promise<Skill | null> { return this.prisma.skill.findUnique({ where: { id } }); }
  async findAll(params: { page: number; limit: number; sort: string; order: 'asc' | 'desc'; where?: Prisma.SkillWhereInput; }): Promise<PaginatedResult<Skill>> {
    const { page, limit, sort, order, where } = params;
    const [data, total] = await this.prisma.$transaction([
      this.prisma.skill.findMany({ where: { ...where, status: { not: MasterStatus.DELETED } }, skip: (page - 1) * limit, take: limit, orderBy: { [sort]: order } }),
      this.prisma.skill.count({ where: { ...where, status: { not: MasterStatus.DELETED } } }),
    ]);
    const totalPages = Math.ceil(total / limit);
    return { data, meta: { total, page, limit, totalPages, hasNext: page < totalPages, hasPrev: page > 1 } };
  }
  async search(query: string, page: number, limit: number): Promise<PaginatedResult<Skill>> {
    return this.findAll({ page, limit, sort: 'name', order: 'asc', where: { status: { not: MasterStatus.DELETED }, name: { contains: query, mode: 'insensitive' } } });
  }
  async update(id: string, data: Prisma.SkillUpdateInput): Promise<Skill> { return this.prisma.skill.update({ where: { id }, data }); }
  async softDelete(id: string): Promise<Skill> { return this.prisma.skill.update({ where: { id }, data: { status: MasterStatus.DELETED } }); }
  async restore(id: string): Promise<Skill> { return this.prisma.skill.update({ where: { id }, data: { status: MasterStatus.ACTIVE } }); }
  async bulkCreate(data: Prisma.SkillCreateManyInput[]): Promise<{ count: number }> { return this.prisma.skill.createMany({ data, skipDuplicates: true }); }
}
