import { Observable } from "rxjs";

export abstract class SocketModuleRepository {
  abstract connect(url: string): void;
  abstract emit<T>(event: string, data: T): void;
  abstract listen<T>(event: string): Observable<T>;
  abstract disconnect(): void;
}