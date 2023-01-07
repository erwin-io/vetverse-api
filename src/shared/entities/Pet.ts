import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Gender } from "./Gender";
import { Clients } from "./Clients";
import { PetCategory } from "./PetCategory";
import { PetAppointment } from "./PetAppointment";
import { PetProfilePic } from "./PetProfilePic";

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

  @ManyToOne(() => Gender, (gender) => gender.pets)
  @JoinColumn([{ name: "GenderId", referencedColumnName: "genderId" }])
  gender: Gender;

  @ManyToOne(() => Clients, (clients) => clients.pets)
  @JoinColumn([{ name: "ClientId", referencedColumnName: "clientId" }])
  client: Clients;

  @ManyToOne(() => PetCategory, (petCategory) => petCategory.pets)
  @JoinColumn([
    { name: "PetCategoryId", referencedColumnName: "petCategoryId" },
  ])
  petCategory: PetCategory;

  @OneToMany(() => PetAppointment, (petAppointment) => petAppointment.pet)
  petAppointments: PetAppointment[];

  @OneToOne(() => PetProfilePic, (petProfilePic) => petProfilePic.pet)
  petProfilePic: PetProfilePic;
}
