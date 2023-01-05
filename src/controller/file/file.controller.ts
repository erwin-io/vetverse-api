import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiProperty, ApiBody, ApiConsumes } from "@nestjs/swagger";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { IsNotEmpty } from "class-validator";
import LocalFilesInterceptor from "../../core/interceptors/localfile.interceptors";
import { createReadStream } from "fs";
import { extname, join } from "path";
import { Response } from "express";
import { FilesService } from "src/services/files.service";

export class FileDto {
  @ApiProperty()
  @IsNotEmpty()
  fileName: string;
}
@ApiTags("file")
@Controller("file")
@ApiBearerAuth()
export class FileController {

  @Get(":fileName")
  async getFile(@Param("fileName") fileName: string, @Res() res: Response) {
    try {
      const file = createReadStream(
        join(process.cwd(), "./uploads/profile/" + fileName)
      ).on("error", function (err) {
        res.status(404);
        res.json({ message: err.message });
      });
      file.pipe(res);
    } catch (ex) {
      res.json({ message: ex.message });
    }
  }
}
