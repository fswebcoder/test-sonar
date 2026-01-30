import { Provider } from "@angular/core";
import { MaterialTypesRepository } from "@/domain/repositories/scale/material-types/material-types.repository";
import { MaterialTypesRepositoryImp } from "@/infrastructure/repositories/scale/material-types/material-types.repository-imp";

export default function materialTypesProvider(): Provider[] {
  return [
    {
      provide: MaterialTypesRepository,
      useClass: MaterialTypesRepositoryImp
    }
  ];
}
