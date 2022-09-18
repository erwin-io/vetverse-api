import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm/dist/typeorm.module";
import { ServiceType } from "../../shared/entities/ServiceType";
import { ServiceTypeService } from "../../services/service-type.service";
import { ServiceTypeController } from "./service-type.controller";

@Module({
  imports: [TypeOrmModule.forFeature([ServiceType])],
  controllers: [ServiceTypeController],
  providers: [ServiceTypeService],
  exports: [ServiceTypeService],
})
export class ServiceTypeModule {}
