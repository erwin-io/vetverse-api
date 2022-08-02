import { Users } from "./../../shared/entities/Users";
import {
  CreateClientUserDto,
  CreateStaffUserDto,
} from "./../users/dto/user.create.dto";
import { Injectable, HttpException, HttpStatus, UnauthorizedException } from "@nestjs/common";
import { CreateUserDto } from "../users/dto/user.create.dto";
import { RegistrationStatus } from "./interfaces/regisration-status.interface";
import { UsersService } from "../users/users.service";
import { LoginStatus } from "./interfaces/login-status.interface";
import { LoginUserDto } from "../users/dto/user-login.dto";
import { UserDto, UsernameDto } from "../users/dto/user.dto";
import { JwtPayload } from "./interfaces/payload.interface";
import { JwtService } from "@nestjs/jwt";
import { TokenPayload } from "./interfaces/tokenPayload.interface";
import * as fs from "fs";
import * as path from "path";
import { compare, hash } from "src/common/utils/utils";
import { Staff } from "src/shared/entities/Staff";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async registerClient(userDto: CreateClientUserDto) {
    return await this.usersService.createClientUser(userDto);
  }

  async registerStaff(userDto: CreateStaffUserDto) {
    return await this.usersService.createStaffUser(userDto);
  }

  async login({ username, password }: LoginUserDto) {
    // find user in db
    const user: Users = await this.usersService.findByLogin(username, password);

    // generate and sign token
    const { userId } = user;
    const getInfo: any = await this.usersService.findById(userId);
    const accessToken: string = await this.getAccessToken(userId);
    const refreshToken: string = await this.getRefreshToken(userId);

    await this.updateRefreshTokenInUser(refreshToken, userId)
    const userType = getInfo.user.userType;
    const fullName = getInfo.firtstName + ' ' + (getInfo.MiddleName !== undefined ? getInfo.MiddleName + ' ' +  getInfo.lastName: getInfo.lastName);
    const
    {
      firtstName,
      middleName,
      lastName,
      email,
      mobileNumber,
      address,
      birthDate,
      age,
      gender
    } = getInfo;
    return {
      userId,
      username,
      userType,
      fullName,
      firtstName,
      middleName,
      lastName,
      email,
      mobileNumber,
      address,
      birthDate,
      age,
      gender,
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
    const expiresIn = "1h";

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
    const expiresIn = "1800s";

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
      refreshToken,
    );

    if (isRefreshTokenMatching) {
      await this.updateRefreshTokenInUser(null, userId);
      return result;
    } else {
      throw new UnauthorizedException();
    }
  }
}
