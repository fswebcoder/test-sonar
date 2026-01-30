import { ButtonComponent } from '@/shared/components/form/button/button.component';
import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, OnInit, output, signal, viewChild } from '@angular/core';
import { DialogComponent } from '@/shared/components/dialog/dialog.component';
import { ViewSwitcherComponent } from '@/shared/components/view-switcher/view-switcher.component';
import { TPaginationParams } from '@SV-Development/utilities';
import { PaginationService } from '@/shared/services/pagination.service';
import { ISuppliersEntity } from '@/domain/entities/admin/suppliers/suppliers.entity';
import { TableAction } from '@/shared/components/table/table.component';
import { TableComponent } from '@/shared/components/table/table.component';
import { ICONS } from '@/shared/enums/general.enum';
import { EActionSeverity } from '@/shared/enums/action-severity.enum';
import { EmptyStateComponent } from '@/shared/components/empty-state/empty-state.component';
import { SupplierCardComponent } from '../components/supplier-card/supplier-card.component';
import { SupplierAdminUserFormComponent } from '../components/supplier-admin-user-form/supplier-admin-user-form.component';
import { IOptionValue } from '@/shared/interfaces/option-value.interface';
import { PaginatorComponent } from '@/shared/components/paginator/paginator.component';
import { ConfirmDialogComponent } from '@/shared/components/confirm-dialog/confirm-dialog.component';
import { ManagementSupplierComponent } from '../management-supplier/management-supplier.component';
import { PermissionDirective } from '@/core/directives';
import { CheckboxComponent } from "@/shared/components/form/checkbox/checkbox.component";
import { FormsModule } from '@angular/forms';
import { IDocumentTypeResponse } from '@/domain/entities/common/document-response.entity';
import { ICreateSupplierAdminUserParamsEntity } from '@/domain/entities/admin/suppliers/create-supplier-admin-user-params.entity';

@Component({
  selector: 'svi-suppliers-list-dump',
  imports: [
    CommonModule,
    ButtonComponent,
    CheckboxComponent,
    DialogComponent,
    ViewSwitcherComponent,
    TableComponent,
    EmptyStateComponent,
    SupplierCardComponent,
    PaginatorComponent,
    ConfirmDialogComponent,
    ManagementSupplierComponent,
    SupplierAdminUserFormComponent,
    PermissionDirective,
    FormsModule
  ],
  templateUrl: './suppliers-list-dump.component.html',
  styleUrl: './suppliers-list-dump.component.scss'
})
export class SuppliersListDumpComponent implements OnInit {
  paginationService = inject(PaginationService);

  viewChildDialog = viewChild<ConfirmDialogComponent>('confirmDialog');
  visible = signal(false);
  isEditMode = signal(false);
  selectedSupplier = signal<ISuppliersEntity | null>(null);
  viewMode = signal<string>('table');
  suppliers = input.required<ISuppliersEntity[]>();
  documentTypes = input.required<IDocumentTypeResponse[]>();
  meta = input.required<TPaginationParams>();
  viwModeVisualisation = signal<string>('create');
  supplierToEdit = input<any>(null);
  supplierIdToEdit = input<string>('');

  onParamsChange = output<TPaginationParams>();
  onGetSupplier = output<void>();
  onGetSupplierById = output<string>();
  onDeleteSupplier$ = output<string>();
  supplierId$ = signal<string>('');

  onActivateSupplier$ = output<string>();

  onCreateSupplierAdminUser = output<ICreateSupplierAdminUserParamsEntity>();

  supplierUserVisible = signal(false);
  supplierUserSupplierId = signal<string>('');
  supplierUserSupplierName = signal<string>('');

  subppliersTransformed = computed(() => {
    return this.suppliers().map(supplier => {
      const transformedSupplier: any = {};

      Object.keys(supplier).forEach(key => {
        const fieldData = supplier[key as keyof ISuppliersEntity] as IOptionValue;

        if (fieldData) {
          if (key === 'documentNumber' && supplier.verificationDigit) {
            transformedSupplier[key] = `${fieldData.value}-${supplier.verificationDigit.value}`;
          } else if (key === 'isActive') {
            const isActiveValue = fieldData.value;
            transformedSupplier[key] = Boolean(isActiveValue) ? 'Activo' : 'Inactivo';
          } else if (key === 'verificationDigit') {
            return;
          } else {
            const value = fieldData.value;
            if (key.includes('Discount') || key.includes('Percentage') || key.includes('Recovery')) {
              transformedSupplier[key] = value ? `${value}` : '-';
            } else {
              transformedSupplier[key] = value || '-';
            }
          }
        }
      });

      return transformedSupplier;
    });
  });

  suppliersForCards = computed(() => {
    return this.suppliers().map(supplier => ({
      ...supplier,
      documentNumber: `${supplier.documentNumber?.value || ''}-${supplier.verificationDigit?.value  === '0' ? '0' : supplier.verificationDigit?.value}`
    }));
  });

  supplierDataForForm = computed(() => {
    const supplier = this.selectedSupplier();
    if (!supplier) return {};

    const formData: Record<string, any> = {};

    Object.keys(supplier).forEach(key => {
      const fieldData = supplier[key as keyof ISuppliersEntity] as IOptionValue;
      if (fieldData && fieldData.value !== null && fieldData.value !== undefined) {
        formData[key] = fieldData.value;
      }
    });

    return formData;
  });

  supplierId = computed(() => {
    const supplier = this.selectedSupplier();
    return supplier?.documentNumber?.value || '';
  });

  dialogTitle = computed(() => {
     return this.viwModeVisualisation() === 'view' ? 'Visualizar información del proveedor' : this.isEditMode() ? 'Editar proveedor' : 'Crear proveedor';
  });


  readonly columns = computed(() => {
    const firstSupplier = this.suppliers()[0];
    if (!firstSupplier) return [];
    const supplierProperties = Object.keys(firstSupplier) as (keyof ISuppliersEntity)[];
    const excludedFields = ['verificationDigit', 'id', ];

    return supplierProperties
      .filter(field => !excludedFields.includes(field))
      .map(field => {
        const fieldData = firstSupplier[field] as IOptionValue;
        if (field === 'isActive') {
          return {
            field: field as string,
            header: fieldData?.label || field,
            type: 'badge' as const,
            badgeText: (value: any) => value,
            badgeColor: (value: any) => (value === 'Activo' ? 'success' : 'danger'),
            badgeSeverity: (value: any) => (value === 'Activo' ? 'success' : 'danger')
          };
        }

        return {
          field: field as string,
          header: fieldData?.label || field
        };
      });
  });

  readonly actions: TableAction[] = [
    {
      icon: ICONS.EYE,
      action: (item: any) => this.onViewSupplier(item),
      tooltip: 'Ver',
  severity: EActionSeverity.VIEW,
      permission: {
        path: '/admin/proveedores',
        action: 'VER_PROVEEDORES'
      }
    },
    {
      icon: ICONS.CHECK_CIRCLE,
      action: (item: any) => this.onToggleSupplierStatus(item),
      tooltip: 'Activar',
      disabled: (item: any) => item.isActive === 'Activo',
  severity: EActionSeverity.ACTIVATE,
      permission: {
        path: '/admin/proveedores',
        action: 'ACTIVAR_PROVEEDOR'
      }
    },

    {
      icon: ICONS.PENCIL,
      action: (item: any) => this.onEditSupplier(item),
      tooltip: 'Editar',
      disabled: (item: any) => item.isActive === 'Inactivo',
  severity: EActionSeverity.EDIT,
      permission: {
        path: '/admin/proveedores',
        action: 'EDITAR_PROVEEDOR'
      }
    },

    {
      icon: ICONS.TRASH,
      action: (item: any) => this.onDeleteSupplier(item),
      tooltip: 'Inactivar',
      disabled: (item: any) => item.isActive === 'Inactivo',
  severity: EActionSeverity.DEACTIVATE,
      permission: {
        path: '/admin/proveedores',
        action: 'INACTIVAR_PROVEEDOR'
      }
    },
    {
      icon: ICONS.USER_PLUS,
      action: (item: any) => this.openSupplierUserDialog(item),
      tooltip: 'Crear usuario admin',
      severity: EActionSeverity.ACTION,
      permission: {
        path: '/admin/proveedores',
        action: 'CREAR_USUARIO_PROVEEDOR'
      }
    },
  ];

  readonly viewOptions = computed(() => [
    { value: 'table', label: 'Tabla', icon: 'fa-duotone fa-solid fa-bars' },
    { value: 'cards', label: 'Tarjetas', icon: 'fa-duotone fa-solid fa-table' }
  ]);

  ngOnInit(): void {
    this.onParamsChange.emit(this.paginationService.getPaginationParams());
  }

  openDialog() {
    this.viwModeVisualisation.set('create');
    this.isEditMode.set(false);
    this.selectedSupplier.set(null);
    this.visible.set(true);
  }

  openEditDialog(supplier: any) {
    this.isEditMode.set(true);
    this.selectedSupplier.set(supplier);
    this.onGetSupplierById.emit(supplier.id.value ||  supplier.id);
    this.supplierId$.set(supplier.id.value ||  supplier.id);
    this.visible.set(true);
  }

  closeDialog() {
    this.visible.set(false);
    this.selectedSupplier.set(null);
    this.onParamsChange.emit(this.paginationService.getPaginationParams());
  }

  onViewChanged(view: string) {
    this.viewMode.set(view);
  }

  onEditSupplier(supplier: any) {
    this.viwModeVisualisation.set('edit');
    this.openEditDialog(supplier);
  }

  onDeleteSupplier(supplier: any) {
    this.viewChildDialog()?.show(
      '¿Estás seguro de querer eliminar este proveedor?',
      () => {
          this.onDeleteSupplier$.emit(supplier.id.value || supplier.id);

      },
      () => {}
    );
  }

  onPageChange(event: any) {
    this.onParamsChange.emit(this.paginationService.getPaginationParams());
  }

  onToggleSupplierStatus(supplier: any) {
    this.viewChildDialog()?.show(
        
      '¿Estás seguro de querer activar este proveedor?',
      () => {
        this.onActivateSupplier$.emit(supplier.id.value || supplier.id);


      },
      () => {}
    );
  }

  onViewSupplier(supplier: ISuppliersEntity) {
    this.viwModeVisualisation.set('view');
    this.openEditDialog(supplier);
  }

  handleGetSupplier() {
    this.onGetSupplier.emit();
  }

  withDeletedChange(withDeleted: boolean) {
    this.paginationService.setWithDeleted(withDeleted);
    this.onParamsChange.emit(this.paginationService.getPaginationParams());
  }

  getTotalRecords() {
    return this.paginationService.getTotalRecords() || 0;
  }

  openSupplierUserDialog(supplier: any): void {
    const supplierId = supplier?.id?.value || supplier?.id || '';
    const supplierName = supplier?.name?.value || supplier?.name || '';

    this.supplierUserSupplierId.set(supplierId);
    this.supplierUserSupplierName.set(supplierName);
    this.supplierUserVisible.set(true);
  }

  closeSupplierUserDialog(): void {
    this.supplierUserVisible.set(false);
    this.supplierUserSupplierId.set('');
    this.supplierUserSupplierName.set('');
  }
}
