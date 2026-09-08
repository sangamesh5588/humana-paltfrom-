import { Injectable, NotFoundException } from '@nestjs/common';
import { SkillsRepository } from './skills.repository';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { PaginationQueryDto, SearchQueryDto } from '../../common/dto/pagination-query.dto';

@Injectable()
export class SkillsService {
  constructor(private readonly repo: SkillsRepository) {}
  async create(dto: CreateSkillDto) { return this.repo.create(dto); }
  async findAll(query: PaginationQueryDto) { return this.repo.findAll({ page: query.page ?? 1, limit: query.limit ?? 20, sort: query.sort ?? 'name', order: query.order ?? 'asc' }); }
  async findById(id: string) { const i = await this.repo.findById(id); if (!i) throw new NotFoundException('Skill not found'); return i; }
  async search(query: SearchQueryDto) { return this.repo.search(query.q ?? '', query.page ?? 1, query.limit ?? 20); }
  async update(id: string, dto: UpdateSkillDto) { await this.findById(id); return this.repo.update(id, dto); }
  async remove(id: string) { await this.findById(id); return this.repo.softDelete(id); }
  async restore(id: string) { await this.findById(id); return this.repo.restore(id); }
  async bulkCreate(data: CreateSkillDto[]) { return this.repo.bulkCreate(data); }
}
