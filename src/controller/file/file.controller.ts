import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import {
  ApiTags,
  ApiBearerAuth,
  ApiProperty,
  ApiBody,
  ApiConsumes,
} from "@nestjs/swagger";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { IsNotEmpty } from "class-validator";
import LocalFilesInterceptor from "../../core/interceptors/localfile.interceptors";
import { createReadStream } from "fs";
import { extname, join } from "path";
import { Response } from "express";
import { UpdateClientProfilePictureDto } from "src/core/dto/users/user.update.dto";
import { FirebaseProvider } from "src/core/provider/firebase/firebase-provider";

export class FileDto {
  @ApiProperty()
  @IsNotEmpty()
  fileName: string;
}
@ApiTags("file")
@Controller("file")
@ApiBearerAuth()
export class FileController {
  constructor(private firebaseProvoder: FirebaseProvider) {}
  @Get(":fileName")
  async getFile(@Param("fileName") fileName: string, @Res() res: Response) {
    try {
      // const file = createReadStream(
      //   join(process.cwd(), "./uploads/profile/" + fileName)
      // ).on("error", function (err) {
      //   res.status(404);
      //   res.json({ message: err.message });
      // });
      // file.pipe(res);
    } catch (ex) {
      res.json({ message: ex.message });
    }
  }

  @Put("upload")
  async upload(
    @UploadedFile() dto: UpdateClientProfilePictureDto,
    @Res() res: Response
  ) {
    try {
      // const base64 = dto.userProfilePic.data.split(",")[1];
      // const img = Buffer.from(base64, "base64");

      // res.writeHead(200, {
      //   "Content-Type": "image/png",
      //   "Content-Length": img.length,
      // });
      // res.send(img);
      res.contentType("image/jpeg");
      res.send(Buffer.from(dto.userProfilePic.data));
    } catch (ex) {
      res.json({ message: ex.message });
    }
  }
}
