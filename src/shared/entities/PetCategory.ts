import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Pet } from "./Pet";
import { PetType } from "./PetType";

@Index("PK_PetCategory", ["petCategoryId"], { unique: true })
@Index("U_PetCategory", ["name"], { unique: true })
@Entity("PetCategory", { schema: "dbo" })
export class PetCategory {
  @PrimaryGeneratedColumn({ type: "bigint", name: "PetCategoryId" })
  petCategoryId: string;

  @Column("nvarchar", { name: "Name", unique: true, length: 100 })
  name: string;

  @Column("bigint", { name: "EntityStatusId", default: () => "(1)" })
  entityStatusId: string;

  @OneToMany(() => Pet, (pet) => pet.petCategory)
  pets: Pet[];

  @ManyToOne(() => PetType, (petType) => petType.petCategories)
  @JoinColumn([{ name: "PetTypeId", referencedColumnName: "petTypeId" }])
  petType: PetType;
}
