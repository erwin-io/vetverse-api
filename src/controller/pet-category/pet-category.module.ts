import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PetCategoryService } from "src/services/pet-category.service";
import { PetCategory } from "src/shared/entities/PetCategory";
import { PetCategoryController } from "./pet-category.controller";

@Module({
  imports: [TypeOrmModule.forFeature([PetCategory])],
  controllers: [PetCategoryController],
  providers: [PetCategoryService],
  exports: [PetCategoryService],
})
export class PetCategoryModule {}
