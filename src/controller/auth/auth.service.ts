import { Users } from "./../../shared/entities/Users";
import { ClientUserDto, StaffUserDto } from "./../users/dto/user.create.dto";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { LoginUserDto } from "../users/dto/user-login.dto";
import { JwtPayload } from "./interfaces/payload.interface";
import { JwtService } from "@nestjs/jwt";
import * as fs from "fs";
import * as path from "path";
import { compare, hash } from "src/common/utils/utils";
import { RolesService } from "../roles/roles.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
    private readonly jwtService: JwtService
  ) {}

  async registerClient(userDto: ClientUserDto) {
    return await this.usersService.registerClientUser(userDto);
  }

  async registerStaff(userDto: StaffUserDto) {
    return await this.usersService.registerStaffUser(userDto);
  }

  async login({ username, password }: LoginUserDto) {
    // find user in db
    const user: Users = await this.usersService.findByLogin(username, password);

    // generate and sign token
    const { userId } = user;
    const getInfo: any = await this.usersService.findById(userId);
    const accessToken: string = await this.getAccessToken(userId);
    const refreshToken: string = await this.getRefreshToken(userId);

    const roleIds =
      !user.roleIds || user.roleIds === "" ? [] : user.roleIds.split(",");
    const roles = await this.rolesService.findByGroupId(roleIds);
    let access = [];
    roles.forEach((r) => {
      const roleAccess = r.access.split(",");
      access = access.concat(roleAccess);
    });
    await this.updateRefreshTokenInUser(refreshToken, userId);
    const userType = getInfo.user.userType;
    const {
      firstName,
      middleName,
      lastName,
      email,
      mobileNumber,
      address,
      birthDate,
      age,
      gender,
      fullName,
    } = getInfo;
    return {
      userId,
      username,
      userType,
      fullName,
      firstName,
      middleName,
      lastName,
      email,
      mobileNumber,
      address,
      birthDate,
      age,
      gender,
      access,
      accessToken,
      refreshToken,
    };
  }

  async logOut(userId: string) {
    await this.updateRefreshTokenInUser(null, userId);
  }

  private getAccessToken(userId: string): any {
    const secret = fs.readFileSync(
      path.join(__dirname, "../../../private.key")
    );
    const expiresIn = "1hr";

    const user: JwtPayload = { userId };
    const accessToken = this.jwtService.sign(user, {
      secret: secret,
      expiresIn: expiresIn,
    });
    return accessToken;
  }

  async getRefreshToken(userId: string) {
    const secret = fs.readFileSync(
      path.join(__dirname, "../../../refreshtoken.private.key")
    );
    const expiresIn = "1hr";

    const user: JwtPayload = { userId };
    const accessToken = this.jwtService.sign(user, {
      secret: secret,
      expiresIn: expiresIn,
    });
    return accessToken;
  }

  async updateRefreshTokenInUser(refreshToken, userId) {
    if (refreshToken) {
      refreshToken = await hash(refreshToken);
    }

    await this.usersService.setCurrentRefreshToken(refreshToken, userId);
  }

  async getNewAccessAndRefreshToken(userId: string) {
    const refreshToken = await this.getRefreshToken(userId);
    await this.updateRefreshTokenInUser(refreshToken, userId);

    return {
      accessToken: await this.getAccessToken(userId),
      refreshToken: refreshToken,
    };
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: string) {
    const result = await this.usersService.getRefreshTokenUserById(userId);

    const isRefreshTokenMatching = await compare(
      result.refresh_token,
      refreshToken
    );

    if (isRefreshTokenMatching) {
      await this.updateRefreshTokenInUser(null, userId);
      return result;
    } else {
      throw new UnauthorizedException();
    }
  }

  async findByUserName(username) {
    return await this.usersService.findByUsername(username);
  }
}
