import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FilesService } from "src/services/files.service";
import { Files } from "src/shared/entities/Files";
import { FileController } from "./file.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Files])],
  controllers: [FileController],
  providers: [FilesService],
  exports: [FilesService],
})
export class FileModule {}
