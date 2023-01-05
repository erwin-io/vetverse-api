import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PetCategory } from "./PetCategory";
import { Clients } from "./Clients";
import { Gender } from "./Gender";
import { PetAppointment } from "./PetAppointment";

@Index("PK_Pet", ["petId"], { unique: true })
@Entity("Pet", { schema: "dbo" })
export class Pet {
  @PrimaryGeneratedColumn({ type: "bigint", name: "PetId" })
  petId: string;

  @Column("nvarchar", { name: "Name", length: 250 })
  name: string;

  @Column("date", { name: "BirthDate", nullable: true })
  birthDate: Date | null;

  @Column("int", { name: "Weight", nullable: true, default: () => "(0)" })
  weight: number | null;

  @Column("bigint", { name: "EntityStatusId", default: () => "(1)" })
  entityStatusId: string;

  @ManyToOne(() => PetCategory, (petCategory) => petCategory.pets)
  @JoinColumn([
    { name: "PetCategoryId", referencedColumnName: "petCategoryId" },
  ])
  petCategory: PetCategory;

  @ManyToOne(() => Clients, (clients) => clients.pets)
  @JoinColumn([{ name: "ClientId", referencedColumnName: "clientId" }])
  client: Clients;

  @ManyToOne(() => Gender, (gender) => gender.pets)
  @JoinColumn([{ name: "GenderId", referencedColumnName: "genderId" }])
  gender: Gender;

  @OneToMany(() => PetAppointment, (petAppointment) => petAppointment.pet)
  petAppointments: PetAppointment[];
}
