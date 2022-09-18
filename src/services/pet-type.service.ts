import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreatePetTypeDto } from "src/core/dto/pet-type/pet-type.create.dto";
import { PetTypeDto } from "src/core/dto/pet-type/pet-type.update.dtos";
import { PetType } from "src/shared/entities/PetType";
import { In, Repository } from "typeorm";

@Injectable()
export class PetTypeService {
  constructor(
    @InjectRepository(PetType)
    private readonly petTypeRepo: Repository<PetType>
  ) {}

  async findAll() {
    try {
      return await this.petTypeRepo.findBy({
        entityStatusId: "1",
      });
    } catch (e) {
      throw e;
    }
  }

  async findOne(options?: any) {
    try {
      const petType = await this.petTypeRepo.findOneBy(options);
      return petType;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async findById(petTypeId: string) {
    try {
      const petType = await this.findOne({
        petTypeId: petTypeId,
        entityStatusId: "1",
      });
      if (!petType) {
        throw new HttpException("Pet Type not found", HttpStatus.NOT_FOUND);
      }
      return petType;
    } catch (e) {
      throw e;
    }
  }

  async add(createPetTypeDto: CreatePetTypeDto) {
    try {
      const petType = new PetType();
      petType.name = createPetTypeDto.name;
      return await this.petTypeRepo.save(petType);
    } catch (e) {
      throw e;
    }
  }

  async update(petTypeDto: PetTypeDto) {
    try {
      const { petTypeId } = petTypeDto;
      const petType = await this.findOne({
        petTypeId: petTypeId,
        entityStatusId: "1",
      });
      if (!petType) {
        throw new HttpException("Pet Type not found", HttpStatus.NOT_FOUND);
      }
      petType.name = petTypeDto.name;
      return await this.petTypeRepo.save(petType);
    } catch (e) {
      throw e;
    }
  }

  async delete(petTypeId: string) {
    try {
      const petType = await this.findOne({
        petTypeId: petTypeId,
        entityStatusId: "1",
      });
      if (!petType) {
        throw new HttpException("Pet Type not found", HttpStatus.NOT_FOUND);
      }
      petType.name = `deleted_${petTypeId}_${new Date()}`;
      petType.entityStatusId = "2";
      return await this.petTypeRepo.save(petType);
    } catch (e) {
      throw e;
    }
  }
}
