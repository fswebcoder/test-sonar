import { Component, computed, input, output } from "@angular/core";
import { IBigBagEntity } from "@/domain/entities/plant/drying/big-bag.entity";
import { formatDate } from "@/core/utils/format-date";
import { MetricItemComponent } from "@/shared/components/metric-item/metric-item.component";
import { TagModule } from "primeng/tag";
import { ButtonComponent } from "@/shared/components/form/button/button.component";
import { ICONS } from "@/shared/enums/general.enum";

@Component({
    selector: "svi-big-bag-detail",
    standalone: true,
    imports: [MetricItemComponent, TagModule, ButtonComponent],
    templateUrl: "./svi-big-bag-detail.component.html",
    styleUrl: "./svi-big-bag-detail.component.scss"
})
export class SviBigBagDetailComponent {
    bigBag = input.required<IBigBagEntity | null>();
    onClose = output<void>();

    readonly ICONS = ICONS

    protected metrics = computed(() => {
        const bag = this.bigBag();
        if (!bag) {
            return [] as { label: string; value: string }[];
        }

        return [
            { label: "Consecutivo", value: bag.consecutive ?? "-" },
            { label: "Tipo de Big Bag", value: bag.bigBagType?.name ?? "-" },
            { label: "Mina", value: bag.mine?.name ?? "-" },
            { label: "Fecha esperada", value: this.format(bag.expectedTime) },
            { label: "Fecha de entrega", value: this.format(bag.deliveryDate) },
            { label: "Peso de llenado (kg)", value: bag.filledWeight ?? "-" },
            { label: "Peso de carga (kg)", value: bag.loadWeight ?? "-" },
            { label: "Peso de descarga (kg)", value: bag.downloadWeight ?? "-" }
        ];
    });

    protected sealRecords = computed(() => this.bigBag()?.sealRecord ?? []);

    protected statusLabel = computed(() => {
        const bag = this.bigBag();
        if (!bag) {
            return "-";
        }

        return bag.status;
    });

    protected close() {
        this.onClose.emit();
    }

    protected format(date?: string | Date) {
        if (!date) {
            return "-";
        }
        const parsed = typeof date === "string" ? new Date(date) : date;
        return formatDate(parsed, true);
    }
}
