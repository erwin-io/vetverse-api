import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PetType } from "./PetType";

@Index("PK_PetCategory", ["petCategoryId"], { unique: true })
@Entity("PetCategory", { schema: "dbo" })
export class PetCategory {
  @PrimaryGeneratedColumn({ type: "bigint", name: "PetCategoryId" })
  petCategoryId: string;

  @Column("bigint", { name: "PetTypeId" })
  petTypeId: string;

  @Column("nvarchar", { name: "Name", length: 100 })
  name: string;

  @Column("bigint", { name: "EntityStatusId", default: () => "(1)" })
  entityStatusId: string;

  @OneToOne(() => PetType, (petType) => petType.petCategory)
  @JoinColumn([{ name: "PetCategoryId", referencedColumnName: "petTypeId" }])
  petCategory: PetType;
}
