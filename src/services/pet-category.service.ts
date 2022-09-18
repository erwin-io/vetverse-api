import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreatePetCategoryDto } from "src/core/dto/pet-category/pet-category.create.dto";
import { PetCategoryDto } from "src/core/dto/pet-category/pet-category.update.dtos";
import { PetCategory } from "src/shared/entities/PetCategory";
import { PetType } from "src/shared/entities/PetType";
import { In, Repository } from "typeorm";

@Injectable()
export class PetCategoryService {
  constructor(
    @InjectRepository(PetCategory)
    private readonly petCategoryRepo: Repository<PetCategory>
  ) {}

  async findAll() {
    try {
      return await this.petCategoryRepo.manager
        .createQueryBuilder("PetCategory", "pc")
        .leftJoinAndSelect("pc.petType", "pt")
        .where({
          entityStatusId: "1",
        })
        .getMany();
    } catch (e) {
      throw e;
    }
  }

  async findOne(options?: any) {
    try {
      const result: any = await this.petCategoryRepo.manager
        .createQueryBuilder("PetCategory", "pc")
        .leftJoinAndSelect("pc.petType", "pt")
        .where(options)
        .getOne();
      return result;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async findById(petCategoryId: string) {
    try {
      const petCategory: PetCategory = await this.findOne({
        petCategoryId: petCategoryId,
        entityStatusId: "1",
      });
      if (!petCategory) {
        throw new HttpException("Pet Category not found", HttpStatus.NOT_FOUND);
      }
      return petCategory;
    } catch (e) {
      throw e;
    }
  }

  async add(ceatePetCategoryDto: CreatePetCategoryDto) {
    try {
      const petCategory = new PetCategory();
      petCategory.petType = new PetType();
      petCategory.petType.petTypeId = ceatePetCategoryDto.petTypeId;
      petCategory.name = ceatePetCategoryDto.name;
      return await this.petCategoryRepo.save(petCategory);
    } catch (e) {
      throw e;
    }
  }

  async update(petCategoryDto: PetCategoryDto) {
    try {
      return await this.petCategoryRepo.manager.transaction(
        async (entityManager) => {
          const { petCategoryId } = petCategoryDto;
          const petCategory = await entityManager.findOne(PetCategory, {
            where: {
              petCategoryId: petCategoryId,
              entityStatusId: "1",
            },
          });
          if (!petCategory) {
            throw new HttpException(
              "Pet Category not found",
              HttpStatus.NOT_FOUND
            );
          }
          petCategory.name = petCategoryDto.name;
          petCategory.petType = await entityManager.findOne(PetType, {
            where: { petTypeId: petCategoryDto.petTypeId },
          });
          return await entityManager.save(petCategory);
        }
      );
    } catch (e) {
      throw e;
    }
  }

  async delete(petCategoryId: string) {
    try {
      const petCategory: PetCategory = await this.findOne({
        petCategoryId: petCategoryId,
        entityStatusId: "1",
      });
      if (!petCategory) {
        throw new HttpException("Pet Category not found", HttpStatus.NOT_FOUND);
      }
      petCategory.name = `deleted_${petCategoryId}_${new Date()}`;
      petCategory.entityStatusId = "2";
      return await this.petCategoryRepo.save(petCategory);
    } catch (e) {
      throw e;
    }
  }
}
