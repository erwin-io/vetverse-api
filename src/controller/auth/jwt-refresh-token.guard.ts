import { AuthGuard } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";

@Injectable()
export class JwtRefreshTokenGuard extends AuthGuard("jwt-refresh-token") {}
