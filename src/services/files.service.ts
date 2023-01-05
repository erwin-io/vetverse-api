import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { createReadStream, ReadStream } from "fs";
import { extname, join } from "path";
import { Files } from "src/shared/entities/Files";
import { UserProfilePic } from "src/shared/entities/UserProfilePic";
import { Repository } from "typeorm";

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(Files) private readonly filesRepo: Repository<Files>
  ) {}

}
