import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Not } from "typeorm";
import { Repository } from "typeorm";
import { Roles } from "../shared/entities/Roles";
import { RoleAccessDto } from "../core/dto/roles/role.access.dtos";
import { RoleEnum } from "src/common/enums/role.enum";

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Roles) private readonly roleRsepo: Repository<Roles>
  ) {}
  async findAll() {
    try {
      return await this.roleRsepo.find({
        where: { roleId: Not(RoleEnum.GUEST.toString()) },
      });
    } catch (e) {
      throw e;
    }
  }

  async findOne(options?: any) {
    try {
      const role = await this.roleRsepo.findOneBy(options);
      if (role.roleId === RoleEnum.GUEST.toString()) return null;
      return role;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async findById(roleId: string) {
    try {
      const role = await this.findOne({ roleId });
      if (!role) {
        throw new HttpException("Role not found", HttpStatus.NOT_FOUND);
      }
      return role;
    } catch (e) {
      throw e;
    }
  }

  async findByGroupId(roleId: string[]) {
    try {
      const roles = this.roleRsepo.findBy({
        roleId: In(roleId),
      });
      return roles;
    } catch (e) {
      throw e;
    }
  }

  async update(roleDto: RoleAccessDto) {
    try {
      const { roleId } = roleDto;
      const role = await this.findOne({ roleId });
      if (!role) {
        throw new HttpException("Role not found", HttpStatus.NOT_FOUND);
      }
      role.access = roleDto.access;
      return await this.roleRsepo.save(role);
    } catch (e) {
      throw e;
    }
  }
}
