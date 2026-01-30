import { Component, computed, input, output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { Tabs, TabList, Tab, TabPanels, TabPanel } from "primeng/tabs";

import { DashboardFiltersComponent } from "../components/dashboard-filters/dashboard-filters.component";
import { ReceptionsDashboardComponent } from "../components/receptions-dashboard/receptions-dashboard.component";
import { MovementsDashboardComponent } from "../components/movements-dashboard/movements-dashboard.component";
import { StockDashboardComponent } from "../components/stock-dashboard/stock-dashboard.component";

import {
  IMovementsDashboardEntity,
  IStockByLocationEntity,
  IWeighbridgeDashboardEntity
} from "@/domain/entities/scale/dashboard/dashboard-metrics.entity";
import { IsupplierListResponseEntity } from "@/domain/entities/common/suppliers-list-response.entity";
import { IIdName } from "@/shared/interfaces/id-name.interface";
import { ICONS } from "@/shared/enums/general.enum";

export type DashboardTab = "receptions" | "movements" | "stock";

@Component({
  selector: "svi-dashboard-dump",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    DashboardFiltersComponent,
    ReceptionsDashboardComponent,
    MovementsDashboardComponent,
    StockDashboardComponent
  ],
  templateUrl: "./dashboard-dump.component.html",
  styleUrl: "./dashboard-dump.component.scss"
})
export class DashboardDumpComponent {
  receptionsData = input<IWeighbridgeDashboardEntity | null>(null);
  movementsData = input<IMovementsDashboardEntity | null>(null);
  stockData = input<IStockByLocationEntity | null>(null);

  startDateControl = input.required<FormControl<Date>>();
  endDateControl = input.required<FormControl<Date>>();
  supplierControl = input.required<FormControl<string | null>>();
  mineControl = input.required<FormControl<string | null>>();
  suppliersOptions = input<IsupplierListResponseEntity[]>([]);
  minesOptions = input<IIdName[]>([]);

  activeTab = input<DashboardTab>("receptions");

  supplierChange = output<string | null>();
  tabChange = output<DashboardTab>();

  readonly ICONS = ICONS;

  hasSupplierFilter = computed(() => !!this.supplierControl().value);
  hasMineFilter = computed(() => !!this.mineControl().value);

  tabIndex = computed(() => {
    const tabMap: Record<DashboardTab, number> = {
      receptions: 0,
      movements: 1,
      stock: 2
    };
    return tabMap[this.activeTab()];
  });

  onTabChange(index: number): void {
    const tabMap: Record<number, DashboardTab> = {
      0: "receptions",
      1: "movements",
      2: "stock"
    };

    const newTab = tabMap[index];
    if (newTab && newTab !== this.activeTab()) {
      this.tabChange.emit(newTab);
    }
  }
}
