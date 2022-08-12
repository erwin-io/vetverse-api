import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  UseGuards,
  Query,
} from "@nestjs/common";
import { UsersService } from "./users.service";
// import { AuthGuard } from '@nestjs/passport';
import {
  ToggleEnableDto,
  UpdateClientUserDto,
  UpdateStaffUserDto,
} from "./dto/user.update.dto";
import { CustomResponse } from "./../../common/helper/customresponse.helpers";
import { CreateStaffUserDto } from "./dto/user.create.dto";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt.auth.guard";

@ApiTags("users")
@Controller("users")
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  @ApiQuery({
    name: "userTypeId",
    description: "Gets the User type id",
    required: true,
    type: String,
  })
  @UseGuards(JwtAuthGuard)
  async findAll(@Query("userTypeId") userTypeId?) {
    const res: CustomResponse = {};
    try {
      res.data = await this.userService.findAll(userTypeId);
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
  async updateClientUser(@Body() clientUserDto: UpdateClientUserDto) {
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
  async updateStaffUser(@Body() staffUserDto: UpdateStaffUserDto) {
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

  @Put("/toggleEnable")
  @UseGuards(JwtAuthGuard)
  async toggleEnable(@Body() toggleEnableDto: ToggleEnableDto) {
    const res: CustomResponse = {};
    try {
      const res: CustomResponse = {};
      res.data = await this.userService.toggleEnable(
        toggleEnableDto.enable,
        Number(toggleEnableDto.userId)
      );
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }
}
