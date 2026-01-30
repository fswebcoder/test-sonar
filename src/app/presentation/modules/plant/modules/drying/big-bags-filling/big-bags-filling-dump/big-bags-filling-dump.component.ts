import { IBigBagEntity } from "@/domain/entities/plant/drying/big-bag.entity";
import { TableAction, TableColumn, TableComponent } from "@/shared/components/table/table.component";
import { PaginationService } from "@/shared/services/pagination.service";
import { Component, inject, input, output, signal, ViewChild } from "@angular/core";
import { PaginatorComponent } from "@/shared/components/paginator/paginator.component";
import { TPaginationParams } from "@SV-Development/utilities";
import { EmptyStateComponent } from "@/shared/components/empty-state/empty-state.component";
import { ButtonComponent } from "@/shared/components/form/button/button.component";
import { ICONS } from "@/shared/enums/general.enum";
import { DialogComponent } from "@/shared/components/dialog/dialog.component";
import { FillBigBagFormComponent } from "../components/fill-big-bag-form/fill-big-bag-form.component";
import { BigBagsFillingFiltersComponent } from "../components/big-bags-filters/big-bags-filling-filters.component";
import { IBigBagTypeEntity } from "@/domain/entities/common/big-bag-type.entity";
import { IFillBigBagParamsEntity } from "@/domain/entities/plant/drying/fill-big-bag-params.entity";
import { formatDate } from "@/core/utils/format-date";
import { EActionSeverity } from "@/shared/enums/action-severity.enum";
import { EDryingActions } from "@/presentation/modules/plant/modules/actions.enum";
import { IListBigBagsParamsEntity } from "@/domain/entities/plant/drying/list-big-bags-params.entity";
import { SviBigBagDetailComponent } from "../components/svi-big-bag-detail/svi-big-bag-detail.component";
import { PermissionDirective } from "@/core/directives";

@Component({
    selector: 'svi-big-bags-filling-dump',
    templateUrl: './big-bags-filling-dump.component.html',
    styleUrl: './big-bags-filling-dump.component.scss',
    imports: [
        TableComponent,
        PaginatorComponent,
        EmptyStateComponent,
        ButtonComponent,
        DialogComponent,
        FillBigBagFormComponent,
        SviBigBagDetailComponent,
        BigBagsFillingFiltersComponent,
        PermissionDirective
    ],
})
export class BigBagsFillingDumpComponent {

    paginationService = inject(PaginationService);

    isDialogVisible = signal(false);
    isDetailDialogVisible = signal(false);
    selectedBigBag = signal<IBigBagEntity | null>(null);

    data = input.required<IBigBagEntity[]>();
    bigBagTypes = input.required<IBigBagTypeEntity[]>();
    mines = input.required<any[]>();

    onParamsChange = output<TPaginationParams>();
    onFill = output<IFillBigBagParamsEntity>();
    onFilterChange = output<IListBigBagsParamsEntity>();

    @ViewChild('fillBigBagForm') fillBigBagForm!: FillBigBagFormComponent;

    path = "/planta/llenado-big-bags"
    ICONS = ICONS
    Actions = EDryingActions
    columns: TableColumn[] = [
        { field: "consecutive", header: "Consecutivo" },
        { field: "bigBagType", header: "Tipo de Big Bag", template: (row: IBigBagEntity) => row.bigBagType.name },
        { field: "mine", header: "Mina", template: (row: IBigBagEntity) => row.mine.name },
        { field: "expectedTime", header: "Fecha y hora esperada de llenado", template: (row: IBigBagEntity) => formatDate(new Date(row.expectedTime), true) },
        { field: "status", header: "Estado" },
    ]

    columnActions: TableAction[] = [
        {
            severity: EActionSeverity.VIEW,
            icon: ICONS.EYE,
            action: (bigBag: IBigBagEntity) => this.openBigBagDetail(bigBag),
            tooltip: 'Ver detalles',
            permission: {
                path: this.path,
                action: this.Actions.VER_BIG_BAGS
            }
        }
    ];

    pageChange() {
        this.onParamsChange.emit(this.paginationService.getPaginationParams());
    }

    changeModalVisibility(visible: boolean) {
        this.isDialogVisible.set(visible);
    }

    fillBigBagsHandler(params: IFillBigBagParamsEntity) {
        this.fillBigBags(params);
    }

    clearAllForms() {
        this.fillBigBagForm.resetForm();
    }

    closeAllDialogs() {
        this.isDialogVisible.set(false);
        this.isDetailDialogVisible.set(false);
    }

    cancelFill() {
        this.closeAllDialogs();
        this.clearAllForms();
    }

    openBigBagDetail(bigBag: IBigBagEntity) {
        this.selectedBigBag.set(bigBag);
        this.isDetailDialogVisible.set(true);
    }

    closeBigBagDetail() {
        this.selectedBigBag.set(null);
        this.isDetailDialogVisible.set(false);
    }

    private fillBigBags(params: IFillBigBagParamsEntity) {
        this.onFill.emit(params);
    }

    get getTotalRecords() {
        return this.paginationService.getTotalRecords();
    }
    onFiltersChange(filters: IListBigBagsParamsEntity) {
        this.onFilterChange.emit(filters);
    }
}