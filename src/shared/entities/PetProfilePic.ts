import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from "typeorm";
import { Pet } from "./Pet";
import { Files } from "./Files";

@Index("PK_PetProfilePic", ["petId"], { unique: true })
@Entity("PetProfilePic", { schema: "dbo" })
export class PetProfilePic {
  @Column("bigint", { primary: true, name: "PetId" })
  petId: string;

  @OneToOne(() => Pet, (pet) => pet.petProfilePic)
  @JoinColumn([{ name: "PetId", referencedColumnName: "petId" }])
  pet: Pet;

  @ManyToOne(() => Files, (files) => files.petProfilePics)
  @JoinColumn([{ name: "FileId", referencedColumnName: "fileId" }])
  file: Files;
}
