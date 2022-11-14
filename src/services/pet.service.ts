import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreatePetDto } from "../core/dto/pet/pet.create.dto";
import { PetDto } from "../core/dto/pet/pet.update.dtos";
import { Repository } from "typeorm";
import { Pet } from "src/shared/entities/Pet";
import { PetCategory } from "src/shared/entities/PetCategory";
import { Gender } from "src/shared/entities/Gender";
import { Clients } from "src/shared/entities/Clients";
import { PetViewModel } from "src/core/view-model/pet.view-model";

@Injectable()
export class PetService {
  constructor(
    @InjectRepository(Pet)
    private readonly petRepo: Repository<Pet>
  ) {}

  async findAll() {
    try {
      const query = <Pet[]>await this.petRepo.manager
        .createQueryBuilder("Pet", "p")
        .leftJoinAndSelect("p.client", "c")
        .leftJoinAndSelect("p.petCategory", "pc")
        .leftJoinAndSelect("pc.petType", "pt")
        .where({
          entityStatusId: "1",
        })
        .getMany();
      return query.map((p: Pet) => {
        return new PetViewModel(p);
      });
    } catch (e) {
      throw e;
    }
  }

  async findByClientId(clientId: string) {
    try {
      const query = <Pet[]>await this.petRepo.manager
        .createQueryBuilder("Pet", "p")
        .leftJoinAndSelect("p.petCategory", "pc")
        .leftJoinAndSelect("pc.petType", "pt")
        .leftJoinAndSelect("p.gender", "pg")
        .where({
          entityStatusId: "1",
          client: { clientId },
        })
        .getMany();
      return query.map((p: Pet) => {
        return new PetViewModel(p);
      });
    } catch (e) {
      throw e;
    }
  }

  async findOne(options?: any) {
    try {
      const result: any = await this.petRepo.manager
        .createQueryBuilder("Pet", "p")
        .leftJoinAndSelect("p.client", "c")
        .leftJoinAndSelect("p.gender", "g")
        .leftJoinAndSelect("p.petCategory", "pc")
        .leftJoinAndSelect("pc.petType", "pt")
        .where(options)
        .getOne();
      return result;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async findPetMedicalRecords(petId: string) {
    try {
      const result: any = <Pet>await this.petRepo.manager
        .createQueryBuilder("Pet", "p")
        .leftJoinAndSelect("p.client", "c")
        .leftJoinAndSelect("p.gender", "g")
        .leftJoinAndSelect("p.petCategory", "pc")
        .leftJoinAndSelect("pc.petType", "pt")
        .leftJoinAndSelect("p.petAppointments", "pa")
        .leftJoinAndSelect("pa.appointment", "a")
        .where({
          petId: petId,
          entityStatusId: "1",
        })
        .getOne();
      return new PetViewModel(result);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async findById(petId: string) {
    try {
      const petCategory: Pet = await this.findOne({
        petId: petId,
        entityStatusId: "1",
      });
      if (!petCategory) {
        throw new HttpException("Pet not found", HttpStatus.NOT_FOUND);
      }
      return petCategory;
    } catch (e) {
      throw e;
    }
  }

  async add(createPetDto: CreatePetDto) {
    try {
      return await this.petRepo.manager.transaction(async (entityManager) => {
        const pet = new Pet();
        pet.petCategory = new PetCategory();
        pet.petCategory.petCategoryId = createPetDto.petCategoryId;
        pet.name = createPetDto.name;
        pet.birthDate = createPetDto.birthDate;
        pet.weight = createPetDto.weight;
        pet.gender = new Gender();
        pet.gender.genderId = createPetDto.genderId;
        pet.client = await entityManager.findOne(Clients, {
          where: {
            clientId: createPetDto.clientId,
          },
        });
        return await entityManager.save(pet);
      });
    } catch (e) {
      throw e;
    }
  }

  async update(petDto: PetDto) {
    try {
      return await this.petRepo.manager.transaction(async (entityManager) => {
        const { petId } = petDto;
        const pet = await entityManager.findOne(Pet, {
          where: { petId: petId, entityStatusId: "1" },
        });
        if (!pet) {
          throw new HttpException("Pet not found", HttpStatus.NOT_FOUND);
        }
        pet.petCategory = await entityManager.findOne(PetCategory, {
          where: { petCategoryId: petDto.petCategoryId },
        });
        pet.name = petDto.name;
        pet.birthDate = petDto.birthDate;
        pet.weight = petDto.weight;
        pet.gender = new Gender();
        pet.gender.genderId = petDto.genderId;
        return await entityManager.save(pet);
      });
    } catch (e) {
      throw e;
    }
  }

  async delete(petId: string) {
    try {
      const petCategory: Pet = await this.findOne({
        petId: petId,
        entityStatusId: "1",
      });
      if (!petCategory) {
        throw new HttpException("Pet not found", HttpStatus.NOT_FOUND);
      }
      petCategory.entityStatusId = "2";
      return await this.petRepo.save(petCategory);
    } catch (e) {
      throw e;
    }
  }
}
