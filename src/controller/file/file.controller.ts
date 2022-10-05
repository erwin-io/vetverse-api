import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiProperty } from "@nestjs/swagger";
import { FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { IsNotEmpty } from "class-validator";

export class FileDto {
  @ApiProperty()
  @IsNotEmpty()
  fileName: string;
}
@ApiTags("file")
@Controller("file")
@ApiBearerAuth()
export class FileController {
  @Post("upload")
  @UseInterceptors(
    FilesInterceptor("files", 20, {
      storage: diskStorage({
        destination: "./uploads/",
        filename: `F_${new Date().toString()}`,
      }),
      //   fileFilter: imageFileFilter,
    })
  )
  uploadMultipleFiles(@UploadedFiles() files, @Body() file: FileDto) {
    const response = [];
    files.forEach((file) => {
      const fileReponse = {
        filename: file.filename,
      };
      response.push(fileReponse);
    });
    return response;
  }
}
