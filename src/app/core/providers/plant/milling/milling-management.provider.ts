import MillingManagementRepository from "@/domain/repositories/plant/milling/milling-management.repository";
import MillingManagementRepositoryImp from "@/infrastructure/repositories/plant/milling/milling-management.repository-imp";
import { Provider } from "@angular/core";

export default function millingManagementProvider(): Provider[]{
  return [
    {
      provide: MillingManagementRepository,
      useClass: MillingManagementRepositoryImp
    }
  ];
}