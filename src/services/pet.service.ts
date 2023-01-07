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
import { v4 as uuid } from "uuid";
import { PetProfilePic } from "src/shared/entities/PetProfilePic";
import { extname } from "path";
import { Files } from "src/shared/entities/Files";
import { FirebaseProvider } from "src/core/provider/firebase/firebase-provider";

@Injectable()
export class PetService {
  constructor(
    private firebaseProvoder: FirebaseProvider,
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
        .leftJoinAndSelect("p.petProfilePic", "pic")
        .leftJoinAndSelect("pic.file", "f")
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
        .leftJoinAndSelect("p.petProfilePic", "pic")
        .leftJoinAndSelect("pic.file", "f")
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
        .leftJoinAndSelect("a.appointmentStatus", "as")
        .leftJoinAndSelect("a.serviceType", "serv")
        .leftJoinAndSelect("p.petProfilePic", "pic")
        .leftJoinAndSelect("pic.file", "f")
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
        let pet = new Pet();
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
        pet = await entityManager.save(pet);
        if (createPetDto.petProfilePic) {
          let petProfilePic = new PetProfilePic();
          const newFileName: string = uuid();
          const bucket = this.firebaseProvoder.app.storage().bucket();

          const file = new Files();
          file.fileName = `${newFileName}${extname(
            createPetDto.petProfilePic.fileName
          )}`;

          const bucketFile = bucket.file(
            `profile/pet/${newFileName}${extname(
              createPetDto.petProfilePic.fileName
            )}`
          );
          const img = Buffer.from(createPetDto.petProfilePic.data, "base64");
          await bucketFile.save(img).then(async () => {
            const url = await bucketFile.getSignedUrl({
              action: "read",
              expires: "03-09-2500",
            });
            file.url = url[0];
            petProfilePic.file = await entityManager.save(Files, file);
          });
          pet.petProfilePic = petProfilePic;
          petProfilePic.petId = pet.petId;
          petProfilePic = await entityManager.save(
            PetProfilePic,
            petProfilePic
          );
          pet.petProfilePic = petProfilePic;
        }
        return pet;
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
        if (petDto.petProfilePic) {
          const newFileName: string = uuid();
          let petProfilePic = await entityManager.findOne(PetProfilePic, {
            where: { petId: pet.petId },
            relations: ["file"],
          });
          const bucket = this.firebaseProvoder.app.storage().bucket();
          if (petProfilePic) {
            try {
              const deleteFile = bucket.file(
                `profile/pet/${petProfilePic.file.fileName}`
              );
              deleteFile.delete();
            } catch (ex) {
              console.log(ex);
            }
            const file = await entityManager.findOne(Files, {
              where: { fileId: petProfilePic.file.fileId },
            });
            file.fileName = `${newFileName}${extname(
              petDto.petProfilePic.fileName
            )}`;
            const bucketFile = bucket.file(
              `profile/pet/${newFileName}${extname(
                petDto.petProfilePic.fileName
              )}`
            );
            const img = Buffer.from(petDto.petProfilePic.data, "base64");
            await bucketFile.save(img).then(async () => {
              const url = await bucketFile.getSignedUrl({
                action: "read",
                expires: "03-09-2500",
              });
              file.url = url[0];
              petProfilePic.file = await entityManager.save(Files, file);
            });
          } else {
            petProfilePic = new PetProfilePic();
            const newFileName: string = uuid();
            const bucket = this.firebaseProvoder.app.storage().bucket();

            const file = new Files();
            file.fileName = `${newFileName}${extname(
              petDto.petProfilePic.fileName
            )}`;

            const bucketFile = bucket.file(
              `profile/pet/${newFileName}${extname(
                petDto.petProfilePic.fileName
              )}`
            );
            const img = Buffer.from(petDto.petProfilePic.data, "base64");
            await bucketFile.save(img).then(async () => {
              const url = await bucketFile.getSignedUrl({
                action: "read",
                expires: "03-09-2500",
              });
              file.url = url[0];
              petProfilePic.file = await entityManager.save(Files, file);
            });
          }
          petProfilePic.petId = pet.petId;
          pet.petProfilePic = await entityManager.save(
            PetProfilePic,
            petProfilePic
          );
        }
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
