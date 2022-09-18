import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateServiceTypeDto } from "src/core/dto/serviceType/serviceType.create.dto";
import { ServiceTypeDto } from "src/core/dto/serviceType/serviceType.update.dtos";
import { ServiceType } from "src/shared/entities/ServiceType";
import { In, Repository } from "typeorm";

@Injectable()
export class ServiceTypeService {
  constructor(
    @InjectRepository(ServiceType)
    private readonly serviceTypeRepo: Repository<ServiceType>
  ) {}

  async findAll() {
    try {
      return await this.serviceTypeRepo.findBy({
        entityStatusId: "1",
      });
    } catch (e) {
      throw e;
    }
  }

  async findOne(options?: any) {
    try {
      const serviceType = await this.serviceTypeRepo.findOneBy(options);
      return serviceType;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async findById(serviceTypeId: string) {
    try {
      const serviceType = await this.findOne({
        serviceTypeId: serviceTypeId,
        entityStatusId: "1",
      });
      if (!serviceType) {
        throw new HttpException("Service Type not found", HttpStatus.NOT_FOUND);
      }
      return serviceType;
    } catch (e) {
      throw e;
    }
  }

  async add(createServiceTypeDto: CreateServiceTypeDto) {
    try {
      const serviceType = new ServiceType();
      serviceType.name = createServiceTypeDto.name;
      serviceType.description = createServiceTypeDto.description;
      serviceType.price = createServiceTypeDto.price;
      serviceType.durationInHours =
        createServiceTypeDto.durationInHours.toString();
      serviceType.isMedicalServiceType =
        createServiceTypeDto.isMedicalServiceType;
      return await this.serviceTypeRepo.save(serviceType);
    } catch (e) {
      throw e;
    }
  }

  async update(serviceTypeDto: ServiceTypeDto) {
    try {
      const { serviceTypeId } = serviceTypeDto;
      const serviceType = await this.findOne({
        serviceTypeId: serviceTypeId,
        entityStatusId: "1",
      });
      if (!serviceType) {
        throw new HttpException("Service Type not found", HttpStatus.NOT_FOUND);
      }
      serviceType.name = serviceTypeDto.name;
      serviceType.description = serviceTypeDto.description;
      serviceType.price = serviceTypeDto.price;
      serviceType.durationInHours = serviceTypeDto.durationInHours.toString();
      serviceType.isMedicalServiceType = serviceTypeDto.isMedicalServiceType;
      return await this.serviceTypeRepo.save(serviceType);
    } catch (e) {
      throw e;
    }
  }

  async delete(serviceTypeId: string) {
    try {
      const serviceType = await this.findOne({
        serviceTypeId: serviceTypeId,
        entityStatusId: "1",
      });
      if (!serviceType) {
        throw new HttpException("Service Type not found", HttpStatus.NOT_FOUND);
      }
      serviceType.name = `deleted_${serviceTypeId}_${new Date()}`;
      serviceType.entityStatusId = "2";
      return await this.serviceTypeRepo.save(serviceType);
    } catch (e) {
      throw e;
    }
  }
}
