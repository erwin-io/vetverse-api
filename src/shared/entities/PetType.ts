import {
  Column,
  Entity,
  Index,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PetCategory } from "./PetCategory";

@Index("PK_PetType", ["petTypeId"], { unique: true })
@Entity("PetType", { schema: "dbo" })
export class PetType {
  @PrimaryGeneratedColumn({ type: "bigint", name: "PetTypeId" })
  petTypeId: string;

  @Column("nvarchar", { name: "Name", length: 100 })
  name: string;

  @Column("bigint", { name: "EntityStatusId", default: () => "(1)" })
  entityStatusId: string;

  @OneToOne(() => PetCategory, (petCategory) => petCategory.petCategory)
  petCategory: PetCategory;
}
