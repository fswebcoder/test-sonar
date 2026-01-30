import { SocketModuleRepository } from '@/domain/repositories/socket-module/socket-module.repository';
import { AuthService } from '@/core/guards/auth.service';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Socket, io } from 'socket.io-client';
import { ENVIRONMENT } from 'src/app.config';

@Injectable({
  providedIn: 'root'
})
export class SocketModuleDatasourceService implements SocketModuleRepository {
  private socket!: Socket;

  private env = inject(ENVIRONMENT);

  private url = `${this.env.services.socketUrl}`;
  private authService = inject(AuthService);

  connect(url: string): void {
    this.authService
      .getAccessToken()
      .pipe(take(1))
      .subscribe(tokenFromStore => {
        if (!tokenFromStore) {
          return;
        }

        const baseUrl = this.url.replace(/\/+$/, '');
        const namespace = url.startsWith('/') ? url : `/${url}`;
        const fullUrl = `${baseUrl}${namespace}`;

        this.socket = io(fullUrl, {
          auth: { token: tokenFromStore },
          transports: ['websocket', 'polling']
        });
      });
  }

  emit<T>(event: string, data: T): void {
    if (!this.socket) {
      return;
    }
    this.socket.emit(event, data);
  }
 listen<T>(event: string) {
    return new Observable<T>(subscriber => {
        if (!this.socket) {
            return;
        }
        this.socket.on(event, (data: T) => {
            subscriber.next(data);
        });

    });
}

  disconnect(): void {
    this.socket.disconnect();
  }
}
