import { Injectable } from '@angular/core';

import * as crypto from 'crypto-js';
import { NUMBER_OF_ALLOWED_CHARACTERS_KEY_VECTOR, AUTOCOMPLETE_KEY_VECTOR_CHARACTERS } from './constants';
@Injectable({
  providedIn: 'root',
})
export class EncryptionService {
  constructor() {}

  public encryptStringToAES(textoCifrar: string, uuid: string): string | any {
    if (!textoCifrar || !uuid) {
      return undefined;
    }
    return crypto.AES.encrypt(textoCifrar, crypto.enc.Utf8.parse(this.getKey(`${uuid}`)), {
      iv: crypto.enc.Utf8.parse(this.getVector(`${uuid}}`)),
      mode: crypto.mode.CBC,
      padding: crypto.pad.Pkcs7,
    }).toString();
  }
  public decryptAESToString(textoCifrado: string, uuid: string): string | any {
    if (!textoCifrado || !uuid) {
      return undefined;
    }

    return crypto.AES.decrypt(textoCifrado, crypto.enc.Utf8.parse(this.getKey(`${uuid}`)), {
      iv: crypto.enc.Utf8.parse(this.getVector(`${uuid}`)),
      mode: crypto.mode.CBC,
      padding: crypto.pad.Pkcs7,
    }).toString(crypto.enc.Utf8);
  }

  private getKey(texto: string): string {
    const key = texto?.replace(/-/g, '')?.replace(/\d+/g, '');
    return this.verificarCantidadCaracteres(key);
  }

  private getVector(texto: string): string | any {
    const iv = texto?.replace(/-/g, '')?.replace(/[^\d]/g, '');
    return this.verificarCantidadCaracteres(iv);
  }

  private verificarCantidadCaracteres(texto: string): string {
    if (texto.length < 16) {
      return texto?.padEnd(NUMBER_OF_ALLOWED_CHARACTERS_KEY_VECTOR, AUTOCOMPLETE_KEY_VECTOR_CHARACTERS);
    } else if (texto.length > 16) {
      return texto?.slice(0, NUMBER_OF_ALLOWED_CHARACTERS_KEY_VECTOR);
    } else {
      return texto;
    }
  }
}
