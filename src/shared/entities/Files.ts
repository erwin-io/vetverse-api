import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { AppointmentAttachments } from "./AppointmentAttachments";
import { DiagnosisAttachments } from "./DiagnosisAttachments";
import { PetProfilePic } from "./PetProfilePic";
import { UserProfilePic } from "./UserProfilePic";

@Index("PK_Files", ["fileId"], { unique: true })
@Entity("Files", { schema: "dbo" })
export class Files {
  @PrimaryGeneratedColumn({ type: "bigint", name: "FileId" })
  fileId: string;

  @Column("nvarchar", { name: "FileName" })
  fileName: string;

  @Column("varchar", { name: "Url", nullable: true })
  url: string | null;

  @OneToMany(
    () => AppointmentAttachments,
    (appointmentAttachments) => appointmentAttachments.file
  )
  appointmentAttachments: AppointmentAttachments[];

  @OneToMany(
    () => DiagnosisAttachments,
    (diagnosisAttachments) => diagnosisAttachments.file
  )
  diagnosisAttachments: DiagnosisAttachments[];

  @OneToMany(() => PetProfilePic, (petProfilePic) => petProfilePic.file)
  petProfilePics: PetProfilePic[];

  @OneToMany(() => UserProfilePic, (userProfilePic) => userProfilePic.file)
  userProfilePics: UserProfilePic[];
}
