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
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CustomResponse } from "src/common/helper/customresponse.helpers";
import { CreatePetCategoryDto } from "../../core/dto/pet-category/pet-category.create.dto";
import { PetCategoryDto } from "../../core/dto/pet-category/pet-category.update.dtos";
import { PetCategoryService } from "src/services/pet-category.service";
import { JwtAuthGuard } from "src/core/auth/jwt.auth.guard";

@ApiTags("pet-category")
@Controller("pet-category")
@ApiBearerAuth("jwt")
export class PetCategoryController {
  constructor(private readonly petCategoryService: PetCategoryService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    const res: CustomResponse = {};
    try {
      res.data = await this.petCategoryService.findAll();
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Get(":petCategoryId")
  @UseGuards(JwtAuthGuard)
  async findOne(@Param("petCategoryId") petCategoryId: string) {
    const res: CustomResponse = {};
    try {
      res.data = await this.petCategoryService.findById(petCategoryId);
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
  async add(@Body() createPetTypeDto: CreatePetCategoryDto) {
    const res: CustomResponse = {};
    try {
      const res: CustomResponse = {};
      res.data = await this.petCategoryService.add(createPetTypeDto);
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
  async update(@Body() roleDto: PetCategoryDto) {
    const res: CustomResponse = {};
    try {
      const res: CustomResponse = {};
      res.data = await this.petCategoryService.update(roleDto);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Delete(":petCategoryId")
  @UseGuards(JwtAuthGuard)
  async delete(@Param("petCategoryId") petCategoryId: string) {
    const res: CustomResponse = {};
    try {
      const res: CustomResponse = {};
      res.data = await this.petCategoryService.delete(petCategoryId);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }
}
