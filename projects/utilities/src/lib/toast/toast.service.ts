import { Injectable, inject } from '@angular/core';
import { MessageService, ToastMessageOptions } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ToastCustomService {
  private messageService = inject(MessageService);

  private defaultConfig: Required<Pick<ToastMessageOptions, 'key' | 'life' | 'sticky' | 'closable'>> = {
    key: 'default',
    life: 6000,
    sticky: false,
    closable: true
  };

  setDefaults(config: Partial<typeof this.defaultConfig>) {
    this.defaultConfig = { ...this.defaultConfig, ...config };
  }

  private showMessage(
    severity: 'success' | 'error' | 'info' | 'warn',
    summary: string,
    detail?: string,
    options?: Partial<ToastMessageOptions>
  ) {
    this.messageService.add({ severity, summary, detail, ...options });
  }

  success(summary: string, detail?: string, options?: Partial<ToastMessageOptions>) {
    this.showMessage('success', summary, detail, options);
  }

  error(summary: string, detail?: string, options?: Partial<ToastMessageOptions>) {
    this.showMessage('error', summary, detail, options);
  }

  info(summary: string, detail?: string, options?: Partial<ToastMessageOptions>) {
    this.showMessage('info', summary, detail, options);
  }

  warn(summary: string, detail?: string, options?: Partial<ToastMessageOptions>) {
    this.showMessage('warn', summary, detail, options);
  }

  showAll(messages: ToastMessageOptions[]) {
    this.messageService.addAll(messages);
  }

  clear(key?: string) {
    this.messageService.clear(key);
  }
}
