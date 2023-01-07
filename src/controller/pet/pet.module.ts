import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FirebaseProviderModule } from "src/core/provider/firebase/firebase-provider.module";
import { PetService } from "src/services/pet.service";
import { Pet } from "src/shared/entities/Pet";
import { PetController } from "./pet.controller";

@Module({
  imports: [FirebaseProviderModule, TypeOrmModule.forFeature([Pet])],
  controllers: [PetController],
  providers: [PetService],
  exports: [PetService],
})
export class PetModule {}
