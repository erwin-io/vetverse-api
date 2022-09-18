import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Roles } from "../../shared/entities/Roles";
import { RolesController } from "./roles.controller";
import { RolesService } from "../../services/roles.service";

@Module({
  imports: [TypeOrmModule.forFeature([Roles])],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
