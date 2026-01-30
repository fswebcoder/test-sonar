import { SocketModuleRepository } from "@/domain/repositories/socket-module/socket-module.repository";
import { SocketModuleRepositoryImp } from "@/infrastructure/repositories/socket-module/socket-module.repository-imp";
import { Provider } from "@angular/core";

export function socketModuleProvider(): Provider[] {
  return [
    {
      provide: SocketModuleRepository,
      useClass: SocketModuleRepositoryImp
    }
  ];
}