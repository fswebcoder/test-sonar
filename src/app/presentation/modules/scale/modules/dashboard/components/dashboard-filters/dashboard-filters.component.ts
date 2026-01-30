import { Component, input, output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormControl, ReactiveFormsModule } from "@angular/forms";

import { DatePikerComponent } from "@/shared/components/form/date-piker/date-piker.component";
import { FloatSelectComponent } from "@/shared/components/form/float-select/float-select.component";

import { IsupplierListResponseEntity } from "@/domain/entities/common/suppliers-list-response.entity";
import { IIdName } from "@/shared/interfaces/id-name.interface";

@Component({
  selector: "svi-dashboard-filters",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DatePikerComponent,
    FloatSelectComponent
  ],
  templateUrl: "./dashboard-filters.component.html",
  styleUrl: "./dashboard-filters.component.scss"
})
export class DashboardFiltersComponent {
  startDateControl = input.required<FormControl<Date>>();
  endDateControl = input.required<FormControl<Date>>();
  supplierControl = input.required<FormControl<string | null>>();
  mineControl = input.required<FormControl<string | null>>();
  suppliersOptions = input<IsupplierListResponseEntity[]>([]);
  minesOptions = input<IIdName[]>([]);

  supplierChange = output<string | null>();

  readonly today = new Date();
}
