import { VehiclesRepository } from "@/domain/repositories/scale/vehicles/vehicles.repository";
import { VehiclesRepositoryImp } from "@/infrastructure/repositories/scale/vehicles/vehicles.repository-imp";
import { Provider } from "@angular/core";

export default function vehiclesProvider(): Provider[] {
  return [
    {
      provide: VehiclesRepository,
      useClass: VehiclesRepositoryImp
    }
  ];
}
