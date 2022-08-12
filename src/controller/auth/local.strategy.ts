import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserDto } from "../users/dto/user.update.dto";
import { AuthService } from "./auth.service";
import { Strategy } from "passport-local";
import { InjectRepository } from "@nestjs/typeorm";
import { Users } from "src/shared/entities/Users";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(username: string, password: string) {
    // class is constructed but this method is never called
    const login = { username, password };
    const user: any = await this.authService.login({ username, password });

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
