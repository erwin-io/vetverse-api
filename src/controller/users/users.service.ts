import { Clients } from "../../shared/entities/Clients";
import {
  UpdateClientUserDto,
  UpdateStaffUserDto,
  UserDto,
} from "./dto/user.update.dto";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";
import {
  ClientUserDto,
  CreateStaffUserDto,
  StaffUserDto,
} from "./dto/user.create.dto";
import {
  compare,
  hash,
  getAge,
  APP_ROLE_GUEST,
  isStaffRegistrationApproved,
} from "../../common/utils/utils";
import { Users } from "../../shared/entities/Users";
import { Gender } from "../../shared/entities/Gender";
import { Staff } from "../../shared/entities/Staff";
import { UserType } from "../../shared/entities/UserType";
import { EntityStatus } from "../../shared/entities/EntityStatus";
import { Roles } from "../../shared/entities/Roles";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private readonly userRepo: Repository<Users>
  ) {}

  async findAll(userTypeId: string) {
    if (Number(userTypeId) === 1) {
      const query = this.userRepo.manager
        .createQueryBuilder("Staff", "s")
        .innerJoinAndSelect("s.gender", "g")
        .innerJoinAndSelect("s.user", "u")
        .innerJoinAndSelect("u.role", "r")
        .innerJoinAndSelect("u.userType", "ut");
      const result = await query.getMany();
      result.map((e: any) => {
        e.fullName =
          e.firstName +
          " " +
          (e.MiddleName !== undefined
            ? e.MiddleName + " " + e.lastName
            : e.lastName);
        e.user = this._sanitizeUser(e.user);
        return e;
      });
      return result;
    } else {
      const query = this.userRepo.manager
        .createQueryBuilder("Clients", "c")
        .innerJoinAndSelect("c.gender", "g")
        .innerJoinAndSelect("c.user", "u")
        .innerJoinAndSelect("u.role", "r")
        .innerJoinAndSelect("u.userType", "ut");
      const result = await query.getMany();
      result.map((e: any) => {
        e.fullName =
          e.firstName +
          " " +
          (e.MiddleName !== undefined
            ? e.MiddleName + " " + e.lastName
            : e.lastName);
        e.user = this._sanitizeUser(e.user);
        return e;
      });
      return result;
    }
  }

  async findOne(
    options?: any,
    sanitizeUser?: boolean,
    entityManager?: EntityManager
  ) {
    const user: any = await entityManager.findOne(Users, {
      where: options,
      relations: ["userType", "role"],
    });
    if (!user) {
      return;
    }
    user.hasActiveSession =
      user.currentHashedRefreshToken === null ||
      user.currentHashedRefreshToken === undefined ||
      user.currentHashedRefreshToken === ""
        ? false
        : true;
    const userTypeId = user.userType.userTypeId;
    if (Number(userTypeId) === 1) {
      const result: any = await entityManager.findOne(Staff, {
        where: {
          user: options,
        },
        relations: ["user", "gender"],
      });
      result.fullName =
        result.firstName +
        " " +
        (result.MiddleName !== undefined
          ? result.MiddleName + " " + result.lastName
          : result.lastName);
      result.user = sanitizeUser ? this._sanitizeUser(user) : result.user;
      if (result.user.role.roleId === APP_ROLE_GUEST.toString())
        result.user.role.roleId = null;
      return result;
    } else {
      const result: any = await entityManager.findOne(Clients, {
        where: {
          user: options,
        },
        relations: ["user", "gender"],
      });
      result.fullName =
        result.firstName +
        " " +
        (result.MiddleName !== undefined
          ? result.MiddleName + " " + result.lastName
          : result.lastName);
      result.user = sanitizeUser ? this._sanitizeUser(user) : result.user;
      if (result.user.role.roleId === APP_ROLE_GUEST.toString())
        result.user.role.roleId = null;
      return result;
    }
  }

  async findById(userId: string) {
    const result = await this.findOne({ userId }, true, this.userRepo.manager);
    if (!result) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }
    return result;
  }

  async findByUsername(username) {
    const result = await this.findOne(
      { username },
      false,
      this.userRepo.manager
    );
    if (result === (null || undefined)) return null;
    return this._sanitizeUser(result.user);
  }

  async findByLogin(username, password) {
    const result = await this.findOne(
      { username },
      false,
      this.userRepo.manager
    );
    if (!result) {
      throw new HttpException("Username not found", HttpStatus.NOT_FOUND);
    }
    if (!result.user.enable) {
      throw new HttpException("Yout account has been disabled", HttpStatus.OK);
    }
    const areEqual = await compare(result.user.password, password);
    if (!areEqual) {
      throw new HttpException("Invalid credentials", HttpStatus.NOT_ACCEPTABLE);
    }
    return this._sanitizeUser(result.user);
  }

  async registerClientUser(userDto: ClientUserDto) {
    const { username } = userDto;
    return await this.userRepo.manager.transaction(async (entityManager) => {
      const userInDb = await this.findOne({ username }, false, entityManager);
      if (userInDb) {
        throw new HttpException("Username already exist", HttpStatus.CONFLICT);
      }
      let user = new Users();
      user.username = userDto.username;
      user.password = await hash(userDto.password);
      user.userType = new UserType();
      user.userType.userTypeId = "2";
      user.role = new Roles();
      user.role.roleId = APP_ROLE_GUEST.toString();
      user.entityStatus = new EntityStatus();
      user.entityStatus.entityStatusId = "1";
      user = await entityManager.save(Users, user);
      let client = new Clients();
      client.user = user;
      client.firstName = userDto.firstName;
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

  async registerStaffUser(userDto: StaffUserDto) {
    const { username } = userDto;

    return await this.userRepo.manager.transaction(async (entityManager) => {
      const userInDb = await this.findOne({ username }, false, entityManager);
      if (userInDb) {
        throw new HttpException("Username already exist", HttpStatus.CONFLICT);
      }
      let user = new Users();
      user.username = userDto.username;
      user.password = await hash(userDto.password);
      user.userType = new UserType();
      user.userType.userTypeId = "1";
      user.entityStatus = new EntityStatus();
      user.role = new Roles();
      user.role.roleId = APP_ROLE_GUEST.toString();
      user.entityStatus.entityStatusId = "1";
      user = await entityManager.save(Users, user);
      let staff = new Staff();
      staff.user = user;
      staff.firstName = userDto.firstName;
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

  async createStaffUser(userDto: CreateStaffUserDto) {
    const { username } = userDto;

    return await this.userRepo.manager.transaction(async (entityManager) => {
      const userInDb = await this.findOne({ username }, false, entityManager);
      if (userInDb) {
        throw new HttpException("Username already exist", HttpStatus.CONFLICT);
      }
      let user = new Users();
      user.username = userDto.username;
      user.password = await hash(userDto.password);
      user.userType = new UserType();
      user.userType.userTypeId = "1";
      user.entityStatus = new EntityStatus();
      user.role = new Roles();
      user.role.roleId = APP_ROLE_GUEST.toString();
      user.entityStatus.entityStatusId = "1";
      user = await entityManager.save(Users, user);
      let staff = new Staff();
      staff.user = user;
      staff.firstName = userDto.firstName;
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

  async updateClientUser(userDto: UpdateClientUserDto) {
    const userId = userDto.userId;

    return await this.userRepo.manager.transaction(async (entityManager) => {
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
      client.firstName = userDto.firstName;
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

  async updateStaffUser(userDto: UpdateStaffUserDto) {
    const userId = userDto.userId;

    return await this.userRepo.manager.transaction(async (entityManager) => {
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
      let user = staff.user;
      user.role.roleId = userDto.roleId;
      user.isAdminApproved = isStaffRegistrationApproved(
        Number(userDto.roleId)
      );
      user = await entityManager.save(Users, user);
      staff.firstName = userDto.firstName;
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

  async getRefreshTokenUserById(userId: string) {
    const result = await this.findOne({ userId }, false, this.userRepo.manager);
    if (!result) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }
    return {
      userId: result.user.userId,
      refresh_token: result.user.currentHashedRefreshToken,
    };
  }

  async setCurrentRefreshToken(
    currentHashedRefreshToken: string,
    userId: number
  ) {
    await this.userRepo.update(userId, {
      currentHashedRefreshToken,
    });
  }

  async toggleEnable(enable: boolean, userId: number) {
    await this.userRepo.update(userId, {
      enable,
    });

    return await this.findOne({ userId }, true, this.userRepo.manager);
  }

  private _sanitizeUser(user: Users) {
    delete user.password;
    delete user.currentHashedRefreshToken;
    return user;
  }
}
