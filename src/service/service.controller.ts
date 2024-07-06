import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { Public } from '../auth/decorator/public.decorator';
import { CreateServiceDto } from './dto/create-service.dto';
import { GetServiceDto } from './dto/get-service.dto';
import { UpdateServiceDto } from './dto/update-Service.dto';
import { Service } from './entities/service.entity';
import { ServiceService } from './service.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Service')
@Controller('service')
export class ServiceController {
  constructor(private ServiceService: ServiceService) {}

  @Get()
  getServices(
    @Query(ValidationPipe) getServiceDto: GetServiceDto
  ): Promise<{ items: Service[]; total: number }> {
    return this.ServiceService.getServices(getServiceDto);
  }
  @Get('/:id')
  getServiceById(@Param('id', ParseIntPipe) id: number): Promise<Service> {
    return this.ServiceService.getServiceById(id);
  }
  @Post()
  createService(
    @Body(ValidationPipe) createServiceDto: CreateServiceDto
  ): Promise<Service> {
    return this.ServiceService.createService(createServiceDto);
  }

  @Put('/:id')
  updateService(
    @Body(ValidationPipe) updateServiceDto: UpdateServiceDto,
    @Param('id', ParseIntPipe) id: number
  ): Promise<Service> {
    return this.ServiceService.updateService(id, updateServiceDto);
  }

  @Delete('/:id')
  deleteService(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.ServiceService.deleteService(id);
  }
}
