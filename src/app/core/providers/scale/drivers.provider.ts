import { Provider } from "@angular/core";
import { DriversRepository } from "@/domain/repositories/scale/drivers/drivers.repository";
import { DriversRepositoryImp } from "@/infrastructure/repositories/scale/drivers/drivers.repository-imp";

export default function driversProvider(): Provider[] {
  return [
    {
      provide: DriversRepository,
      useClass: DriversRepositoryImp
    }
  ];
}
