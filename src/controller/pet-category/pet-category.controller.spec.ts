import { Test, TestingModule } from "@nestjs/testing";
import { PetCategoryController } from "./pet-category.controller";

describe("PetCategoryController", () => {
  let controller: PetCategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PetCategoryController],
    }).compile();

    controller = module.get<PetCategoryController>(PetCategoryController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
