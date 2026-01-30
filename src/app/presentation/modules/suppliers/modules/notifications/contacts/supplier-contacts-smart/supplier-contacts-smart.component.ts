import { Component, computed, inject, OnInit, signal, ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

import { ISupplierContactEntity, ICreateSupplierContactParamsEntity, IUpdateSupplierContactParamsEntity } from '@/domain/entities/suppliers/notifications';
import { SupplierContactsUseCase } from '@/domain/use-cases/suppliers/notifications/supplier-contacts.usecase';
import { LoadingService } from '@/shared/services/loading.service';
import { ToastCustomService } from '@SV-Development/utilities';
import { ERROR_OPERATION_TITLE } from '@/shared/constants/general.contant';
import { SupplierContactsDumpComponent } from '../supplier-contacts-dump/supplier-contacts-dump.component';

@Component({
  selector: 'svi-supplier-contacts-smart',
  templateUrl: './supplier-contacts-smart.component.html',
  styleUrl: './supplier-contacts-smart.component.scss',
  imports: [SupplierContactsDumpComponent]
})
export class SupplierContactsSmartComponent implements OnInit {

  private readonly supplierContactsUseCase = inject(SupplierContactsUseCase);
  private readonly loadingService = inject(LoadingService);
  private readonly toastService = inject(ToastCustomService);

  @ViewChild('contactsDump') contactsDumpComponent!: SupplierContactsDumpComponent;

  private readonly contactsData = signal<ISupplierContactEntity[]>([]);
  private isLoadingContacts = false;

  contacts = computed(() => this.contactsData());

  ngOnInit() {
    this.loadContacts();
  }

  async loadContacts() {
    if (this.isLoadingContacts) return;

    this.isLoadingContacts = true;
    this.loadingService.startLoading('general');
    try {
      const response = await lastValueFrom(this.supplierContactsUseCase.getAll());
      this.contactsData.set(response.data || []);
    } catch (error) {
      this.handleQueryError(error as HttpErrorResponse);
    } finally {
      this.loadingService.stopLoading('general');
      this.isLoadingContacts = false;
    }
  }

  private handleQueryError(error: HttpErrorResponse) {
    return error.status === 401 ? null : this.toastService.error(error.error?.message || ERROR_OPERATION_TITLE);
  }

  createContact(data: ICreateSupplierContactParamsEntity) {
    this.executeButtonOperation(
      this.supplierContactsUseCase.create(data),
      'create-contact-button',
      'Contacto creado correctamente',
      true
    );
  }

  editContact(data: IUpdateSupplierContactParamsEntity) {
    this.executeButtonOperation(
      this.supplierContactsUseCase.update(data),
      'edit-contact-button',
      'Contacto actualizado correctamente',
      true
    );
  }

  activateContact(contactId: string) {
    this.executeGeneralOperation(
      this.supplierContactsUseCase.activate(contactId),
      'Contacto activado correctamente'
    );
  }

  inactivateContact(contactId: string) {
    this.executeGeneralOperation(
      this.supplierContactsUseCase.inactivate(contactId),
      'Contacto inactivado correctamente'
    );
  }

  private executeButtonOperation(
    operation: ReturnType<typeof this.supplierContactsUseCase.create>,
    buttonId: string,
    successMessage: string,
    closeDialogs: boolean
  ) {
    this.loadingService.setButtonLoading(buttonId, true);
    operation.subscribe({
      next: () => {
        this.toastService.success(successMessage);
        if (closeDialogs) this.contactsDumpComponent?.closeAllDialogs();
        this.loadContacts();
        this.loadingService.setButtonLoading(buttonId, false);
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.error(error.error?.message || ERROR_OPERATION_TITLE);
        this.loadingService.setButtonLoading(buttonId, false);
      }
    });
  }

  private executeGeneralOperation(
    operation: ReturnType<typeof this.supplierContactsUseCase.activate>,
    successMessage: string
  ) {
    this.loadingService.startLoading('general');
    operation.subscribe({
      next: () => {
        this.toastService.success(successMessage);
        this.loadContacts();
        this.loadingService.stopLoading('general');
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.error(error.error?.message || ERROR_OPERATION_TITLE);
        this.loadingService.stopLoading('general');
      }
    });
  }
}
