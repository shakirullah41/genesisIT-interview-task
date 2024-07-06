import { Module } from '@nestjs/common';
import { ServiceController } from './service.controller';
import { ServiceService } from './service.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { ServiceRepository } from './service.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Service])],
  controllers: [ServiceController],
  providers: [ServiceService, ServiceRepository],
})
export class ServiceModule {}
