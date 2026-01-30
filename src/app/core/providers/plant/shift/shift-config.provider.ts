import ShiftConfigRepository from "@/domain/repositories/plant/shift/shift-config.repository";
import ShiftConfigRepositoryImpl from "@/infrastructure/repositories/plant/shift/shift-config.repository-imp";
import { Provider } from "@angular/core";

export default function shiftConfigProvider():Provider[]{
  return [{
    provide: ShiftConfigRepository,
    useClass: ShiftConfigRepositoryImpl
  }];
}