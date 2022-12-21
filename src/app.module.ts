import { Module } from "@nestjs/common";
import { AppService } from "./app.service";
import { UsersModule } from "./controller/users/users.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TypeOrmConfigService } from "./shared/typeorm/typeorm.service";
import { getEnvPath } from "./common/helper/env.helper";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./controller/auth/auth.module";
import { RolesModule } from "./controller/roles/roles.module";
import { ServiceTypeModule } from "./controller/service-type/service-type.module";
import { AppointmentModule } from "./controller/appointment/appointment.module";
import { PetModule } from "./controller/pet/pet.module";
import { PetTypeModule } from "./controller/pet-type/pet-type.module";
import { PetCategoryModule } from "./controller/pet-category/pet-category.module";
import { PaymentsModule } from "./controller/payments/payments.module";
import { FileModule } from "./controller/file/file.module";
import { MessageModule } from "./controller/message/message.module";
import { DashboardModule } from "./controller/dashboard/dashboard.module";
import { FirebaseProviderModule } from "./core/provider/firebase/firebase-provider.module";
import { SchedulerModule } from "./controller/scheduler/scheduler.module";
import { ReminderModule } from "./controller/reminder/reminder.module";
import { ReportsModule } from "./controller/reports/reports.module";
import * as Joi from "@hapi/joi";
const envFilePath: string = getEnvPath(`${__dirname}/common/envs`);
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath,
      isGlobal: true,
      validationSchema: Joi.object({
        UPLOADED_FILES_DESTINATION: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    AuthModule,
    UsersModule,
    RolesModule,
    ServiceTypeModule,
    AppointmentModule,
    PaymentsModule,
    PetModule,
    PetTypeModule,
    PetCategoryModule,
    FileModule,
    MessageModule,
    MessageModule,
    DashboardModule,
    FirebaseProviderModule,
    SchedulerModule,
    ReminderModule,
    ReportsModule,
  ],
  providers: [AppService],
  controllers: [],
})
export class AppModule {}
