import { EntityStatus } from "./../entities/EntityStatus";
import { UserType } from "./../entities/UserType";
import { Gender } from "./../entities/Gender";
import { Staff } from "./../entities/Staff";
import { Clients } from "./../entities/Clients";
import { Users } from "./../entities/Users";
import { Injectable, Inject } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from "@nestjs/typeorm";

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  @Inject(ConfigService)
  private readonly config: ConfigService;

  public createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: "mssql",
      host: this.config.get<string>("DATABASE_HOST"),
      // port: Number(this.config.get<number>("DATABASE_PORT")),
      database: this.config.get<string>("DATABASE_NAME"),
      username: this.config.get<string>("DATABASE_USER"),
      password: this.config.get<string>("DATABASE_PASSWORD"),
      entities: [Users, Clients, Staff, Gender, UserType, EntityStatus],
      synchronize: false, // never use TRUE in production!
      options: { encrypt: false },
    };
  }
}
