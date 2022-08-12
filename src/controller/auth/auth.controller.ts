import { UserDto } from "../users/dto/user.update.dto";
import { ClientUserDto, StaffUserDto } from "./../users/dto/user.create.dto";
import { LocalAuthGuard } from "./local.auth.guard";
import {
  Controller,
  Body,
  Post,
  Get,
  Req,
  UseGuards,
  Param,
} from "@nestjs/common";
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
  public async registerClient(@Body() createUserDto: ClientUserDto) {
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
  public async registerStaff(@Body() createUserDto: StaffUserDto) {
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
  
  @Get("/findByUsername/:username")
  async findByUsername(@Param("username") username: string) {
    const res: CustomResponse = {};
    try {
      res.data = await this.authService.findByUserName(username);
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

  @Post("/refresh-token")
  async refreshToken(@Body() token: RefreshTokenDto) {
    const result = await this.authService.getUserIfRefreshTokenMatches(
      token.refresh_token,
      token.userId,
    );
    if (result) {
      return this.authService.getNewAccessAndRefreshToken(result.userId);
    } else {
      return null;
    }
  }
}
