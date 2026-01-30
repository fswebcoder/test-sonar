import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {

  /**
   * Señal que controla la visibilidad del modal de confirmación de logout
   * true: modal visible, false: modal oculto
   */
  private readonly _showLogoutModal = signal<boolean>(false);

  readonly showLogoutModal = this._showLogoutModal.asReadonly();

  constructor() { }


  openLogoutModal(): void {
    this._showLogoutModal.set(true);
  }

  closeLogoutModal(): void {
    this._showLogoutModal.set(false);
  }

}
