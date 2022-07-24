import { Clients } from "../../shared/entities/Clients";
import { ClientUserDto, StaffUserDto, UserDto } from "./dto/user.dto";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectConnection, InjectRepository } from "@nestjs/typeorm";
import {
  Connection,
  createQueryBuilder,
  EntityManager,
  Repository,
} from "typeorm";
import { CreateClientUserDto, CreateStaffUserDto } from "./dto/user.create.dto";
import { LoginUserDto } from "./dto/user-login.dto";
import {
  comparePasswords,
  encryptPassword,
  getAge,
} from "../../common/utils/utils";
import { Users } from "src/shared/entities/Users";
import { Gender } from "src/shared/entities/Gender";
import { Staff } from "src/shared/entities/Staff";
import { UserType } from "src/shared/entities/UserType";
import { EntityStatus } from "src/shared/entities/EntityStatus";

@Injectable()
export class UsersService {
  constructor(@InjectConnection() private connection: Connection) {}

  async findAll(userTypeId: string) {
    return await this.connection.transaction(async (entityManager) => {
      if (Number(userTypeId) === 1) {
        const query = entityManager
          .createQueryBuilder("Staff", "s")
          .innerJoinAndSelect("s.gender", "g")
          .innerJoinAndSelect("s.user", "u")
          .innerJoinAndSelect("u.userType", "ut");
        const result = await query.getMany();
        result.map((e: Staff) => {
          e.user = this._sanitizeUser(e.user);
          return e;
        });
        return result;
      } else {
        const query = entityManager
          .createQueryBuilder("Clients", "c")
          .innerJoinAndSelect("c.gender", "g")
          .innerJoinAndSelect("c.user", "u")
          .innerJoinAndSelect("u.userType", "ut");
        const result = await query.getMany();

        result.map((e: Clients) => {
          e.user = this._sanitizeUser(e.user);
          return e;
        });
        return result;
      }
    });
  }

  async findOne(
    options?: any,
    sanitizeUser?: boolean,
    entityManager?: EntityManager
  ) {
    const user = await entityManager.findOne(Users, {
      where: options,
      relations: ["userType"],
    });
    if (!user) {
      return;
    }
    const userTypeId = user.userType.userTypeId;
    if (Number(userTypeId) === 1) {
      const result = await entityManager.findOne(Staff, {
        where: {
          user: options,
        },
        relations: ["user", "gender"],
      });
      result.user = sanitizeUser
        ? this._sanitizeUser(result.user)
        : result.user;
      return result;
    } else {
      const result = await entityManager.findOne(Clients, {
        where: {
          user: options,
        },
        relations: ["user", "gender"],
      });
      result.user = sanitizeUser
        ? this._sanitizeUser(result.user)
        : result.user;
      return result;
    }
  }

  async findById(userId: string) {
    return await this.connection.transaction(async (entityManager) => {
      const user = await this.findOne({ userId }, true, entityManager);
      if (!user) {
        throw new HttpException("User not found", HttpStatus.NOT_FOUND);
      }
    });
  }

  async findByLogin({ username, password }: LoginUserDto) {
    return await this.connection.transaction(async (entityManager) => {
      const result = await this.findOne({ username }, false, entityManager);
      if (!result) {
        throw new HttpException("Username not found", HttpStatus.NOT_FOUND);
      }
      const areEqual = await comparePasswords(result.user.password, password);
      if (!areEqual) {
        throw new HttpException(
          "Invalid credentials",
          HttpStatus.NOT_ACCEPTABLE
        );
      }
      return this._sanitizeUser(result.user);
    });
  }

  async findByPayload({ username }: any) {
    return await this.connection.transaction(async (entityManager) => {
      const result = await this.findOne({ username }, true, entityManager);
      if (!result) {
        throw new HttpException("Username not found", HttpStatus.NOT_FOUND);
      }
      return this._sanitizeUser(result.user);
    });
  }

  async createClientUser(userDto: CreateClientUserDto) {
    const { username } = userDto;
    return await this.connection.transaction(async (entityManager) => {
      const userInDb = await this.findOne({ username }, false, entityManager);
      if (userInDb) {
        throw new HttpException("Username already exist", HttpStatus.CONFLICT);
      }
      let user = new Users();
      user.username = userDto.username;
      user.password = await encryptPassword(userDto.password);
      user.userType = new UserType();
      user.userType.userTypeId = "2";
      user.entityStatus = new EntityStatus();
      user.entityStatus.entityStatusId = "1";
      user = await entityManager.save(Users, user);
      let client = new Clients();
      client.user = user;
      client.firtstName = userDto.firtstName;
      client.middleName = userDto.middleName;
      client.lastName = userDto.lastName;
      client.email = userDto.email;
      client.mobileNumber = userDto.mobileNumber;
      client.birthDate = userDto.birthDate;
      client.age = await (await getAge(userDto.birthDate)).toString();
      client.address = userDto.address;
      client.gender = new Gender();
      client.gender.genderId = userDto.genderId;
      client = await entityManager.save(Clients, client);
      client.user = await this._sanitizeUser(user);
      return client;
    });
  }

  async createStaffUser(userDto: CreateStaffUserDto) {
    const { username } = userDto;

    return await this.connection.transaction(async (entityManager) => {
      const userInDb = await this.findOne({ username }, false, entityManager);
      if (userInDb) {
        throw new HttpException("Username already exist", HttpStatus.CONFLICT);
      }
      let user = new Users();
      user.username = userDto.username;
      user.password = await encryptPassword(userDto.password);
      user.userType = new UserType();
      user.userType.userTypeId = "1";
      user.entityStatus = new EntityStatus();
      user.entityStatus.entityStatusId = "1";
      user = await entityManager.save(Users, user);
      let staff = new Staff();
      staff.user = user;
      staff.firtstName = userDto.firtstName;
      staff.middleName = userDto.middleName;
      staff.lastName = userDto.lastName;
      staff.email = userDto.email;
      staff.mobileNumber = userDto.mobileNumber;
      staff.address = userDto.address;
      staff.gender = new Gender();
      staff.gender.genderId = userDto.genderId;
      staff = await entityManager.save(Staff, staff);
      staff.user = await this._sanitizeUser(user);
      return staff;
    });
  }

  async updateClientUser(userDto: ClientUserDto) {
    const userId = userDto.userId;

    return await this.connection.transaction(async (entityManager) => {
      let client: any = await this.findOne(
        {
          userId,
          userType: { userTypeId: "2" },
        },
        true,
        entityManager
      );
      if (!client) {
        throw new HttpException(`User doesn't exist`, HttpStatus.NOT_FOUND);
      }
      client.firtstName = userDto.firtstName;
      client.middleName = userDto.middleName;
      client.lastName = userDto.lastName;
      client.email = userDto.email;
      client.mobileNumber = userDto.mobileNumber;
      client.birthDate = userDto.birthDate;
      client.age = await (await getAge(userDto.birthDate)).toString();
      client.address = userDto.address;
      client.gender = new Gender();
      client.gender.genderId = userDto.genderId;

      await entityManager.save(Clients, client);
      client = await this.findOne({ userId }, true, entityManager);

      return client;
    });
  }

  async updateStaffUser(userDto: StaffUserDto) {
    const userId = userDto.userId;

    return await this.connection.transaction(async (entityManager) => {
      let staff: any = await this.findOne(
        {
          userId,
          userType: { userTypeId: "1" },
        },
        true,
        entityManager
      );

      if (!staff) {
        throw new HttpException(`User doesn't exist`, HttpStatus.NOT_FOUND);
      }
      staff.firtstName = userDto.firtstName;
      staff.middleName = userDto.middleName;
      staff.lastName = userDto.lastName;
      staff.email = userDto.email;
      staff.mobileNumber = userDto.mobileNumber;
      staff.address = userDto.address;
      staff.gender = new Gender();
      staff.gender.genderId = userDto.genderId;

      await entityManager.save(Staff, staff);
      staff = await this.findOne({ userId }, true, entityManager);

      return staff;
    });
  }

  private _sanitizeUser(user: Users) {
    delete user.password;
    return user;
  }
}
