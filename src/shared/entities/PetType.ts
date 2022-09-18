import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PetCategory } from "./PetCategory";

@Index("PK_PetType", ["petTypeId"], { unique: true })
@Index("U_PetType", ["name"], { unique: true })
@Entity("PetType", { schema: "dbo" })
export class PetType {
  @PrimaryGeneratedColumn({ type: "bigint", name: "PetTypeId" })
  petTypeId: string;

  @Column("nvarchar", { name: "Name", unique: true, length: 100 })
  name: string;

  @Column("bigint", { name: "EntityStatusId", default: () => "(1)" })
  entityStatusId: string;

  @OneToMany(() => PetCategory, (petCategory) => petCategory.petType)
  petCategories: PetCategory[];
}
