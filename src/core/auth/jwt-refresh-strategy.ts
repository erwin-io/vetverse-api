import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import * as fs from "fs";
import * as path from "path";
import { JwtPayload } from "../interfaces/payload.interface";
import { UsersService } from "../../services/users.service";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  "jwt-refresh-token"
) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField("refresh_token"),
      secretOrKey: fs.readFileSync(
        path.join(__dirname, "../../../refreshtoken.private.key")
      ),
    });
  }

  async validate(payload: JwtPayload) {
    const { userId } = payload;
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
