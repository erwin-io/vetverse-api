import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../../services/auth.service";
import { Strategy } from "passport-local";
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }
  async validate(username, password) {
    // class is constructed but this method is never called
    const user: any = await this.authService.login({ username, password });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
