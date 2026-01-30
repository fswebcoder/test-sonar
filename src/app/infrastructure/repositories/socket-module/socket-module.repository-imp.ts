import { SocketModuleRepository } from "@/domain/repositories/socket-module/socket-module.repository";
import { SocketModuleDatasourceService } from "@/infrastructure/datasources/socket-module/socket-module-datasource.service";
import { inject, Injectable } from "@angular/core";

@Injectable({
    providedIn: "root"
})
export class SocketModuleRepositoryImp implements SocketModuleRepository {
    socketModuleDatasourceService = inject(SocketModuleDatasourceService)
    connect(url: string): void {
        return this.socketModuleDatasourceService.connect(url);
    }
    emit<T>(event: string, data: T): void {
        return this.socketModuleDatasourceService.emit(event, data);
    }
    listen<T>(event: string) {
        return this.socketModuleDatasourceService.listen<T>(event);
    }
    disconnect(): void {
        return this.socketModuleDatasourceService.disconnect();
    }
}