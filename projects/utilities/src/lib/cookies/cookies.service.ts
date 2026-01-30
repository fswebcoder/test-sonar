import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { CookieService, SameSite } from 'ngx-cookie-service';
import { COOKIES_NAMES } from './enums/nombres-cookies.enum';
import { EncryptionService } from '../encrypt';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class CookiesService {
    private currentDomain: string;

    constructor(
        private readonly cookieService: CookieService,
        private readonly encryptionService: EncryptionService,
        @Inject(PLATFORM_ID) private platformId: Object,
        @Inject('env') private readonly env?: any
    ) {
        this.currentDomain = this.getDomain();
    }

    private getDomain(): string {
        if (isPlatformBrowser(this.platformId)) {
            const hostname = window.location.hostname;
            return hostname;
        }
        return '';
    }

    private getUUID(): string {
        return this.cookieService.get(COOKIES_NAMES.UUID);
    }

    private getNameUser(): string {
        return this.cookieService.get(COOKIES_NAMES.USER_NAME);
    }

    public getCookie(nombre: COOKIES_NAMES | string, descifrar: boolean = false): string {
        const valor = this.cookieService.get(nombre);
        return descifrar ? this.encryptionService.decryptAESToString(valor, this.getUUID()) : valor;
    }

    public saveCookie(nombre: string, valor: string, _expira: number = 3, cifrar: boolean = false, ruta: string = '/', secure: boolean = false, sameSite: SameSite = 'Lax'): void {
        const valorFinal = cifrar ? this.encryptionService.encryptStringToAES(valor.toString(), this.getUUID()) : valor;

        this.cookieService.set(nombre, valorFinal, _expira, ruta, this.currentDomain, false, sameSite);
    }

    public deleteAllCookies(ruta: string = '/'): void {
        this.cookieService.deleteAll(ruta, this.currentDomain);
    }

    public deleteCookie(nombre: COOKIES_NAMES, ruta: string = '/'): void {
        this.cookieService.delete(nombre, ruta, this.currentDomain);
    }
}
 