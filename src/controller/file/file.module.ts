import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FileController } from "./file.controller";

@Module({
  imports: [],
  controllers: [FileController],
  providers: [],
  exports: [],
})
export class FileModule {}
