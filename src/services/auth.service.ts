import { Users } from "../shared/entities/Users";
import { ClientUserDto, StaffUserDto } from "../core/dto/users/user.create.dto";
import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { UsersService } from "../services/users.service";
import { LoginUserDto } from "../core/dto/users/user-login.dto";
import { JwtPayload } from "../core/interfaces/payload.interface";
import { JwtService } from "@nestjs/jwt";
import * as fs from "fs";
import * as path from "path";
import { compare, hash } from "src/common/utils/utils";
import { RoleEnum } from "src/common/enums/role.enum";
import { UserTypeEnum } from "src/common/enums/user-type.enum";
import { NotificationService } from "./notification.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly notificationService: NotificationService,
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
    getInfo.user.role.roleId =
      getInfo.user.role.roleId === null ||
      getInfo.user.role.roleId === undefined
        ? RoleEnum.GUEST.toString()
        : getInfo.user.role.roleId;
    await this.updateRefreshTokenInUser(refreshToken, userId);
    const userType = getInfo.user.userType;
    const userTypeIdentityId =
      userType.userTypeId === UserTypeEnum.CLIENT
        ? getInfo.clientid
        : getInfo.staffid;
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
      role: getInfo.user.role,
      accessToken,
      refreshToken,
      userTypeIdentityId,
      userProfilePic: getInfo.user.userProfilePic
        ? getInfo.user.userProfilePic.file.url
        : null,
    };
  }

  async loginClient({ username, password }: any) {
    // find user in db
    const user: Users = await this.usersService.findByLoginCLient(
      username,
      password
    );

    // generate and sign token
    const { userId, isVerified } = user;
    const getInfo: any = await this.usersService.findById(userId);
    const accessToken: string = await this.getAccessToken(userId);
    const refreshToken: string = await this.getRefreshToken(userId);
    getInfo.user.role.roleId =
      getInfo.user.role.roleId === null ||
      getInfo.user.role.roleId === undefined
        ? RoleEnum.GUEST.toString()
        : getInfo.user.role.roleId;
    await this.updateRefreshTokenInUser(refreshToken, userId);
    const userType = getInfo.user.userType;
    const userTypeIdentityId =
      userType.userTypeId === UserTypeEnum.CLIENT
        ? getInfo.clientid
        : getInfo.staffid;
    const {
      clientId,
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
      lastCancelledDate,
      numberOfCancelledAttempt,
    } = getInfo;
    const notification =
      await this.notificationService.getTotalUnreadByClientId(clientId);
    return {
      clientId,
      userId,
      username,
      isVerified,
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
      role: getInfo.user.role,
      accessToken,
      refreshToken,
      userTypeIdentityId,
      totalUnreadNotif: notification.total,
      lastCancelledDate,
      numberOfCancelledAttempt,
      userProfilePic: getInfo.user.userProfilePic
        ? getInfo.user.userProfilePic.file.url
        : null,
    };
  }

  async logOut(userId: string) {
    await this.updateRefreshTokenInUser(null, userId);
  }

  private getAccessToken(userId: string): any {
    const secret = fs.readFileSync(path.join(__dirname, "../../private.key"));
    const expiresIn = "1hr";

    const user: JwtPayload = { userId };
    const accessToken = this.jwtService.sign(user, {
      secret: secret,
      expiresIn: expiresIn,
      algorithm: "RS256",
    });
    return accessToken;
  }

  async getRefreshToken(userId: string) {
    const secret = fs.readFileSync(
      path.join(__dirname, "../../refreshtoken.private.key")
    );
    const expiresIn = "1hr";

    const user: JwtPayload = { userId };
    const accessToken = this.jwtService.sign(user, {
      secret: secret,
      expiresIn: expiresIn,
      algorithm: "RS256",
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

  async verifyOtp(userId, otp) {
    const user = await this.usersService.findByOtp(userId, otp);
    if (!user) {
      throw new HttpException("Invalid OTP", HttpStatus.BAD_REQUEST);
    }
    const result = await this.usersService.verifyUser(userId);
    if (!result) {
      throw new HttpException("Error verifying user", HttpStatus.BAD_REQUEST);
    }
    const { username, isVerified } = result.user;
    const accessToken: string = await this.getAccessToken(userId);
    const refreshToken: string = await this.getRefreshToken(userId);
    result.user.role.roleId =
      result.user.role.roleId === null || result.user.role.roleId === undefined
        ? RoleEnum.GUEST.toString()
        : result.user.role.roleId;
    await this.updateRefreshTokenInUser(refreshToken, userId);
    const userType = result.user.userType;
    const userTypeIdentityId =
      userType.userTypeId === UserTypeEnum.CLIENT
        ? result.clientid
        : result.staffid;
    const {
      clientId,
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
      lastCancelledDate,
      numberOfCancelledAttempt,
    } = result;
    const notification =
      await this.notificationService.getTotalUnreadByClientId(clientId);
    return {
      clientId,
      userId,
      username,
      isVerified,
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
      role: result.user.role,
      accessToken,
      refreshToken,
      userTypeIdentityId,
      totalUnreadNotif: notification.total,
      lastCancelledDate,
      numberOfCancelledAttempt,
      userProfilePic: result.user.userProfilePic
        ? result.user.userProfilePic.file.url
        : null,
    };
  }

  verifyJwt(jwt: string): Promise<any> {
    try {
      return this.jwtService.verifyAsync(jwt, {
        secret: fs.readFileSync(path.join(__dirname, "../../private.key")),
        algorithms: ["RS256"],
      });
    } catch (ex) {
      console.log(ex);
      throw ex;
    }
  }
}
