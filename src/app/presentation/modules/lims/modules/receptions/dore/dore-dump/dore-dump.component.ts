import { ICitiesResponseEntity } from '@/domain/entities/common/cities-response.entity';
import { IDepartmentsResponseEntity } from '@/domain/entities/common/departments-response.entity';
import { IDoreSampleType } from '@/domain/entities/common/dore-reception-origin-response.entity';
import { IsupplierListResponseEntity } from '@/domain/entities/common/suppliers-list-response.entity';
import { IMiningTitlesEntity } from '@/domain/entities/admin/suppliers/mining-titles.entity';
import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, input, output, signal, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FloatSelectComponent } from "@shared/components/form/float-select/float-select.component";
import { ButtonComponent } from "@shared/components/form/button/button.component";
import { DatePikerComponent } from "@shared/components/form/date-piker/date-piker.component";
import { DialogComponent } from "@shared/components/dialog/dialog.component";
import { DoreRegisterFormComponent } from "../components/dore-register-form/dore-register-form.component";
import { IDoreRegisterEntity } from '@/domain/entities/lims/receptions/dore/dore-register.entity';
import { TableAction, TableColumn, TableComponent } from "@shared/components/table/table.component";
import { FloatInputComponent } from '@/shared/components/form/float-input/float-input.component';
import { IDoreReceptionParamsEntity } from '@/domain/entities/lims/receptions/dore/dore-reception-params.entity';
import { PermissionDirective } from '@/core/directives';
import { Router } from '@angular/router';
import { ReceptionAction } from '@/presentation/modules/lims/modules/generic.enum';
import { ConfirmDialogComponent } from '@/shared/components/confirm-dialog/confirm-dialog.component';
import { ToastCustomService } from '@SV-Development/utilities';
import { EActionSeverity } from '@/shared/enums/action-severity.enum';

@Component({
  selector: 'svi-dore-dump',
  imports: [CommonModule, ReactiveFormsModule, FloatSelectComponent, ButtonComponent, DatePikerComponent, DialogComponent, DoreRegisterFormComponent, TableComponent, FloatInputComponent, PermissionDirective, ConfirmDialogComponent ],
  templateUrl: './dore-dump.component.html',
  styleUrl: './dore-dump.component.scss'
})
export class DoreDumpComponent {
[x: string]: any;
  router = inject(Router);
  path = this.router.url;
  readonly doreReceptionOrigins = input<IDoreSampleType[]>([]);
  readonly doreReceptionOriginsSignal = computed(() => this.doreReceptionOrigins());
  
  readonly departments = input<IDepartmentsResponseEntity[]>([]);
  readonly departmentsSignal = computed(() => this.departments());
  
  readonly cities = input<ICitiesResponseEntity[]>([]);
  readonly citiesSignal = computed(() => this.cities());
  
  readonly suppliers = input<IsupplierListResponseEntity[]>([]);
  readonly suppliersSignal = computed(() => this.suppliers());

  readonly citiesByDepartment = signal<ICitiesResponseEntity[]>([]);
  readonly visible = signal<boolean>(false);
  readonly items = signal<IDoreRegisterEntity[]>([]);
  readonly miningTitles = input<IMiningTitlesEntity[]>([]);
  readonly hasMiningTitle = signal<boolean>(false);
  readonly formState = signal<number>(0);

  readonly toastService = inject(ToastCustomService);

  @ViewChild(DoreRegisterFormComponent) registerForm!: DoreRegisterFormComponent;
  @ViewChild(ConfirmDialogComponent) confirmDialog!: ConfirmDialogComponent;

  form!: FormGroup;
  onSaveDore = output<IDoreReceptionParamsEntity>();
  onOpenRegisterForm = output<void>();
  onGetMiningTitles = output<string>();
  doreAction = ReceptionAction
  readonly isFormValid = computed(() => {
    if (!this.form) return false;
    
    this.formState();
    
    const formValid = this.form.valid;
    const hasItems = this.items().length > 0;
    
    return formValid && hasItems;
  });

  constructor() {
    this.initForm();
    this.setupEffects();
  }
  

  ngOnInit(): void {
    this.setupFormSubscriptions();
  }

  private initForm(): void {
    this.form = new FormGroup({
      receptionDate: new FormControl({ value: new Date(), disabled: true }, [Validators.required]),
      deliveryNumber: new FormControl(null, [Validators.required]),
      supplier: new FormControl(null, [Validators.required]),
      department: new FormControl(null, [Validators.required]),
      city: new FormControl(null, [Validators.required]),
      doreReceptionOrigin: new FormControl(null, [Validators.required]),
      miningTitle: new FormControl(null),
      observation: new FormControl('')
    });
  }

  private setupEffects(): void {
    effect(() => {
      const supplier = this.form?.get('supplier')?.value;
      if (supplier) {
        this.handleSupplierChange(supplier);
      }
    });

    effect(() => {
      this.isFormValid();
      this.formState.update(state => state + 1);
    });
  }

  private setupFormSubscriptions(): void {
    this.onChangeDepartment();
    this.onChangeDoreReceptionOrigin();
    this.onChangeSupplier();
    this.form.valueChanges.subscribe(() => {
      this.formState.update(state => state + 1);
    });
  }

  private onChangeDepartment(): void {
    this.form.get('department')?.valueChanges.subscribe(value => {
      if (value) {
        this.filterCitiesByDepartment(value);
        this.resetCityField();
      } else {
        this.clearCitiesFilter();
      }
    });
  }

  private onChangeDoreReceptionOrigin(): void {
    this.form.get('doreReceptionOrigin')?.valueChanges.subscribe(value => {
      if (value) {
        this.resetDeliveryNumber();
        this.handleMiningTitleRequirement(value);
      }
    });
  }

  private onChangeSupplier(): void {
    this.form.get('supplier')?.valueChanges.subscribe(value => {
      if (value && this.hasMiningTitle()) {
        const supplierId = typeof value === 'object' ? value.id : value;
        this.onGetMiningTitles.emit(supplierId);
        this.form.get('miningTitle')?.setValue(null);
      }
    });
  }

  private filterCitiesByDepartment(departmentId: string): void {
    const filteredCities = this.citiesSignal().filter(city => city.departmentId === departmentId);
    this.citiesByDepartment.set(filteredCities);
  }

  private clearCitiesFilter(): void {
    this.citiesByDepartment.set([]);
  }

  private resetCityField(): void {
    this.form.get('city')?.reset();
  }

  private resetDeliveryNumber(): void {
    this.form.get('deliveryNumber')?.reset();
  }


  private handleSupplierChange(supplier: any): void {
  }

  private handleMiningTitleRequirement(originId: string): void {
    const originObj = this.doreReceptionOriginsSignal().find(origin => origin.id === originId);
  
    if (!originObj) return;
    
    if (originObj.hasMiningTitle) {
      this.hasMiningTitle.set(true);
    } else {
      this.hasMiningTitle.set(false);
      const field = this.form.get('miningTitle');
      field?.clearValidators();
      field?.setValue(null);
      field?.markAsTouched();
      field?.updateValueAndValidity();
    }
    
  
    this.form.get('miningTitle')?.updateValueAndValidity();
  }
  

  addRegisterForm(event: IDoreRegisterEntity): void {
    const currentItems = this.items();
    this.items.set([...currentItems, event]);
    this.hideRegisterForm();
  }
  

  removeItem(item: IDoreRegisterEntity): void {
    this.confirmDialog.show(
      `¿Está seguro que desea eliminar el registro de peso de ${item.receivedWeight}gr?`,
      () => {
        const currentItems = this.items();
        const filteredItems = currentItems.filter(i => i !== item);
        this.items.set(filteredItems);
      },
      () => {}
    );
  }

  openRegisterForm(): void {
    this.visible.set(true);
  }

  hideRegisterForm(): void {
    this.visible.set(false);
    this.registerForm?.form?.reset();
  }

  saveDore(): void {    
    if (this.isFormValid()) {
      const formData = this.buildFormData();
      this.onSaveDore.emit(formData);
      this.resetForm();
    } 
  }


  private buildFormData(): IDoreReceptionParamsEntity {
    const formValue = this.form.value;
    const validatedItems = this.items().map(item => {
      if (!item.image || !item.image.base64) {
        this.toastService.error('Debe seleccionar una imagen para cada item');
      }
      return item;
    });
    
    return {
      supplierId: formValue.supplier,
      sampleTypeId: formValue.doreReceptionOrigin,
      miningTitleId: formValue.miningTitle,
      cityId: formValue.city,
      receptionDate: new Date(this.form.get('receptionDate')?.value).toISOString(),
      batchNumber: formValue.deliveryNumber,
      observation: formValue.observation || '',
      items: validatedItems,
    } as IDoreReceptionParamsEntity;
  }

  private resetForm(): void {
    this.form.reset();
    this.items.set([]);
  }

  columns: TableColumn[] = [
    {
      field: 'receivedWeight',
      header: 'Peso Inicial (gr)'
    },
    {
      field: 'image',
      header: 'Imagen',
      type: 'image',
      width: '100px',
    },
    {
      field: 'observation',
      header: 'Observaciones',
      template: (row: IDoreRegisterEntity) => {
        if (row.observation) {
          return row.observation.length > 20 ? row.observation.substring(0, 20) + '...' : row.observation;
        }
        return '';
      }
    }
  ];

  tableActions: TableAction[] = [
    {
      icon: 'pi pi-trash',
      tooltip: 'Eliminar registro',
      action: (row: IDoreRegisterEntity) => this.removeItem(row),
  severity: EActionSeverity.DELETE
    }
  ];
}
