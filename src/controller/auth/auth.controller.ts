import { UserDto } from "./../users/dto/user.dto";
import {
  CreateClientUserDto,
  CreateStaffUserDto,
} from "./../users/dto/user.create.dto";
import { LocalAuthGuard } from "./local.auth.guard";
import { Controller, Body, Post, Get, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginUserDto } from "../users/dto/user-login.dto";
import { JwtPayload } from "./interfaces/payload.interface";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CustomResponse } from "./../../common/helper/customresponse.helpers";
import { JwtAuthGuard } from "./jwt.auth.guard";
import { GetUser } from "./decorator/get-user.decorator";
import { RefreshTokenDto } from "./dto/refresh-token.dto";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register/client")
  public async registerClient(@Body() createUserDto: CreateClientUserDto) {
    const res: CustomResponse = {};
    try {
      res.data = await this.authService.registerClient(createUserDto);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Post("register/staff")
  public async registerStaff(@Body() createUserDto: CreateStaffUserDto) {
    const res: CustomResponse = {};
    try {
      res.data = await this.authService.registerStaff(createUserDto);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post("login")
  public async login(@Body() loginUserDto: LoginUserDto) {
    const res: CustomResponse = {};
    try {
      res.data = await this.authService.login(loginUserDto);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post("/logout")
  public async logout(@GetUser() user: UserDto) {
    const res: CustomResponse = {};
    try {
      this.authService.logOut(user.userId);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @UseGuards(LocalAuthGuard)
  @Get("whoami")
  public async testAuth(@Req() req: any): Promise<JwtPayload> {
    return req.user;
  }
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post("/refresh-token")
  async refreshToken(@GetUser() data: UserDto, @Body() token: RefreshTokenDto) {
    const result = await this.authService.getUserIfRefreshTokenMatches(
      token.refresh_token,
      data.userId,
    );
    if (result) {
      return this.authService.getNewAccessAndRefreshToken(result.userId);
    } else {
      return null;
    }
  }
}
