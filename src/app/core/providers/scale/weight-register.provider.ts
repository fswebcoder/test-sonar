import { Provider } from "@angular/core";
import { WeightRegisterRepository } from "@/domain/repositories/scale/weight-register/weight-register.repository";
import { WeightRegisterRepositoryImp } from "@/infrastructure/repositories/scale/weight-register/weight-register.respository-imp";

export default function weightRegisterProvider(): Provider[] {
  return [
    {
      provide: WeightRegisterRepository,
      useClass: WeightRegisterRepositoryImp
    }
  ];
}
