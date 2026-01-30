import { HttpContextToken } from '@angular/common/http';

export const BYPASS_AUDITORIA = new HttpContextToken(() => true);
export const BYPASS_ENCABEZADOS = new HttpContextToken(() => true);
export const BYPASS_ERRORES = new HttpContextToken(() => true);
export const BYPASS_SPINNER = new HttpContextToken(() => true);
