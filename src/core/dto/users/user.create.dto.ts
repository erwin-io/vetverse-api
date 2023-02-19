import {
  IsNotEmpty,
  IsEmail,
  IsDate,
  IsOptional,
  IsDateString,
  IsNumber,
  IsArray,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import * as moment from "moment";

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;
}

export class StaffUserDto extends CreateUserDto {
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
}

export class CreateStaffUserDto extends StaffUserDto {
  @ApiProperty()
  @IsNotEmpty()
  roleId: string;
}

export class ClientUserDto extends CreateUserDto {
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
  sendOtp: boolean;
}

export class CreateClientPetDto {
  @ApiProperty()
  @IsNotEmpty()
  petCategoryId: string;

  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: Date,
    default: moment().format("YYYY-MM-DD"),
  })
  @IsDateString()
  @Type(() => Date)
  @Transform((value) => moment(new Date(value.value)).format("YYYY-MM-DD"))
  @IsNotEmpty()
  birthDate: Date;

  @ApiProperty({
    type: Number,
    default: 0.0,
  })
  @IsNotEmpty()
  @IsNumber()
  weight: number;

  @ApiProperty()
  @IsNotEmpty()
  genderId: string;
}

export class CreateClientUserDto extends ClientUserDto {
  @ApiProperty({
    isArray: true,
    type: CreateClientPetDto
  })
  @IsNotEmpty()
  @IsArray()
  pets: CreateClientPetDto[];
}