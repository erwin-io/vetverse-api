import { FileInterceptor } from "@nestjs/platform-express";
import { Injectable, mixin, NestInterceptor, Type } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import { diskStorage } from "multer";
import { extname } from "path";

interface LocalFilesInterceptorOptions {
  fieldName: string;
  path?: string;
  maxCount?: number;
}

function LocalFilesInterceptor(
  options: LocalFilesInterceptorOptions
): Type<NestInterceptor> {
  @Injectable()
  class Interceptor implements NestInterceptor {
    fileInterceptor: NestInterceptor;
    constructor(configService: ConfigService) {
      const filesDestination = configService.get<string>(
        "UPLOADED_FILES_DESTINATION"
      );

      const destination = `${filesDestination}${options.path}`;

      const multerOptions: MulterOptions = {
        storage: diskStorage({
          destination,
          filename: (req, file, cb) => {
            // Generating a 32 random chars long string
            const randomName = Array(32)
              .fill(null)
              .map(() => Math.round(Math.random() * 16).toString(16))
              .join("");
            //Calling the callback passing the random name generated with the original extension name
            cb(null, `${randomName}${extname(file.originalname)}`);
          },
        }),
      };

      this.fileInterceptor = new (FileInterceptor(
        options.fieldName,
        multerOptions
      ))();
    }

    intercept(...args: Parameters<NestInterceptor["intercept"]>) {
      return this.fileInterceptor.intercept(...args);
    }
  }
  return mixin(Interceptor);
}

export default LocalFilesInterceptor;
