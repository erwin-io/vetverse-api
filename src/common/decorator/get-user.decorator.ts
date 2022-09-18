import { UserDto } from "../../core/dto/users/user.update.dto";
import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const GetUser = createParamDecorator(
  (data, ctx: ExecutionContext): UserDto => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  }
);
