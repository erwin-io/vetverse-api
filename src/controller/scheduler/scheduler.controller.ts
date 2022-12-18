import { Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CustomResponse } from "src/common/helper/customresponse.helpers";
import { SchedulerService } from "src/services/scheduler.service";

@ApiTags("scheduler")
@Controller("scheduler")
export class SchedulerController {
  constructor(private readonly schedulerService: SchedulerService) {}
  
  @Post("runNotificaiton")
  public async runNotificaiton() {
    const res: CustomResponse = {};
    try {
      res.data = await this.schedulerService.runNotificaiton();
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }
  
  @Post("runAnnouncements")
  public async runAnnouncements() {
    const res: CustomResponse = {};
    try {
      res.data = await this.schedulerService.runAnnouncements();
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }
}
