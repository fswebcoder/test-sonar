import { Component, computed, inject, output, signal } from '@angular/core';
import { DoreDumpComponent } from "../dore-dump/dore-dump.component";
import { CommonModule } from '@angular/common';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { CatalogsUseCases } from '@/domain/use-cases/common/catalogs.usecases';
import { IDoreSampleType } from '@/domain/entities/common/dore-reception-origin-response.entity';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { GlobalListsService } from '@/shared/services/global-lists.service';
import { selectCommonCities } from '@/store/selectors/common/common.selectors';
import { Store } from '@ngrx/store';
import { IDepartmentsResponseEntity } from '@/domain/entities/common/departments-response.entity';
import { ICitiesResponseEntity } from '@/domain/entities/common/cities-response.entity';
import { IsupplierListResponseEntity } from '@/domain/entities/common/suppliers-list-response.entity';
import { getCitiesAction } from '@/store/actions/common/common.action';
import { IDoreReceptionParamsEntity } from '@/domain/entities/lims/receptions/dore/dore-reception-params.entity';
import { IMiningTitlesEntity } from '@/domain/entities/admin/suppliers/mining-titles.entity';
import { MiningTitlesUseCase } from '@/domain/use-cases/admin/suppliers/mining-titles.usecase';
import { HttpErrorResponse } from '@angular/common/http';
import { DoreReceptionUseCase } from '@/domain/use-cases/lims/receptions/dore/dore-reception.usecase';
import { REGISTER_SUCCESS_TITLE } from '@/shared/constants/general.contant';
import { ToastCustomService } from '@SV-Development/utilities';

@Component({
  selector: 'svi-dore-smart',
  imports: [DoreDumpComponent, CommonModule],
  templateUrl: './dore-smart.component.html',
  styleUrl: './dore-smart.component.scss'
})
export class DoreSmartComponent {
  private readonly doreReceptionUseCase = inject(DoreReceptionUseCase);
  private readonly catalogsUseCases = inject(CatalogsUseCases);
  private globalListsService = inject(GlobalListsService);
  private store = inject(Store);
  private readonly miningTitlesUseCase = inject(MiningTitlesUseCase);
  private readonly toastCustomService = inject(ToastCustomService);

  onAddRegisterDore = output<IDoreReceptionParamsEntity>();

  departments = signal<IDepartmentsResponseEntity[]>([]);
  cities = signal<ICitiesResponseEntity[]>([]);
  suppliers = signal<IsupplierListResponseEntity[]>([]);
  miningTitles = signal<IMiningTitlesEntity[]>([]);

  ngOnInit(): void {
    this.loadInitialData();
  }

  suppliersQuery = injectQuery(() => ({
    queryKey: ['suppliers'],
    queryFn: () =>
      lastValueFrom(this.catalogsUseCases.execute('SUPPLIERS')),
    enabled: true
  }));

  suppliersQueryData = computed<IsupplierListResponseEntity[]>(() => {
    const response = this.suppliersQuery.data();
    return response?.data || [];
  });

  doreReceoptionsQuery = injectQuery(() => ({
    queryKey: ['dore-reception-origins'],
    queryFn: () => firstValueFrom(this.catalogsUseCases.execute('DORE_RECEPTION_ORIGINS')),
    enabled: true
  }));

  doreReceptionOriginsQueryData = computed<IDoreSampleType[]>(() => {
    const response = this.doreReceoptionsQuery.data();
    return response?.data || [];
  });

  getMiningTitles(supplierId: string) {
    this.miningTitles.set([]);
    this.miningTitlesUseCase.getAll({ id: supplierId }).subscribe({
      next: (response: any) => {
        if (response?.data) {
          this.miningTitles.set(response.data);
        }
      },
      error: (error: HttpErrorResponse) => {
        this.toastCustomService.error(error.error.message ?? 'Error al obtener títulos mineros');
      }
    });
  }

  addRegister(event: IDoreReceptionParamsEntity) {
    this.doreReceptionUseCase.create(event).subscribe({
      next: (response: any) => {
        this.toastCustomService.success(REGISTER_SUCCESS_TITLE);
      }, 
      error: (error: HttpErrorResponse) => {
        this.toastCustomService.error(error.error.message ?? 'Error al agregar registro');
      }
    });
  }

  private async loadInitialData(): Promise<void> {
    try {
      this.departments.set(this.globalListsService.departments());
      this.store.dispatch(getCitiesAction());
      this.store.select(selectCommonCities).subscribe(cities => {
        if (cities && cities.length > 0) {
          this.cities.set(cities);
        }
      });

      await this.suppliersQuery.refetch();
    } catch (error) {
      this.toastCustomService.error("Error", "Error al obtener datos, intente nuevamente más tarde");
    }
  }

}
