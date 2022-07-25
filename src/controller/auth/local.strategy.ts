import { LoginUserDto } from './../users/dto/user-login.dto';
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserDto } from "../users/dto/user.dto";
import { AuthService } from "./auth.service";
import { Strategy } from "passport-local";
import { InjectRepository } from "@nestjs/typeorm";
import { Users } from "src/shared/entities/Users";
import { Repository } from "typeorm";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(username: string, password: string) {
    // class is constructed but this method is never called
    const login = { username, password };
    const user: UserDto = await this.authService.login({ username, password });

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
