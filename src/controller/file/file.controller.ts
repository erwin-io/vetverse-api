import {
  Body,
  Controller,
  Post,
  Req,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiProperty } from "@nestjs/swagger";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { IsNotEmpty } from "class-validator";
import LocalFilesInterceptor from "../../core/interceptors/localfile.interceptors";

export class FileDto {
  @ApiProperty()
  @IsNotEmpty()
  fileName: string;
}
@ApiTags("file")
@Controller("file")
@ApiBearerAuth()
export class FileController {
  @Post("")
  @UseInterceptors(
    LocalFilesInterceptor({
      fieldName: "file",
      path: "/avatars",
    })
  )
  async addAvatar(@UploadedFile() file: Express.Multer.File) {
    const theFile = {
      path: file.path,
      filename: file.originalname,
      mimetype: file.mimetype,
    };
  }
}
