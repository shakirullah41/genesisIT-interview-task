import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Repository, DataSource, ILike } from 'typeorm';
import { CreateServiceDto } from './dto/create-service.dto';
import { GetServiceDto } from './dto/get-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Service } from './entities/service.entity';

@Injectable()
export class ServiceRepository extends Repository<Service> {
  constructor(private dataSource: DataSource) {
    super(Service, dataSource.createEntityManager());
  }
  async getServiceById(id: number): Promise<Service> {
    const query: any = {
      where: { id },
    };
    const found = await this.findOne(query);
    if (!found) {
      throw new NotFoundException(`Service with ID "${id}" not found`);
    }
    return found;
  }
  async getServices(
    getServiceDto: GetServiceDto
  ): Promise<{ items: Service[]; total: number }> {
    const { name, merchantId, page, pageSize, latitude, longitude } =
      getServiceDto;
    const radius = 50;

    const pageOffset = (page - 1) * pageSize;

    try {
      const query = this.createQueryBuilder('service')
        .leftJoinAndSelect('service.merchant', 'merchant')
        .skip(pageOffset)
        .take(pageSize)
        .orderBy('service.created_at', 'DESC');

      if (name) {
        query.andWhere('service.name ILIKE :name', { name: `%${name}%` });
      }
      if (merchantId) {
        query.andWhere('service.merchantId = :merchantId', { merchantId });
      }
      // NOTE: search for the all nearest services within 50 Km of the area.
      // for ths to work we need to install and add postgis extension to database

      if (latitude && longitude) {
        query.andWhere(
          `
          ( 6371 * acos( cos( radians(:latitude) ) * cos( radians(service.latitude) ) * cos( radians(service.longitude) - radians(:longitude) ) + sin( radians(:latitude) ) * sin( radians(service.latitude) ) ) ) < :radius
        `,
          { latitude, longitude, radius }
        );
      }

      const [items, total] = await query.getManyAndCount();
      return { items, total };
    } catch (e) {
      console.log(e);
      if (['23505', '23503', '23502', '23514'].includes(e.code)) {
        throw new ConflictException(e.detail);
      } else {
        throw new InternalServerErrorException({
          error: 'Something went wrong, please try again later.',
        });
      }
    }
  }
  async createService(createServiceDto: CreateServiceDto): Promise<Service> {
    const { name, price, merchantId, latitude, longitude } = createServiceDto;

    const service = new Service();
    service.name = name;
    service.price = price;
    service.merchantId = merchantId;
    service.latitude = latitude;
    service.longitude = longitude;
    try {
      await this.save(service);
    } catch (e) {
      console.log(e);
      if (['23505', '23503', '23502', '23514'].includes(e.code)) {
        throw new ConflictException(e.detail);
      } else {
        throw new InternalServerErrorException({
          error: 'Something went wrong, please try again later.',
        });
      }
    }
    return service;
  }
  async updateService(
    id,
    updateServiceDto: UpdateServiceDto
  ): Promise<Service> {
    try {
      const service = await this.getServiceById(id);
      if (!service) {
        throw new NotFoundException(`Service with ID "${id}" not found`);
      }
      const { name, price, merchantId, latitude, longitude } = updateServiceDto;
      service.name = name;
      service.price = price;
      service.merchantId = merchantId;
      service.latitude = latitude;
      service.longitude = longitude;
      await this.save(service);
      return service;
    } catch (e) {
      console.log(e);
      if (['23505', '23503', '23502', '23514'].includes(e.code)) {
        throw new ConflictException(e.detail);
      } else {
        throw new InternalServerErrorException({
          error: 'Something went wrong, please try again later.',
        });
      }
    }
  }

  async deleteService(id: number): Promise<void> {
    try {
      const Service = await this.getServiceById(id);
      await this.remove(Service);
    } catch (e) {
      if ('23503') {
        throw new ConflictException(
          'Service associated with other entities, can not be deleted'
        );
      }
      if (['23505', '23503', '23502', '23514'].includes(e.code)) {
        throw new ConflictException(e.detail);
      } else {
        throw new InternalServerErrorException({
          error: 'Something went wrong, please try again later.',
        });
      }
    }
  }
}
