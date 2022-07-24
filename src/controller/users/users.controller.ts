import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  UsePipes,
  UseGuards,
  Req,
  Query,
} from "@nestjs/common";
import { UsersService } from "./users.service";
// import { AuthGuard } from '@nestjs/passport';
import { ClientUserDto, StaffUserDto, UserDto } from "./dto/user.dto";
import { CustomResponse } from "./../../common/helper/customresponse.helpers";
import { CreateStaffUserDto, CreateUserDto } from "./dto/user.create.dto";
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt.auth.guard";
import { SelectQuery } from "typeorm/query-builder/SelectQuery";

@ApiTags("users")
@Controller("users")
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  @ApiQuery({
    name: "usertypeId",
    description: "Gets the User type id",
  })
  @UseGuards(JwtAuthGuard)
  async findAll(@Query("usertypeId") usertypeId?) {
    const res: CustomResponse = {};
    try {
      res.data = await this.userService.findAll(usertypeId);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  async findOne(@Param("id") userId: string) {
    const res: CustomResponse = {};
    try {
      res.data = await this.userService.findById(userId);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Post("/staff")
  @UseGuards(JwtAuthGuard)
  async create(@Body() createStaffUserDto: CreateStaffUserDto) {
    const res: CustomResponse = {};
    try {
      res.data = await this.userService.createStaffUser(createStaffUserDto);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("/client")
  @UseGuards(JwtAuthGuard)
  async updateClientUser(@Body() clientUserDto: ClientUserDto) {
    const res: CustomResponse = {};
    try {
      const res: CustomResponse = {};
      res.data = await this.userService.updateClientUser(clientUserDto);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("/staff")
  @UseGuards(JwtAuthGuard)
  async updateStaffUser(@Body() staffUserDto: StaffUserDto) {
    const res: CustomResponse = {};
    try {
      const res: CustomResponse = {};
      res.data = await this.userService.updateStaffUser(staffUserDto);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }
}
