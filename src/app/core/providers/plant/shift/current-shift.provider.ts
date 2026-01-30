import CurrentShiftRepository from "@/domain/repositories/plant/shift/current-shift.repository";
import CurrentShiftRepositoryImp from "@/infrastructure/repositories/plant/shift/current-shift.repository-imp";
import { Provider } from "@angular/core";

export default function currentShiftProvider(): Provider[] {
  return [{
    provide: CurrentShiftRepository,
    useClass: CurrentShiftRepositoryImp
  }];
}
