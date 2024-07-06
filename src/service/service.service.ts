import { Injectable } from '@nestjs/common';
import { UpdateServiceDto } from './dto/update-Service.dto';
import { from } from 'rxjs';
import { CreateServiceDto } from './dto/create-service.dto';
import { GetServiceDto } from './dto/get-service.dto';
import { Service } from './entities/service.entity';
import { ServiceRepository } from './service.repository';

@Injectable()
export class ServiceService {
  constructor(private ServiceRepository: ServiceRepository) {}

  getServices(
    getServiceDto: GetServiceDto
  ): Promise<{ items: Service[]; total: number }> {
    return this.ServiceRepository.getServices(getServiceDto);
  }
  getServiceById(id: number): Promise<Service> {
    return this.ServiceRepository.getServiceById(id);
  }
  createService(createServiceDto: CreateServiceDto): Promise<Service> {
    return this.ServiceRepository.createService(createServiceDto);
  }
  updateService(
    id: number,
    updateServiceDto: UpdateServiceDto
  ): Promise<Service> {
    return this.ServiceRepository.updateService(id, updateServiceDto);
  }
  deleteService(id: number): Promise<void> {
    return this.ServiceRepository.deleteService(id);
  }
}
