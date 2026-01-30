import { Injectable } from '@angular/core';
import { IBranding } from '@/shared/entities/branding.entity';
import { ICompany } from '@/shared/entities/company.entity';

@Injectable({
  providedIn: 'root'
})
export class BrandingService {


  applyBranding(branding: IBranding): void {
    if (!branding) {
      return;
    }

    const root = document.documentElement;
    root.style.setProperty(`--primaryColor`, branding.primaryColor || '#6F3C0D');
    root.style.setProperty(`--secundaryColor`, branding.secondaryColor || '#6F3C0D');
  }

  saveBranding(branding: IBranding): void {
    if (!branding) {
      return;
    }

    localStorage.setItem('branding', JSON.stringify(branding));
  }

  loadBranding(): IBranding | null {
    try {
      const branding = localStorage.getItem('branding');
      if (branding) {
        const parsedBranding = JSON.parse(branding);
        return parsedBranding;
      }
    } catch (error) {
      console.error('BrandingService: Error al cargar branding desde localStorage', error);
    }
    return null;
  }


  applyBrandingFromStorage(): void {
    const branding = this.loadBranding();
    if (branding) {
      this.applyBranding(branding);
    }
  }

  clearBranding(): void {
    localStorage.removeItem('branding');
  }

  saveActiveCompany(company: ICompany): void {
    if (!company) {
      return;
    }

    localStorage.setItem('activeCompany', JSON.stringify(company));
  }

  loadActiveCompany(): ICompany | null {
    try {
      const company = localStorage.getItem('activeCompany');
      if (company) {
        const parsedCompany = JSON.parse(company);
        return parsedCompany;
      }
    } catch (error) {
      console.error('BrandingService: Error al cargar empresa activa desde localStorage', error);
    }
    return null;
  }


  clearActiveCompany(): void {
    localStorage.removeItem('activeCompany');
  }

  clearAll(): void {
    this.clearActiveCompany();
  }
} 