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
import { JwtAuthGuard } from "src/core/auth/jwt.auth.guard";
import { CreatePetDto } from "src/core/dto/pet/pet.create.dto";
import { PetDto } from "src/core/dto/pet/pet.update.dtos";
import { PetService } from "src/services/pet.service";

@ApiTags("pet")
@Controller("pet")
@ApiBearerAuth()
export class PetController {
  constructor(private readonly petService: PetService) {}

  @Get()
  //@UseGuards(JwtAuthGuard)
  async findAll() {
    const res: CustomResponse = {};
    try {
      res.data = await this.petService.findAll();
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Get("findByClientId/:clientId")
  //@UseGuards(JwtAuthGuard)
  async findByClientId(@Param("clientId") clientId: string) {
    const res: CustomResponse = {};
    try {
      res.data = await this.petService.findByClientId(clientId);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Get(":petId")
  //@UseGuards(JwtAuthGuard)
  async findOne(@Param("petId") petId: string) {
    const res: CustomResponse = {};
    try {
      res.data = await this.petService.findById(petId);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Get("getPetMedicalRecords/:petId")
  //@UseGuards(JwtAuthGuard)
  async getPetMedicalRecords(@Param("petId") petId: string) {
    const res: CustomResponse = {};
    try {
      res.data = await this.petService.findPetMedicalRecords(petId);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Post("")
  //@UseGuards(JwtAuthGuard)
  async create(@Body() roleDto: CreatePetDto) {
    const res: CustomResponse = {};
    try {
      const res: CustomResponse = {};
      res.data = await this.petService.add(roleDto);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("")
  //@UseGuards(JwtAuthGuard)
  async update(@Body() roleDto: PetDto) {
    const res: CustomResponse = {};
    try {
      const res: CustomResponse = {};
      res.data = await this.petService.update(roleDto);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Delete(":petId")
  //@UseGuards(JwtAuthGuard)
  async delete(@Param("petId") petId: string) {
    const res: CustomResponse = {};
    try {
      const res: CustomResponse = {};
      res.data = await this.petService.delete(petId);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }
}
