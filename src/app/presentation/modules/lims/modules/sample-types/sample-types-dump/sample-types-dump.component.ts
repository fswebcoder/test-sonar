import { ISampleTypeEntity } from '@/domain/entities/lims/sample-types/sample-type.entity';
import { TableAction, TableColumn, TableComponent } from '@/shared/components/table/table.component';
import { Component, inject, input, output, signal, ViewChild } from '@angular/core';
import { PaginationMetadata, TPaginationParams } from '@SV-Development/utilities';
import { ButtonComponent } from "@/shared/components/form/button/button.component";
import { ICONS } from '@/shared/enums/general.enum';
import { TooltipModule } from 'primeng/tooltip';
import { DialogComponent } from "@/shared/components/dialog/dialog.component";
import { ReceptionAction } from '../../generic.enum';
import { SampleTypeFormComponent } from "../components/create-edit-sample-type-form/sample-type-form.component";
import { ICreateSampleTypeParams } from '@/domain/entities/lims/sample-types/create-sample-type-params.entity';
import { FormMode } from '@/shared/types/form-mode.type';
import { IEditSampleTypeParams } from '@/domain/entities/lims/sample-types/edit-sample-type-params.entity';
import { PaginationService } from '@/shared/services/pagination.service';
import { PaginatorComponent } from "@/shared/components/paginator/paginator.component";
import { ConfirmDialogComponent } from "@/shared/components/confirm-dialog/confirm-dialog.component";
import { PermissionDirective } from '@/core/directives';
import { FilterSectionComponent } from '../components/filter-section/filter-section.component';
import { EActionSeverity } from '@/shared/enums/action-severity.enum';

@Component({
  selector: 'svi-sample-types-dump',
  imports: [ButtonComponent, TableComponent, TooltipModule, DialogComponent, SampleTypeFormComponent, PermissionDirective, PaginatorComponent, ConfirmDialogComponent, FilterSectionComponent],
  templateUrl: './sample-types-dump.component.html',
  styleUrl: './sample-types-dump.component.scss'
})
export class SampleTypesDumpComponent {

  ICONS = ICONS
  path = '/lims/tipos-de-muestra';
  ReceptionAction = ReceptionAction;

  data = input.required<ISampleTypeEntity[]>();
  meta = input.required<PaginationMetadata>();

  private readonly paginationService = inject(PaginationService);

  mode = signal<FormMode | null>(null);
  dialogOpen = signal<boolean>(false);
  selectedSampleType = signal<ISampleTypeEntity | null>(null);

  onCreateSampleType = output<ICreateSampleTypeParams>();
  onEditSampleType = output<IEditSampleTypeParams>();
  onInactivateSampleType = output<string>();
  onActivateSampleType = output<string>();

  @ViewChild('confirmDialog') confirmDialog!: ConfirmDialogComponent;


  columns = signal<TableColumn[]>([
    {field: 'name', header: "Nombre", type: 'text', width: '30%'},
    {
      field: 'description', 
      header: 'Descripción', 
      type: 'text', 
      sortable: false, 
      width: '40%',
      tooltip: {
        enabled: true,
        position: 'top'
      }
    },
    {field: 'shortName', header: "Nombre corto", type: 'text', width: '15%'},
    {
      field: 'isActive',
      header: "Estado",
      type: "badge",
      width: '10%', 
      align: 'center',
      badgeSeverity: (value) => value ? 'success' : 'warn',
      badgeText: (value) => value ? 'Activo' : 'Inactivo',
    },
  ])

  actions = signal<TableAction[]>([
    {
      icon: ICONS.EYE,
      tooltip: 'Ver detalles',
      action: (row: ISampleTypeEntity) => this.openDialog('view', row),
  severity: EActionSeverity.VIEW,
      permission: {
        action: ReceptionAction.VER_TIPOS_DE_MUESTRA,
        path: this.path
      }
    },
    {
      icon: ICONS.PENCIL,
      tooltip: 'Editar',
      action: (row: ISampleTypeEntity) => this.openDialog('edit', row),
  severity: EActionSeverity.EDIT,
      permission: {
        action: ReceptionAction.ACTUALIZAR_TIPO_DE_MUESTRA,
        path: this.path
      }
    },
    {
      icon: ICONS.TRASH,
      tooltip: 'Eliminar',
      action: (row: ISampleTypeEntity) => this.showDeleteDialog(row),
  severity: EActionSeverity.DELETE,
      disabled: (row: ISampleTypeEntity) => !row.isActive,
      permission: {
        action: ReceptionAction.ELIMINAR_TIPO_DE_MUESTRA,
        path: this.path
      }
    },
      {icon: ICONS.CHECK_CIRCLE,
      tooltip: 'Activar',
      action: (row: ISampleTypeEntity) => this.showActivateDialog(row),
  severity: EActionSeverity.ACTIVATE,
      disabled: (row: ISampleTypeEntity) => row.isActive,
      permission: {
        action: ReceptionAction.ACTIVAR_TIPO_DE_MUESTRA,
        path: this.path
      }}
  ]);

  paramsChange(params: TPaginationParams){
    this.paginationService.updatePagination({
      ...this.paginationService.getPaginationParams(),
      ...params
    });
    this.paginationService.setSearch(params.search || '');
    this.paginationService.setWithDeleted(!!params.withDeleted);
  }

  openDialog(mode: FormMode, row: ISampleTypeEntity | null) {
    this.mode.set(mode);
    this.selectedSampleType.set(row);
    this.dialogOpen.set(true);
  }

  closeAllDialogs() {
    this.dialogOpen.set(false);
    this.selectedSampleType.set(null);
    this.mode.set(null);
  }

  createSampleType(data: ICreateSampleTypeParams) {
    this.onCreateSampleType.emit(data);
  }

  editSampleType(data: IEditSampleTypeParams) {
    this.onEditSampleType.emit(data);
  }

  get getDialogText() {
    let text = ""
    switch(this.mode()) {
      case 'create':
        text = 'Crear Tipo de Muestra';
        break;
      case 'edit':
        text = 'Editar Tipo de Muestra';
        break;
      default:
        text = 'Ver Tipo de Muestra';
    }
    return text;
  }

  get getTotalRecords() {
    return this.paginationService.getTotalRecords();
  }

  private showDeleteDialog(data: ISampleTypeEntity){
    this.confirmDialog.show(
      `¿Estás seguro de que deseas eliminar el tipo de muestra "${data.name}"?`,
      ()=>{
        this.onInactivateSampleType.emit(data.id);
      },
      ()=>{}
    );
  }

  private showActivateDialog(data: ISampleTypeEntity){
    this.confirmDialog.show(
      `¿Estás seguro de que deseas activar el tipo de muestra "${data.name}"?`,
      ()=>{
        this.onActivateSampleType.emit(data.id);
      },
      ()=>{}
    );
  }
}
