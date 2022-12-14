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
import { SchedulerController } from './controller/scheduler/scheduler.controller';
import { SchedulerModule } from './controller/scheduler/scheduler.module';
import { SchedulerService } from './services/scheduler.service';
const envFilePath: string = getEnvPath(`${__dirname}/common/envs`);
@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath, isGlobal: true }),
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
  ],
  providers: [AppService, SchedulerService],
  controllers: [SchedulerController],
})
export class AppModule {}
