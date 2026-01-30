import { Provider } from "@angular/core";
import { ObserversRepository } from "@/domain/repositories/scale/observers/observers.repository";
import { ObserversRepositoryImp } from "@/infrastructure/repositories/scale/observers/observers.repository-imp";

export default function observersProvider(): Provider[] {
  return [
    {
      provide: ObserversRepository,
      useClass: ObserversRepositoryImp
    }
  ];
}
