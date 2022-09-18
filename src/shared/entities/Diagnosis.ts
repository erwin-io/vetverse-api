import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("PK_Diagnosis", ["diagnosisId"], { unique: true })
@Entity("Diagnosis", { schema: "dbo" })
export class Diagnosis {
  @PrimaryGeneratedColumn({ type: "bigint", name: "DiagnosisId" })
  diagnosisId: string;

  @Column("bigint", { name: "AppointmentId" })
  appointmentId: string;

  @Column("nvarchar", { name: "DescOfDiagnosis", nullable: true })
  descOfDiagnosis: string | null;

  @Column("nvarchar", { name: "DescOfTreatment" })
  descOfTreatment: string;

  @Column("bit", { name: "IsActive", default: () => "(1)" })
  isActive: boolean;

  @Column("bigint", { name: "EntityStatusId", default: () => "(1)" })
  entityStatusId: string;
}
