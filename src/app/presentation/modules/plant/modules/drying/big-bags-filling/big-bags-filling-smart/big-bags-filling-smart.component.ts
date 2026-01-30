import { BigBagsUsecase } from "@/domain/use-cases/plant/drying/big-bags.usecase";
import { ERROR_OPERATION_TITLE, LOAD_DATA_ERROR_TITLE, SUCCESS_OPERATION_TITLE } from "@/shared/constants/general.contant";
import { LoadingService } from "@/shared/services/loading.service";
import { PaginationService } from "@/shared/services/pagination.service";
import { buildFallbackPaginationMetadata } from "@/shared/helpers/pagination-metadata.helper";
import { HttpErrorResponse } from "@angular/common/http";
import { Component, computed, DestroyRef, inject, OnInit, signal, ViewChild } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { PaginatedData, ToastCustomService } from "@SV-Development/utilities";
import { injectQuery } from "@tanstack/angular-query-experimental";
import { catchError, finalize, lastValueFrom, Observable, of, tap } from "rxjs";
import { BigBagsFillingDumpComponent } from "../big-bags-filling-dump/big-bags-filling-dump.component";
import { Store } from "@ngrx/store";
import { getBigBagTypes } from "@/store/selectors/common/common.selectors";
import { IBigBagTypeEntity } from "@/domain/entities/common/big-bag-type.entity";
import { IBigBagEntity } from "@/domain/entities/plant/drying/big-bag.entity";
import { IFillBigBagParamsEntity } from "@/domain/entities/plant/drying/fill-big-bag-params.entity";
import { IFillBigBagResponseEntity } from "@/domain/entities/plant/drying/fill-big-bag-response.entity";
import { IListBigBagsParamsEntity } from "@/domain/entities/plant/drying/list-big-bags-params.entity";

@Component({
    selector: 'app-big-bags-filling-smart',
    templateUrl: './big-bags-filling-smart.component.html',
    imports: [BigBagsFillingDumpComponent]
})
export class BigBagsFillingSmartComponent implements OnInit {
    
    private readonly loadingService = inject(LoadingService);
    private readonly bigbagsUsecase = inject(BigBagsUsecase);
    private readonly paginationService = inject(PaginationService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly toastCustomService = inject(ToastCustomService);
    private readonly store = inject(Store);

    bigBagTypes = signal<IBigBagTypeEntity[]>([]);
    mines = signal<any[]>([]);
    private readonly extraFilters = signal<Partial<IListBigBagsParamsEntity>>({});

    @ViewChild('bigBagsFillingDump') bigBagsFillingDump!: BigBagsFillingDumpComponent;

    private readonly bigBagsDataSignal = signal<PaginatedData<IBigBagEntity> | undefined>(undefined);

    bigBagsQueryData = computed<PaginatedData<IBigBagEntity>>(() => {
        const data = this.bigBagsDataSignal();
        return this.processBigBagsQueryData(data);
    });

    bigBagsItems = computed<IBigBagEntity[]>(() => this.bigBagsQueryData().items ?? []);

    private readonly bigBagsQuery = injectQuery(() => {
    return {
        queryKey: ['bigBagsList', this.paginationService.getPaginationParams(), this.extraFilters()],
        queryFn: () => this.fetchBigBags(),
        onError: (error: HttpErrorResponse) => this.handleQueryError(error),
        refetchOnMount: "always",
    };
    });   

    ngOnInit(): void {
        this.paginationService.resetPagination();
        this.loadInitialData();
    }

    filtersChange(params: IListBigBagsParamsEntity) {
        const search = params.search ?? '';
        const currentRows = this.paginationService.pageSize();
        const fallbackRows = this.paginationService.getPaginationParams().limit ?? 10;
        this.paginationService.updatePagination({ first: 0, rows: currentRows ?? fallbackRows });
        this.paginationService.setSearch(search);
        this.extraFilters.set({
            mineId: params.mineId || undefined,
            date: params.date || undefined,
            status: params.status && params.status.length ? params.status : undefined,
            search: search || undefined
        });
        this.bigBagsQuery.refetch();
    }
    
    fillBigBagsHandler(event: IFillBigBagParamsEntity) {
        this.fillBigBags(event);
    }

    private loadInitialData() {
        this.store.select(getBigBagTypes).pipe(
            takeUntilDestroyed(this.destroyRef),
            tap((types) => {
                this.bigBagTypes.set(types);
            })
        ).subscribe();
    }

    private fillBigBags(params: IFillBigBagParamsEntity) {
        this.loadingService.setButtonLoading("btn-fill-big-bag",true);
        this.bigbagsUsecase.fillBigBag(params).pipe(
            takeUntilDestroyed(this.destroyRef),
            finalize(() => this.loadingService.setButtonLoading("btn-fill-big-bag",false)),
            tap((response: IFillBigBagResponseEntity) => {
                this.toastCustomService.success('Éxito', response.message || SUCCESS_OPERATION_TITLE);
                this.bigBagsQuery.refetch();
                this.clearFormsAndCloseDialogs();
            }),
            catchError((err:HttpErrorResponse): Observable<void> => {
                this.toastCustomService.error('Error', err.error.message || ERROR_OPERATION_TITLE);
                return of();
            })
        ).subscribe();
    }
    
    private async fetchBigBags(): Promise<PaginatedData<IBigBagEntity> | undefined> {
        this.loadingService.startLoading("general");
        try {
            const queryParams = this.buildQueryParams();
            const response = await lastValueFrom(this.bigbagsUsecase.getAll(queryParams));
            return this.handleFetchSuccess(response.data);
        } catch (error) {
            this.handleQueryError(error as HttpErrorResponse);
            this.bigBagsDataSignal.set(undefined);
            return undefined;
        } finally {
            this.loadingService.stopLoading("general");
        }
    }

    private buildQueryParams(): IListBigBagsParamsEntity {
        const currentParams = this.paginationService.getPaginationParams();
        return {
            ...currentParams,
            ...this.extraFilters()
        };
    }

    private handleFetchSuccess(data: PaginatedData<IBigBagEntity> | undefined): PaginatedData<IBigBagEntity> | undefined {
        if (!data) {
            this.paginationService.setTotalRecords(0);
            this.bigBagsDataSignal.set(undefined);
            return undefined;
        }

        const totalRecords = data.meta?.total ?? data.items.length ?? 0;
        this.paginationService.setTotalRecords(totalRecords);
        this.bigBagsDataSignal.set(data);
        return data;
    }

    private processBigBagsQueryData(data: PaginatedData<IBigBagEntity> | undefined): PaginatedData<IBigBagEntity> {
        return data ?? { items: [], meta: buildFallbackPaginationMetadata(this.paginationService) };
    }

    private handleQueryError(error: HttpErrorResponse) {
        this.paginationService.setTotalRecords(0);
        this.toastCustomService.error('Error', error.error?.message || LOAD_DATA_ERROR_TITLE);
    }

    private clearFormsAndCloseDialogs() {
        this.bigBagsFillingDump.clearAllForms();
        this.bigBagsFillingDump.closeAllDialogs();
    }
}