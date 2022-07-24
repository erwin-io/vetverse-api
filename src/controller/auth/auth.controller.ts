import {
  CreateClientUserDto,
  CreateStaffUserDto,
} from "./../users/dto/user.create.dto";
import { LocalAuthGuard } from "./local.auth.guard";
import {
  Controller,
  Body,
  Post,
  HttpException,
  HttpStatus,
  UsePipes,
  Get,
  Req,
  UseGuards,
} from "@nestjs/common";
import { CreateUserDto } from "../users/dto/user.create.dto";
import { AuthService } from "./auth.service";
import { LoginUserDto } from "../users/dto/user-login.dto";
import { JwtPayload } from "./interfaces/payload.interface";
import { AuthGuard } from "@nestjs/passport";
import { ApiTags } from "@nestjs/swagger";
import { CustomResponse } from "./../../common/helper/customresponse.helpers";

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

  @UseGuards(LocalAuthGuard)
  @Get("whoami")
  public async testAuth(@Req() req: any): Promise<JwtPayload> {
    return req.user;
  }
}
