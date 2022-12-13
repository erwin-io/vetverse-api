import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreatePetCategoryDto } from "src/core/dto/pet-category/pet-category.create.dto";
import { GatewayConnectedUsers } from "src/shared/entities/GatewayConnectedUsers";
import { PetType } from "src/shared/entities/PetType";
import { Users } from "src/shared/entities/Users";
import { Repository } from "typeorm";

@Injectable()
export class GatewayConnectedUsersService {
  constructor(
    @InjectRepository(GatewayConnectedUsers)
    private readonly gatewayConnectedUsersRepo: Repository<GatewayConnectedUsers>
  ) {}
  async findByUserId(userId: string) {
    try {
      const connectedUser = await this.gatewayConnectedUsersRepo.findOneBy({
        user: { userId },
      });
      if (!connectedUser) {
        return { socketId: "0" };
      }
      return connectedUser;
    } catch (e) {
      throw e;
    }
  }

  async add(dto: { userId: string; socketId: string }) {
    try {
      return await this.gatewayConnectedUsersRepo.manager.transaction(
        async (entityManager) => {
          const connectedUser = await entityManager.findOne(
            GatewayConnectedUsers,
            {
              where: { user: { userId: dto.userId } },
              relations: ["user"],
            }
          );
          if (connectedUser) {
            connectedUser.socketId = dto.socketId;
            return await entityManager.save(connectedUser);
          } else {
            const newConnectedUser = new GatewayConnectedUsers();
            newConnectedUser.user = await entityManager.findOne(Users, {
              where: { userId: dto.userId },
            });
            newConnectedUser.socketId = dto.socketId;
            return await entityManager.save(newConnectedUser);
          }
        }
      );
    } catch (e) {
      throw e;
    }
  }

  async deleteBySocketId(socketId: string) {
    try {
      return this.gatewayConnectedUsersRepo.delete({ socketId });
    } catch (e) {
      throw e;
    }
  }

  async deleteAll() {
    try {
      await this.gatewayConnectedUsersRepo
        .createQueryBuilder()
        .delete()
        .execute();
    } catch (e) {
      throw e;
    }
  }
}
