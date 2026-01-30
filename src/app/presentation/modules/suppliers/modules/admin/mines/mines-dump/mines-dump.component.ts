import { Component, DestroyRef, inject, input, OnInit, output, signal, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';

import { IMineEntity } from '@/domain/entities/suppliers/admin/mines/mine.entity';
import { IUpdateMineParamsEntity } from '@/domain/entities/suppliers/admin/mines/update-mine-params.entity';
import { TableAction, TableColumn, TableComponent } from '@/shared/components/table/table.component';
import { ButtonComponent } from '@/shared/components/form/button/button.component';
import { CheckboxComponent } from '@/shared/components/form/checkbox/checkbox.component';
import { FloatInputComponent } from '@/shared/components/form/float-input/float-input.component';
import { DialogComponent } from '@/shared/components/dialog/dialog.component';
import { ConfirmDialogComponent } from '@/shared/components/confirm-dialog/confirm-dialog.component';
import { PaginatorComponent } from '@/shared/components/paginator/paginator.component';
import { PaginationService } from '@/shared/services/pagination.service';
import { ICONS } from '@/shared/enums/general.enum';
import { EActionSeverity } from '@/shared/enums/action-severity.enum';
import { FormMode } from '@/shared/types/form-mode.type';
import { MineFormComponent } from '../components/mine-form/mine-form.component';
import { EMineActions } from '@/presentation/modules/suppliers/actions.enum';
import { TPaginationParams } from '@SV-Development/utilities';

@Component({
  selector: 'svi-mines-dump',
  templateUrl: './mines-dump.component.html',
  styleUrl: './mines-dump.component.scss',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ButtonComponent,
    CheckboxComponent,
    FloatInputComponent,
    TableComponent,
    DialogComponent,
    ConfirmDialogComponent,
    PaginatorComponent,
    MineFormComponent
  ]
})
export class MinesDumpComponent implements OnInit {

  ICONS = ICONS;

  private readonly paginationService = inject(PaginationService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly path = '/proveedores/minas'

  data = input.required<IMineEntity[]>();

  onParamsChange = output<TPaginationParams>();
  onCreateMine = output<{ name: string }>();
  onEditMine = output<IUpdateMineParamsEntity>();
  onActivateMine = output<string>();
  onInactivateMine = output<string>();

  mode = signal<FormMode | null>(null);
  dialogOpen = signal<boolean>(false);
  selectedMine = signal<IMineEntity | null>(null);
  withDeleted = signal<boolean>(false);
  searchControl = new FormControl<string>('', { nonNullable: true });

  @ViewChild('confirmDialog') confirmDialog!: ConfirmDialogComponent;

  ngOnInit(): void {
    this.initializeFilters();
    this.listenToSearchChanges();
    this.onParamsChange.emit(this.paginationService.getPaginationParams());
  }

  columns = signal<TableColumn[]>([
    { field: 'name', header: 'Nombre', type: 'text', width: '70%' },
    {
      field: 'isActive',
      header: 'Estado',
      type: 'badge',
      width: '20%',
      align: 'center',
      badgeSeverity: (value) => value ? 'success' : 'warn',
      badgeText: (value) => value ? 'Activo' : 'Inactivo',
    }
  ]);

  actions = signal<TableAction[]>([
    {
      icon: ICONS.EYE,
      tooltip: 'Ver detalles',
      action: (row: IMineEntity) => this.openDialog('view', row),
      severity: EActionSeverity.VIEW,
      permission: {
        action: EMineActions.VER_MINAS,
        path: this.path
      }
    },
    {
      icon: ICONS.PENCIL,
      tooltip: 'Editar',
      action: (row: IMineEntity) => this.openDialog('edit', row),
      severity: EActionSeverity.EDIT,
      permission: {
        action: EMineActions.EDITAR_MINA,
        path: this.path
      }
    },
    {
      icon: ICONS.TRASH,
      tooltip: 'Inactivar',
      action: (row: IMineEntity) => this.showInactivateDialog(row),
      severity: EActionSeverity.DELETE,
      disabled: (row: IMineEntity) => !row.isActive,
      permission: {
        action: EMineActions.ELIMINAR_MINA,
        path: this.path
      }
    },
    {
      icon: ICONS.CHECK_CIRCLE,
      tooltip: 'Activar',
      action: (row: IMineEntity) => this.showActivateDialog(row),
      severity: EActionSeverity.ACTIVATE,
      disabled: (row: IMineEntity) => row.isActive,
      permission: {
        action: EMineActions.ACTIVAR_MINA,
        path: this.path
      }
    }
  ]);

  get dialogTitle(): string {
    switch (this.mode()) {
      case 'create':
        return 'Crear Mina';
      case 'edit':
        return 'Editar Mina';
      default:
        return 'Ver Mina';
    }
  }

  openDialog(mode: FormMode = 'create', row: IMineEntity | null = null): void {
    this.mode.set(mode);
    this.selectedMine.set(row);
    this.dialogOpen.set(true);
  }

  closeAllDialogs(): void {
    this.dialogOpen.set(false);
    this.selectedMine.set(null);
    this.mode.set(null);
  }

  createMine(data: { name: string }): void {
    this.onCreateMine.emit({ name: data.name });
  }

  editMine(data: { id: string; name: string }): void {
    this.onEditMine.emit({ id: data.id, name: data.name });
  }

  private showInactivateDialog(data: IMineEntity): void {
    this.confirmDialog.show(
      `¿Estás seguro de que deseas inactivar la mina "${data.name}"?`,
      () => {
        this.onInactivateMine.emit(data.id);
      },
      () => {}
    );
  }

  private showActivateDialog(data: IMineEntity): void {
    this.confirmDialog.show(
      `¿Estás seguro de que deseas activar la mina "${data.name}"?`,
      () => {
        this.onActivateMine.emit(data.id);
      },
      () => {}
    );
  }

  onPageChange(event: any) {
    this.onParamsChange.emit(this.paginationService.getPaginationParams());
  }

  withDeletedChange(value: boolean) {
    this.withDeleted.set(value);
    this.paginationService.setWithDeleted(value);
    this.resetToFirstPage();
  }

  get totalRecords() {
    return this.paginationService.getTotalRecords();
  }

  private initializeFilters(): void {
    const params = this.paginationService.getPaginationParams();
    this.withDeleted.set(!!params.withDeleted);
    this.paginationService.setWithDeleted(!!params.withDeleted);

    const search = params.search ?? '';
    this.searchControl.setValue(search, { emitEvent: false });
    this.paginationService.setSearch(search);
  }

  private listenToSearchChanges(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(400), takeUntilDestroyed(this.destroyRef))
      .subscribe(value => {
        this.paginationService.setSearch(value);
        this.resetToFirstPage();
      });
  }

  private resetToFirstPage(): void {
    const paginationState = this.paginationService.paginationState();
    this.paginationService.updatePagination({
      first: 0,
      rows: paginationState.rows
    });
    this.onParamsChange.emit(this.paginationService.getPaginationParams());
  }
}
