import { IsNotEmpty, IsEmail, IsDate, IsBoolean, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { ToBoolean } from "src/common/helper/env.helper";

export class UserDto {
  @ApiProperty()
  @IsNotEmpty()
  userId: string;
}

export class UsernameDto extends UserDto {
  @ApiProperty()
  @IsNotEmpty()
  username: string;
}

export class ToggleEnableDto extends UserDto {
  @ApiProperty({ required: false, default: true })
  @IsBoolean()
  @Transform(
    (value: any) =>
      value === "true" || value === true || value === 1 || value === "1"
  )
  @ToBoolean()
  enable = true;
}

export class UpdateStaffUserDto extends UserDto {
  @ApiProperty()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsOptional()
  middleName: string;

  @ApiProperty()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  mobileNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  address: string;

  @ApiProperty()
  @IsNotEmpty()
  genderId: string;

  @ApiProperty()
  @IsNotEmpty()
  roleId: string;

  @ApiProperty()
  @IsOptional()
  userProfilePic: any;
}

export class UpdateClientUserDto extends UserDto {
  @ApiProperty()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsOptional()
  middleName: string;

  @ApiProperty()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  mobileNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  address: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  birthDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  genderId: string;

  @ApiProperty()
  @IsOptional()
  userProfilePic: any;
}


export class UpdatePasswordDto extends UserDto {
  @ApiProperty()
  @IsNotEmpty()
  password: string;
}

export class UpdateFirebaseToken extends UserDto {
  @ApiProperty()
  @IsString()
  firebaseToken: string;
}

export class UpdateClientProfilePictureDto extends UserDto {
  @ApiProperty()
  @IsOptional()
  userProfilePic: any;
}