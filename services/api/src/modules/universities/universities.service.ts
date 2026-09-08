import { Injectable, NotFoundException } from '@nestjs/common';
import { UniversitiesRepository } from './universities.repository';
import { CreateUniversityDto } from './dto/create-university.dto';
import { UpdateUniversityDto } from './dto/update-university.dto';
import { PaginationQueryDto, SearchQueryDto } from '../../common/dto/pagination-query.dto';

@Injectable()
export class UniversitiesService {
  constructor(private readonly repo: UniversitiesRepository) {}

  async create(dto: CreateUniversityDto) {
    const { countryId, ...rest } = dto;
    return this.repo.create({
      ...rest,
      ...(countryId && { country: { connect: { id: countryId } } }),
    });
  }

  async findAll(query: PaginationQueryDto) {
    return this.repo.findAll({
      page: query.page ?? 1,
      limit: query.limit ?? 20,
      sort: query.sort ?? 'name',
      order: query.order ?? 'asc',
    });
  }

  async findById(id: string) {
    const item = await this.repo.findById(id);
    if (!item) throw new NotFoundException('University not found');
    return item;
  }

  async search(query: SearchQueryDto) {
    return this.repo.search(query.q ?? '', query.page ?? 1, query.limit ?? 20);
  }

  async update(id: string, dto: UpdateUniversityDto) {
    await this.findById(id);
    const { countryId, ...rest } = dto;
    return this.repo.update(id, {
      ...rest,
      ...(countryId !== undefined && { country: countryId ? { connect: { id: countryId } } : { disconnect: true } }),
    });
  }

  async remove(id: string) {
    await this.findById(id);
    return this.repo.softDelete(id);
  }

  async restore(id: string) {
    await this.findById(id);
    return this.repo.restore(id);
  }

  async findOrCreate(name: string) {
    if (!name || name.trim().length < 2) {
      throw new NotFoundException('University name must be at least 2 characters');
    }
    return this.repo.findOrCreate(name);
  }

  async bulkCreate(data: CreateUniversityDto[]) {
    return this.repo.bulkCreate(data as any);
  }
}
