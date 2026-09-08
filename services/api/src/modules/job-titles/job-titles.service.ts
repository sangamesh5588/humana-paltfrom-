import { Injectable, NotFoundException } from '@nestjs/common';
import { JobTitlesRepository } from './job-titles.repository';
import { CreateJobTitleDto } from './dto/create-job-title.dto';
import { UpdateJobTitleDto } from './dto/update-job-title.dto';
import { PaginationQueryDto, SearchQueryDto } from '../../common/dto/pagination-query.dto';

@Injectable()
export class JobTitlesService {
  constructor(private readonly repo: JobTitlesRepository) {}

  async create(dto: CreateJobTitleDto) { return this.repo.create(dto as any); }

  async findAll(query: PaginationQueryDto) {
    return this.repo.findAll({ page: query.page ?? 1, limit: query.limit ?? 20, sort: query.sort ?? 'title', order: query.order ?? 'asc' });
  }

  async findById(id: string) {
    const item = await this.repo.findById(id);
    if (!item) throw new NotFoundException('Job Title not found');
    return item;
  }

  async search(query: SearchQueryDto) { return this.repo.search(query.q ?? '', query.page ?? 1, query.limit ?? 20); }
  async update(id: string, dto: UpdateJobTitleDto) { await this.findById(id); return this.repo.update(id, dto as any); }
  async remove(id: string) { await this.findById(id); return this.repo.softDelete(id); }
  async restore(id: string) { await this.findById(id); return this.repo.restore(id); }

  async findOrCreate(title: string) {
    if (!title || title.trim().length < 2) {
      throw new NotFoundException('Job title must be at least 2 characters');
    }
    return this.repo.findOrCreate(title);
  }

  async bulkCreate(data: CreateJobTitleDto[]) { return this.repo.bulkCreate(data as any); }
}
