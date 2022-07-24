import { IsNotEmpty, IsEmail, IsDate } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

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

export class StaffUserDto extends UserDto {
  @ApiProperty()
  @IsNotEmpty()
  firtstName: string;

  @ApiProperty()
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
}

export class ClientUserDto extends UserDto {
  @ApiProperty()
  @IsNotEmpty()
  firtstName: string;

  @ApiProperty()
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
}
