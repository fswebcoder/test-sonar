import { SocketModuleRepository } from '@/domain/repositories/socket-module/socket-module.repository';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SocketModuleUsecase implements SocketModuleRepository {

  socketModuleRepository = inject(SocketModuleRepository);

    connect(url: string): void {
      return this.socketModuleRepository.connect(url);
    }

    emit<T>(event: string, data: T): void {
      return this.socketModuleRepository.emit(event, data);
    }

    listen<T>(event: string) {
      return this.socketModuleRepository.listen<T>(event);
    }

    disconnect(): void {
      return this.socketModuleRepository.disconnect();
    }

}
