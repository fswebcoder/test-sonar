import { Component, DestroyRef, OnInit, ViewChild, computed, inject, input, output, signal } from "@angular/core";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { debounceTime } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

import { TableComponent, TableColumn, TableAction } from "@/shared/components/table/table.component";
import { PaginatorComponent } from "@/shared/components/paginator/paginator.component";
import { FloatInputComponent } from "@/shared/components/form/float-input/float-input.component";
import { EmptyStateComponent } from "@/shared/components/empty-state/empty-state.component";
import { PaginationService } from "@/shared/services/pagination.service";
import { IOrderEntity } from "@/domain/entities/scale/orders/order.entity";
import { ViewSwitcherComponent } from "@/shared/components/view-switcher/view-switcher.component";
import { ICONS } from "@/shared/enums/general.enum";
import { DialogComponent } from "@/shared/components/dialog/dialog.component";
import { WeightRegisterFormComponent } from "../../components/weight-register-form/weight-register-form.component";
import { ConfirmDialogComponent } from "@/shared/components/confirm-dialog/confirm-dialog.component";
import { IWeightRegisterParams } from "@/domain/entities/scale/weight-register/weight-register-params.entity";
import { EWeightUnits } from "@/shared/enums/weight-units.enum";
import { ScaleActions } from "@/presentation/modules/scale/modules/actions.enum";
import { EOrderScaleStatus } from "@/shared/enums/order-scale-status.enum";
import { OrderScaleCardComponent } from "@/shared/components/order-scale-card/order-scale-card.component";
import { OrderScaleDetailComponent } from "@/shared/components/order-scale-detail/order-scale-detail.component";
import { EActionSeverity } from "@/shared/enums/action-severity.enum";
import { TabsComponent, TabValue } from "@/shared/components/tabs/tabs.component";
import { IIdName } from "@/shared/interfaces/id-name.interface";

type TabKey = "pending" | "inProcess" | "completed" | "cancelled";

@Component({
	selector: "svi-material-movements-dump",
	standalone: true,
	imports: [
		TableComponent,
		PaginatorComponent,
		FloatInputComponent,
		EmptyStateComponent,
		ViewSwitcherComponent,
		OrderScaleCardComponent,
		OrderScaleDetailComponent,
		FormsModule,
		ReactiveFormsModule,
		DialogComponent,
		WeightRegisterFormComponent,
		ConfirmDialogComponent,
		TabsComponent
	],
	templateUrl: "./material-movements-dump.component.html",
	styleUrl: "./material-movements-dump.component.scss"
})
export class MaterialMovementsDumpComponent implements OnInit {
	materialMovements = input.required<IOrderEntity[]>();
	storageZones = input.required<IIdName[]>();
	title = input<string>("Movimientos de material");
	emptyStateMessage = input<string>("No se encontraron movimientos de material.");

	registerWeight = output<IWeightRegisterParams>();

	materialMovementModal = signal<boolean>(false);
	dialogHeader = signal<string>("");
	selectedOrder = signal<IOrderEntity | null>(null);
	detailDialogHeader = signal<string>("");
	detailModal = signal<boolean>(false);
	path = signal<string>("bascula/movimiento-de-material");

	@ViewChild("confirmDialog") confirmDialog!: ConfirmDialogComponent;
	@ViewChild(WeightRegisterFormComponent) weightRegisterForm!: WeightRegisterFormComponent;

	protected readonly ICONS = ICONS;
	protected readonly ScaleActions = ScaleActions;

	private readonly paginationService = inject(PaginationService);
	private readonly destroyRef = inject(DestroyRef);

	searchControl = new FormControl<string>("", { nonNullable: true });
	private readonly tabConfig: Array<{ key: TabKey; label: string; statuses: EOrderScaleStatus[] }> = [
		{
			key: "pending",
			label: "Primer pesaje",
			statuses: [EOrderScaleStatus.PENDING]
		},
		{
			key: "inProcess",
			label: "Segundo pesaje",
			statuses: [EOrderScaleStatus.IN_PROCCESS]
		},
		{
			key: "completed",
			label: "Completadas",
			statuses: [EOrderScaleStatus.COMPLETED]
		},
		{
			key: "cancelled",
			label: "Canceladas",
			statuses: [EOrderScaleStatus.CANCELLED]
		}
	];

	readonly tabs = this.tabConfig;
	activeTab = signal<TabKey>(this.tabConfig[0].key);
	readonly canRegisterWeight = computed(() => this.activeTab() === "pending" || this.activeTab() === "inProcess");

	materialMovementList = computed(() => this.materialMovements());
	viewMode = signal<"table" | "cards">("cards");
	viewOptions = computed(() => [
		{ value: "table", label: "Tabla", icon: "pi pi-bars" },
		{ value: "cards", label: "Tarjetas", icon: "pi pi-table" }
	]);

	columns: TableColumn[] = [
		{ field: "consecutive", header: "Consecutivo", type: "text" },
		{
			field: "driver",
			header: "Conductor",
			template: (item: IOrderEntity) => item.driver?.name ?? ""
		},
		{
			field: "vehicle",
			header: "Vehículo",
			template: (item: IOrderEntity) => item.vehicle?.plate ?? ""
		},
		{
			field: "supplier",
			header: "Proveedor",
			template: (item: IOrderEntity) => item.supplier?.name ?? ""
		},
		{
			field: "batch",
			header: "Lote",
			template: (item: IOrderEntity) => item.batch?.name ?? ""
		},
		{
			field: "materialType",
			header: "Tipo de material",
			template: (item: IOrderEntity) => item.materialType?.name ?? ""
		},
		{
			field: "mine",
			header: "Mina",
			template: (item: IOrderEntity) => item.mine?.name ?? "Sin mina"
		},
		{
			field: "netWeight",
			header: "Peso neto",
			template: (item: IOrderEntity) => item.netWeight ?? "Pendiente"
		}
	];

	private readonly addWeightAction: TableAction = {
		icon: ICONS.ADD,
		tooltip: "Agregar peso",
		action: (order: IOrderEntity) => this.onAddWeight(order),
		permission: {
			action: ScaleActions.REGISTRAR_PESO_MOVIMIENTO_DE_MATERIAL,
			path: this.path()
		}
	};

	private readonly viewDetailsAction: TableAction = {
		icon: ICONS.EYE,
		tooltip: "Ver detalles",
		severity: EActionSeverity.VIEW,
		action: (order: IOrderEntity) => this.onViewDetails(order),
		permission: {
			action: ScaleActions.VER_MOVIMIENTOS_DE_MATERIAL,
			path: this.path()
		}
	};

	get tableActions(): TableAction[] {
		return this.canRegisterWeight() ? [this.addWeightAction, this.viewDetailsAction] : [this.viewDetailsAction];
	}

	ngOnInit(): void {
		this.initializeFilters();
		this.listenToSearchChanges();
	}

	get totalRecords(): number {
		return this.paginationService.getTotalRecords();
	}

	private emitRegisterWeight(params: IWeightRegisterParams): void {
		this.registerWeight.emit(params);
	}

	private initializeFilters(): void {
		const params = this.paginationService.getPaginationParams();
		const search = params.search ?? "";
		this.searchControl.setValue(search, { emitEvent: false });
		this.paginationService.setSearch(search);

		const paramsStatuses = (params.statusIds ?? []) as EOrderScaleStatus[];
		const tabKey = this.resolveTabFromStatuses(paramsStatuses);
		this.activeTab.set(tabKey);
		this.applyStatusesForTab(tabKey);
	}

	private listenToSearchChanges(): void {
		this.searchControl.valueChanges
			.pipe(debounceTime(400), takeUntilDestroyed(this.destroyRef))
			.subscribe(value => {
				this.paginationService.setSearch(value);
				this.resetToFirstPage();
			});
	}

	onTabChange(value: TabValue): void {
		if (!value || typeof value !== "string") return;
		const tabKey = value as TabKey;
		if (this.activeTab() === tabKey) return;
		this.activeTab.set(tabKey);
		this.applyStatusesForTab(tabKey);
		this.resetToFirstPage();
	}


	onViewModeChange(mode: string): void {
		if (mode === "table" || mode === "cards") {
			this.viewMode.set(mode);
		}
	}

	onAddWeight(order: IOrderEntity): void {
		this.materialMovementModal.set(true);
		this.selectedOrder.set(order);
		this.dialogHeader.set(`Agregar peso al movimiento ${this.selectedOrder()!.consecutive}`);
	}

	onViewDetails(order: IOrderEntity): void {
		this.selectedOrder.set(order);
		this.detailDialogHeader.set(`Detalle del movimiento ${order.consecutive}`);
		this.detailModal.set(true);
	}

	closeMaterialMovementModal(): void {
		this.materialMovementModal.set(false);
		this.dialogHeader.set("");
		this.weightRegisterForm.clearWeight();
	}

	closeDetailModal(): void {
		this.detailModal.set(false);
		this.detailDialogHeader.set("");
	}

	askForRegisterWeight(event: Omit<IWeightRegisterParams, "id">): void {
		this.closeMaterialMovementModal();
		const data: IWeightRegisterParams = {
			id: this.selectedOrder()?.id!,
			weight: event.weight,
			destinationStorageZoneId: this.activeTab() === "pending" ? event.destinationStorageZoneId : undefined,
			imageUrl: event.imageUrl ?? null,
			imageTmpPath: event.imageTmpPath ?? null,
		};
		this.confirmDialog.show(
			`¿Estás seguro de registrar el peso leído para este movimiento de material con ${event.weight} ${EWeightUnits.KILOGRAMS}?`,
			() => this.emitRegisterWeight(data),
			() => {}
		);
	}

	private resetToFirstPage(): void {
		const paginationState = this.paginationService.paginationState();
		this.paginationService.updatePagination({
			first: 0,
			rows: paginationState.rows
		});
	}

	private applyStatusesForTab(tabKey: TabKey): void {
		const tab = this.tabConfig.find(t => t.key === tabKey) ?? this.tabConfig[0];
		this.paginationService.setStatusIds([...tab.statuses]);
	}

	private resolveTabFromStatuses(statuses: EOrderScaleStatus[]): TabKey {
		if (!statuses?.length) {
			return this.tabConfig[0].key;
		}

		const normalized = [...new Set(statuses)].sort((a, b) => a.localeCompare(b));
		const found = this.tabConfig.find(tab => {
			const tabStatuses = [...tab.statuses].sort((a, b) => a.localeCompare(b));
			return tabStatuses.length === normalized.length && tabStatuses.every((status, idx) => status === normalized[idx]);
		});

		return found?.key ?? this.tabConfig[0].key;
	}
}
