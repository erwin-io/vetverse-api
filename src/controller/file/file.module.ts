import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FirebaseProviderModule } from "src/core/provider/firebase/firebase-provider.module";
import { Files } from "src/shared/entities/Files";
import { FileController } from "./file.controller";

@Module({
  imports: [FirebaseProviderModule, TypeOrmModule.forFeature([Files])],
  controllers: [FileController],
  providers: [],
  exports: [],
})
export class FileModule {}
