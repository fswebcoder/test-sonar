import { Component, computed, inject, OnInit, signal, ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

import {
  ISupplierNotificationConfigEntity,
  ICreateNotificationConfigParamsEntity,
  INotificationTypeEntity,
  ISupplierContactEntity
} from '@/domain/entities/suppliers/notifications';
import { SupplierNotificationConfigsUseCase } from '@/domain/use-cases/suppliers/notifications/supplier-notification-configs.usecase';
import { SupplierContactsUseCase } from '@/domain/use-cases/suppliers/notifications/supplier-contacts.usecase';
import { LoadingService } from '@/shared/services/loading.service';
import { ToastCustomService } from '@SV-Development/utilities';
import { ERROR_OPERATION_TITLE } from '@/shared/constants/general.contant';
import { NotificationConfigsDumpComponent } from '../notification-configs-dump/notification-configs-dump.component';

@Component({
  selector: 'svi-notification-configs-smart',
  templateUrl: './notification-configs-smart.component.html',
  styleUrl: './notification-configs-smart.component.scss',
  imports: [NotificationConfigsDumpComponent]
})
export class NotificationConfigsSmartComponent implements OnInit {

  private readonly notificationConfigsUseCase = inject(SupplierNotificationConfigsUseCase);
  private readonly supplierContactsUseCase = inject(SupplierContactsUseCase);
  private readonly loadingService = inject(LoadingService);
  private readonly toastService = inject(ToastCustomService);

  @ViewChild('configsDump') configsDumpComponent!: NotificationConfigsDumpComponent;

  private readonly configsData = signal<ISupplierNotificationConfigEntity[]>([]);
  private readonly notificationTypesData = signal<INotificationTypeEntity[]>([]);
  private readonly contactsData = signal<ISupplierContactEntity[]>([]);

  private isLoadingConfigs = false;

  configs = computed(() => this.configsData());
  notificationTypes = computed(() => this.notificationTypesData());
  contacts = computed(() => this.contactsData().filter(c => c.isActive));

  ngOnInit() {
    this.loadData();
  }

  async loadData() {
    await Promise.all([
      this.loadConfigs(),
      this.loadNotificationTypes(),
      this.loadContacts()
    ]);
  }

  async loadConfigs() {
    if (this.isLoadingConfigs) return;

    this.isLoadingConfigs = true;
    this.loadingService.startLoading('general');
    try {
      const response = await lastValueFrom(this.notificationConfigsUseCase.getAll());
      this.configsData.set(response.data || []);
    } catch (error) {
      this.handleQueryError(error as HttpErrorResponse);
    } finally {
      this.loadingService.stopLoading('general');
      this.isLoadingConfigs = false;
    }
  }

  private async loadNotificationTypes() {
    try {
      const response = await lastValueFrom(this.notificationConfigsUseCase.getNotificationTypes());
      this.notificationTypesData.set(response.data || []);
    } catch (error) {
      this.handleQueryError(error as HttpErrorResponse);
    }
  }

  private async loadContacts() {
    try {
      const response = await lastValueFrom(this.supplierContactsUseCase.getAll());
      this.contactsData.set(response.data || []);
    } catch (error) {
      this.handleQueryError(error as HttpErrorResponse);
    }
  }

  private handleQueryError(error: HttpErrorResponse) {
    return error.status === 401 ? null : this.toastService.error(error.error?.message || ERROR_OPERATION_TITLE);
  }

  createConfig(data: ICreateNotificationConfigParamsEntity) {
    this.executeButtonOperation(
      this.notificationConfigsUseCase.create(data),
      'create-config-button',
      'Configuración creada correctamente',
      true
    );
  }

  activateConfig(configId: string) {
    this.executeGeneralOperation(
      this.notificationConfigsUseCase.activate(configId),
      'Configuración activada correctamente'
    );
  }

  inactivateConfig(configId: string) {
    this.executeGeneralOperation(
      this.notificationConfigsUseCase.inactivate(configId),
      'Configuración eliminada correctamente'
    );
  }

  private executeButtonOperation(
    operation: ReturnType<typeof this.notificationConfigsUseCase.create>,
    buttonId: string,
    successMessage: string,
    closeDialogs: boolean
  ) {
    this.loadingService.setButtonLoading(buttonId, true);
    operation.subscribe({
      next: () => {
        this.toastService.success(successMessage);
        if (closeDialogs) this.configsDumpComponent?.closeAllDialogs();
        this.loadConfigs();
        this.loadingService.setButtonLoading(buttonId, false);
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.error(error.error?.message || ERROR_OPERATION_TITLE);
        this.loadingService.setButtonLoading(buttonId, false);
      }
    });
  }

  private executeGeneralOperation(
    operation: ReturnType<typeof this.notificationConfigsUseCase.activate>,
    successMessage: string
  ) {
    this.loadingService.startLoading('general');
    operation.subscribe({
      next: () => {
        this.toastService.success(successMessage);
        this.loadConfigs();
        this.loadingService.stopLoading('general');
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.error(error.error?.message || ERROR_OPERATION_TITLE);
        this.loadingService.stopLoading('general');
      }
    });
  }
}
