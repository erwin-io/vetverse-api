import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { AppointmentAttachments } from "./AppointmentAttachments";
import { UserProfilePic } from "./UserProfilePic";

@Index("PK_Files", ["fileId"], { unique: true })
@Entity("Files", { schema: "dbo" })
export class Files {
  @PrimaryGeneratedColumn({ type: "bigint", name: "FileId" })
  fileId: string;

  @Column("nvarchar", { name: "FileName" })
  fileName: string;

  @OneToMany(
    () => AppointmentAttachments,
    (appointmentAttachments) => appointmentAttachments.file
  )
  appointmentAttachments: AppointmentAttachments[];

  @OneToMany(() => UserProfilePic, (userProfilePic) => userProfilePic.file)
  userProfilePics: UserProfilePic[];
}
