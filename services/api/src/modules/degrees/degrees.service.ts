import { Injectable, NotFoundException } from '@nestjs/common';
import { DegreesRepository } from './degrees.repository';
import { CreateDegreeDto } from './dto/create-degree.dto';
import { UpdateDegreeDto } from './dto/update-degree.dto';
import { PaginationQueryDto, SearchQueryDto } from '../../common/dto/pagination-query.dto';

@Injectable()
export class DegreesService {
  constructor(private readonly repo: DegreesRepository) {}

  async create(dto: CreateDegreeDto) {
    return this.repo.create(dto as any);
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
    if (!item) throw new NotFoundException('Degree not found');
    return item;
  }

  async search(query: SearchQueryDto) {
    return this.repo.search(query.q ?? '', query.page ?? 1, query.limit ?? 20);
  }

  async update(id: string, dto: UpdateDegreeDto) {
    await this.findById(id);
    return this.repo.update(id, dto as any);
  }

  async remove(id: string) {
    await this.findById(id);
    return this.repo.softDelete(id);
  }

  async restore(id: string) {
    await this.findById(id);
    return this.repo.restore(id);
  }

  async bulkCreate(data: CreateDegreeDto[]) {
    return this.repo.bulkCreate(data as any);
  }
}
