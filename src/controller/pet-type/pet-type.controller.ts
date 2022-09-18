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
import { ApiTags } from "@nestjs/swagger";
import { CustomResponse } from "src/common/helper/customresponse.helpers";
import { JwtAuthGuard } from "src/core/auth/jwt.auth.guard";
import { CreatePetTypeDto } from "src/core/dto/pet-type/pet-type.create.dto";
import { PetTypeDto } from "src/core/dto/pet-type/pet-type.update.dtos";
import { PetTypeService } from "src/services/pet-type.service";

@ApiTags("pet-type")
@Controller("pet-type")
export class PetTypeController {
  constructor(private readonly petTypeService: PetTypeService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    const res: CustomResponse = {};
    try {
      res.data = await this.petTypeService.findAll();
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Get(":petTypeId")
  @UseGuards(JwtAuthGuard)
  async findOne(@Param("petTypeId") petTypeId: string) {
    const res: CustomResponse = {};
    try {
      res.data = await this.petTypeService.findById(petTypeId);
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
  async add(@Body() createPetTypeDto: CreatePetTypeDto) {
    const res: CustomResponse = {};
    try {
      const res: CustomResponse = {};
      res.data = await this.petTypeService.add(createPetTypeDto);
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
  async update(@Body() roleDto: PetTypeDto) {
    const res: CustomResponse = {};
    try {
      const res: CustomResponse = {};
      res.data = await this.petTypeService.update(roleDto);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Delete(":petTypeId")
  @UseGuards(JwtAuthGuard)
  async delete(@Param("petTypeId") petTypeId: string) {
    const res: CustomResponse = {};
    try {
      const res: CustomResponse = {};
      res.data = await this.petTypeService.delete(petTypeId);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }
}
