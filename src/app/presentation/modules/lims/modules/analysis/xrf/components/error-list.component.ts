import { IErrorsXrfResponseEntity } from "@/domain/entities/lims/analysis/xrf/xrf-response";
import { CollapsiblePanelComponent } from "@/shared/components/collapsible-panel";
import { CommonModule } from "@angular/common";
import { Component, computed, input } from "@angular/core";

type ErrorKey = keyof IErrorsXrfResponseEntity;

type Panel = {
  key: ErrorKey;
  title: string;
  header: string;
  items: string[];
};

@Component({
  selector: 'svi-error-list',
  imports: [CommonModule, CollapsiblePanelComponent],
  templateUrl: './error-list.component.html',
})
export class ErrorListComponent {
  errors = input.required<IErrorsXrfResponseEntity | null>();

  private readonly meta: Record<ErrorKey, { title: string; header: string; order: number }> = {
    samplesWithXRFAnalysis: {
      title: 'Ver detalles',
      header: 'Muestras con análisis XRF ya realizados',
      order: 1,
    },
    repeatedSampleCodes: {
      title: 'Ver detalles',
      header: 'Muestras repetidas en el archivo',
      order: 2,
    },
    samplesWithNoQuarteringAnalysis: {
      title: 'Ver detalles',
      header: 'Muestras con cuarteo no realizado',
      order: 3,
    },
  };

  panels = computed<Panel[]>(() => {
    const e = this.errors();
    const data = e ?? ({} as IErrorsXrfResponseEntity);

    const entries = Object.entries(data) as [ErrorKey, string[]][];

    return entries
      .map(([key, list]) => ({
        key,
        title: this.meta[key].title,
        header: this.meta[key].header,
        items: Array.isArray(list) ? list : [],
        order: this.meta[key].order,
      }))
      .filter(p => p.items.length > 0)
      .sort((a, b) => a.order - b.order);
  });
}
