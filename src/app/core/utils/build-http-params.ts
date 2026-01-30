import { HttpParams } from '@angular/common/http';
import { orderBy } from 'lodash';


const isEmptyValue = (value: any): boolean => {
  if (value === null || value === undefined) return true;
  
  if (typeof value === 'string') return value.trim() === '';
  
  if (typeof value === 'number') return value === 0;
  
  if (Array.isArray(value)) return value.length === 0;
  
  if (typeof value === 'object') return Object.keys(value).length === 0;
  
  return false;
};


export const buildHttpParams = (args?: Record<string, any>): HttpParams => {
  let params = new HttpParams();

  if (!args) return params;

  for (const [key, value] of orderBy(Object.entries(args), '[0]')) {
    if (isEmptyValue(value)) continue;

    if (Array.isArray(value)) {
      value.forEach(v => {
        if (!isEmptyValue(v)) {
          params = params.append(key, String(v));
        }
      });
    } else {
      params = params.set(key, String(value));
    }
  }
  return params;
};
