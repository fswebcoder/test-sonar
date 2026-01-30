import { CommonModule } from "@angular/common";
import { Component, DestroyRef, effect, inject, input, output, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

import { FloatSelectComponent } from "@/shared/components/form/float-select/float-select.component";
import { DatePikerComponent } from "@/shared/components/form/date-piker/date-piker.component";
import { formatDate } from "@/core/utils/format-date";
import { IGetMillingDetailParamsEntity } from "@/domain/entities/plant/milling/get-milling-detail-params.entity";
import { IMillingDetailShiftEntity } from "@/domain/entities/plant/milling/milling-detail-shift.entity";
import { IMillingRecordEntity } from "@/domain/entities/plant/milling/milling-detail.entity";
import { EmptyStateComponent } from "@/shared/components/empty-state/empty-state.component";
import { ICONS } from "@/shared/enums/general.enum";
import { MillingDetailDisplayComponent } from "../components/milling-detail-display/milling-detail-display.component";
import { TabsComponent } from "@/shared/components/tabs/tabs.component";
import { ButtonComponent } from "@/shared/components/form/button/button.component";

@Component({
  selector: "svi-milling-detail-dump",
  imports: [CommonModule, ReactiveFormsModule, FloatSelectComponent, DatePikerComponent, EmptyStateComponent, TabsComponent, MillingDetailDisplayComponent, ButtonComponent],
  templateUrl: "./milling-detail-dump.component.html",
  styleUrl: "./milling-detail-dump.component.scss"
})
export class MillingDetailDumpComponent {

  shifts = input.required<IMillingDetailShiftEntity[]>();

  selectedShiftId = input<string | undefined>(undefined);
  selectedDate = input<string | undefined>(undefined);
  milllingDetailList = input.required<IMillingRecordEntity[]>();

  filtersChange = output<IGetMillingDetailParamsEntity>();
  onDateChange = output<string>();
  onGetCurrentShift = output<void>();

  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  readonly ICONS = ICONS

  readonly filterForm = this.fb.group({
    shiftId: this.fb.control<string | null>(null),
    date: this.fb.control<Date | null>(null)
  });

  activeTab = signal<string | null>(null);
  detailTabValue = (detail: IMillingRecordEntity, index: number) => detail.id ?? `detail-${index}`;

  syncFilter$ = effect(() => {
    const shiftId = this.selectedShiftId() ?? null;
    const dateValue = this.parseDateValue(this.selectedDate());

    this.filterForm.patchValue(
      {
        shiftId,
        date: dateValue
      },
      { emitEvent: false }
    );
  });

  ensureActiveTab$ =
    effect(() => {
      const details = this.milllingDetailList();
      if (!details.length) {
        this.activeTab.set(null);
        return;
      }

      const currentActive = this.activeTab();
      const isCurrentValid = currentActive ? details.some(detail => detail.id === currentActive) : false;
      if (!isCurrentValid) {
        this.activeTab.set(details[0].id);
      }
    });

  ngOnInit(): void {
    this.listenShiftChange();
    this.listenDateChange();
  }

  onTabChange(tabId: string | number | null): void {
    if (tabId === null || tabId === undefined) return;
    this.activeTab.set(String(tabId));
  }

  formatDateWithoutYear(dateStr: string): string {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const hour = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}/${month} ${hour}:${minutes}`;
  }

  getCurrentShiftDetail() {
    this.onGetCurrentShift.emit();
  }

  private readonly listenShiftChange = () => {
    this.filterForm
      .get("shiftId")
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(shiftId => {
        this.filtersChange.emit({ shiftId: shiftId ?? undefined });
      });
  }

  private buildShiftLabel(shift: IMillingDetailShiftEntity, index: number): string {
    // Caso 1: el endpoint devuelve info del turno (start/end)
    if ('startDate' in shift && 'endDate' in shift) {
      const start = shift.startDate;
      const end = shift.endDate;
      const base = shift.name || `Turno ${index + 1}`;
      return `${base} · ${this.formatDateWithoutYear(start)} - ${this.formatDateWithoutYear(end)}`;
    }

    // Caso 2: el endpoint devuelve el detalle completo
    if ('mill' in shift) {
      const millName = shift.mill?.name || 'Molino';
      const firstRecordDate = shift.millingRecords?.[0]?.date;
      if (firstRecordDate) {
        const count = shift.millingRecords?.length ?? 0;
        return `${millName} · ${this.formatDateWithoutYear(firstRecordDate)}${count > 1 ? ` (${count})` : ''}`;
      }
      return `${millName} · Turno ${index + 1}`;
    }

    return `Turno ${index + 1}`;
  }

  private readonly listenDateChange = () => {
    this.filterForm
      .get("date")
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(date => {
        const data = formatDate(date || new Date());
        this.onDateChange.emit(data);
      });
  }

  private parseDateValue(value: string | undefined): Date | null {
    if (!value) {
      return null;
    }

    const parts = value.split('-');
    if (parts.length !== 3) {
      return null;
    }

    const [year, month, day] = parts.map(Number);
    if ([year, month, day].some(part => Number.isNaN(part))) {
      return null;
    }

    return new Date(year, month - 1, day);
  }
}