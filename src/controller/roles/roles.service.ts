import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In } from "typeorm";
import { Repository } from "typeorm";
import { Roles } from "../../shared/entities/Roles";
import { RoleDto } from "./dto/role.dtos";
import { CreateRoleDto } from "./dto/roles.create.dto";

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Roles) private readonly roleRsepo: Repository<Roles>
  ) {}
  async findAll() {
    try {
      return await this.roleRsepo.findBy({
        entityStatusId: "1",
      });
    } catch (e) {
      throw e;
    }
  }

  async findOne(options?: any) {
    try {
      // const role = await this.roleRsepo
      //   .createQueryBuilder("Roles")
      //   .where(options)
      //   .andWhere("Roles.EntityStatusId = 1)")
      //   .getOne();
      const role = await this.roleRsepo.findOneBy(options);
      return role;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async findById(roleId: string) {
    try {
      const role = await this.findOne({ roleId: roleId, entityStatusId: "1" });
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
        entityStatusId: "1",
      });
      return roles;
    } catch (e) {
      throw e;
    }
  }

  async add(createRoleDto: CreateRoleDto) {
    try {
      const role = new Roles();
      role.name = createRoleDto.name;
      role.access = createRoleDto.access;
      return await this.roleRsepo.save(role);
    } catch (e) {
      throw e;
    }
  }

  async update(roleDto: RoleDto) {
    try {
      const { roleId } = roleDto;
      const role = await this.findOne({ roleId: roleId, entityStatusId: "1" });
      if (!role) {
        throw new HttpException("Role not found", HttpStatus.NOT_FOUND);
      }
      role.name = roleDto.name;
      role.access = roleDto.access;
      return await this.roleRsepo.save(role);
    } catch (e) {
      throw e;
    }
  }

  async delete(roleId: string) {
    try {
      const role = await this.findOne({ roleId: roleId, entityStatusId: "1" });
      if (!role) {
        throw new HttpException("Role not found", HttpStatus.NOT_FOUND);
      }
      role.name = `deleted_${roleId}_${new Date()}`;
      role.entityStatusId = "2";
      return await this.roleRsepo.save(role);
    } catch (e) {
      throw e;
    }
  }
}
