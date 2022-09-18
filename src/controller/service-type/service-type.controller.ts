import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { CreateServiceTypeDto } from "src/core/dto/serviceType/serviceType.create.dto";
import { CustomResponse } from "../../common/helper/customresponse.helpers";
import { JwtAuthGuard } from "../../core/auth/jwt.auth.guard";
import { ServiceTypeDto } from "../../core/dto/serviceType/serviceType.update.dtos";
import { ServiceTypeService } from "../../services/service-type.service";

@ApiTags("service-type")
@Controller("service-type")
@ApiBearerAuth()
export class ServiceTypeController {
  constructor(private readonly serviceTypService: ServiceTypeService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    const res: CustomResponse = {};
    try {
      res.data = await this.serviceTypService.findAll();
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Get(":serviceTypeId")
  @UseGuards(JwtAuthGuard)
  async findOne(@Param("serviceTypeId") serviceTypeId: string) {
    const res: CustomResponse = {};
    try {
      res.data = await this.serviceTypService.findById(serviceTypeId);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Post("")
  @UseGuards(JwtAuthGuard)
  async add(@Body() createServiceTypeDto: CreateServiceTypeDto) {
    const res: CustomResponse = {};
    try {
      const res: CustomResponse = {};
      res.data = await this.serviceTypService.add(createServiceTypeDto);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("")
  @UseGuards(JwtAuthGuard)
  async update(@Body() roleDto: ServiceTypeDto) {
    const res: CustomResponse = {};
    try {
      const res: CustomResponse = {};
      res.data = await this.serviceTypService.update(roleDto);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Delete(":serviceTypeId")
  @UseGuards(JwtAuthGuard)
  async delete(@Param("serviceTypeId") serviceTypeId: string) {
    const res: CustomResponse = {};
    try {
      const res: CustomResponse = {};
      res.data = await this.serviceTypService.delete(serviceTypeId);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }
}
