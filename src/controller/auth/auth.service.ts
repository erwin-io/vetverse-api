import {
  CreateClientUserDto,
  CreateStaffUserDto,
} from "./../users/dto/user.create.dto";
import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { CreateUserDto } from "../users/dto/user.create.dto";
import { RegistrationStatus } from "./interfaces/regisration-status.interface";
import { UsersService } from "../users/users.service";
import { LoginStatus } from "./interfaces/login-status.interface";
import { LoginUserDto } from "../users/dto/user-login.dto";
import { UserDto, UsernameDto } from "../users/dto/user.dto";
import { JwtPayload } from "./interfaces/payload.interface";
import { JwtService } from "@nestjs/jwt";

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

  async login(loginUserDto: LoginUserDto) {
    // find user in db
    const user = await this.usersService.findByLogin(loginUserDto);

    // generate and sign token
    const token = this._createToken(user);

    return {
      username: user.username,
      ...token,
    };
  }

  async validateUser(payload: JwtPayload) {
    const user = await this.usersService.findByPayload(payload);
    if (!user) {
      throw new HttpException("Invalid token", HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  private _createToken({ username }: UsernameDto): any {
    const expiresIn = "1h";

    const user: JwtPayload = { username };
    const accessToken = this.jwtService.sign(user);
    return {
      expiresIn,
      accessToken,
    };
  }
}
