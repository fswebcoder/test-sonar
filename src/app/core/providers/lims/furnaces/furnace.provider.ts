import FurnaceRepository from "@/domain/repositories/lims/furnaces/furnace.repository";
import FurnaceRepositoryImp from "@/infrastructure/repositories/lims/furnaces/furnace.repository-imp";
import { Provider } from "@angular/core";

export default function furnaceProvider(): Provider[]{
  return [
    {
      provide: FurnaceRepository,
      useClass: FurnaceRepositoryImp
    }
  ];
}