import { Column, Entity, Index, OneToMany } from "typeorm";
import { Clients } from "./Clients";
import { Pet } from "./Pet";
import { Staff } from "./Staff";

@Index("PK_Gender", ["genderId"], { unique: true })
@Entity("Gender", { schema: "dbo" })
export class Gender {
  @Column("bigint", { primary: true, name: "GenderId" })
  genderId: string;

  @Column("nvarchar", { name: "Name", length: 100 })
  name: string;

  @OneToMany(() => Clients, (clients) => clients.gender)
  clients: Clients[];

  @OneToMany(() => Pet, (pet) => pet.gender)
  pets: Pet[];

  @OneToMany(() => Staff, (staff) => staff.gender)
  staff: Staff[];
}
