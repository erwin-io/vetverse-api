import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PetTypeService } from "src/services/pet-type.service";
import { PetType } from "src/shared/entities/PetType";
import { PetTypeController } from "./pet-type.controller";

@Module({
  imports: [TypeOrmModule.forFeature([PetType])],
  controllers: [PetTypeController],
  providers: [PetTypeService],
  exports: [PetTypeService],
})
export class PetTypeModule {}
