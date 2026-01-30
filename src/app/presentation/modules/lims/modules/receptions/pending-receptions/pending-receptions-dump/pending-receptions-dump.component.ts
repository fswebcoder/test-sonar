import { IPendingReceptionEntity } from '@/domain/entities/lims/receptions/pending-receptions/pending-reception.entity';
import { TableAction, TableColumn, TableComponent } from '@/shared/components/table/table.component';
import { Component, input, OnInit, signal, computed, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FloatInputComponent } from "@/shared/components/form/float-input/float-input.component";
import { EWeightUnits } from '@/shared/enums/weight-units.enum';
import { DialogComponent } from '@/shared/components/dialog/dialog.component';
import { CompletePendingReceptionFormComponent } from '../components/complete-pending-reception-form/complete-pending-reception-form.component';
import { ICompletePendingReceptionParamsEntity } from '@/domain/entities/lims/receptions/pending-receptions/complete-pending-reception-params.entity';
import { ReceptionAction } from '@/presentation/modules/lims/modules/generic.enum';
import { ICONS } from '@/shared/enums/general.enum';
import { EmptyStateComponent } from "@/shared/components/empty-state/empty-state.component";
import { formatWeight } from '@/core/utils/format-weight';

@Component({
    selector: 'svi-pending-receptions-dump',
    templateUrl: './pending-receptions-dump.component.html',
    imports: [TableComponent, FloatInputComponent, ReactiveFormsModule, DialogComponent, CompletePendingReceptionFormComponent, EmptyStateComponent],
})

export class PendingReceptionsDumpComponent implements OnInit {

    data = input.required<IPendingReceptionEntity[]>();
    weight = input<number | null>(null);
    allowManualWeight = input<boolean>(false);
    isReadingWeight = input<boolean>(false);
    
    ReceptionAction = ReceptionAction;
    ICONS = ICONS;
    path = '/lims/recepciones-pendientes'

    searchTerm = signal<string>('');
    searchControl = new FormControl('');

    filteredData = computed(() => {
        const term = this.searchTerm().trim().toLowerCase();
        const source = this.data() || [];
        if (!term) return source;
        return source.filter(item => {
            const code = (item.sampleCode || '').toLowerCase();
            const type = (item.sampleTypeName || '').toLowerCase();
            return code.includes(term) || type.includes(term);
        });
    });

    showCompleteModal = signal(false);
    selectedReception = signal<IPendingReceptionEntity | null>(null);
    completeReception = output<ICompletePendingReceptionParamsEntity>();
    requestReadWeight = output<void>();
    modalOpened = output<IPendingReceptionEntity>();
    modalClosed = output<void>();

    columns: TableColumn[] = [
        {
            field: "sampleCode",
            header: "Código de Muestra"
        },
        {
            field: "sampleTypeName",
            header: "Tipo de Muestra"
        },
        {
            field: "priority",
            header: "Prioridad",
            template: (row) => row.priority || 'N/A'
        },
        {
            field: "carrier",
            header: "Transportista",
            template: (row) => row.carrier || 'N/A'
        },
        {
            field: "weight",
            header: "Peso",
            template: (row) => `${formatWeight(row.weight)} ${EWeightUnits.GRAMS}`
        }
    ];

    get actions(): TableAction[] {
        return [
            {
                icon: ICONS.CHECK_FILE,
                tooltip: 'Completar recepción',
                action: (row: IPendingReceptionEntity) => this.openComplete(row),
                permission: {
                    action: this.ReceptionAction.CREAR_RECEPCIONES_PENDIENTES,
                    path: this.path
                }
            }
        ];
    }

    ngOnInit() {
        this.searchControl.valueChanges.subscribe(val => {
            this.onSearch(val || '');
        });
    }

    onSearch(term: string) {
        this.searchTerm.set(term);
    }

    openComplete(row: IPendingReceptionEntity) {
        this.selectedReception.set(row);
        this.showCompleteModal.set(true);
        this.modalOpened.emit(row);
    }

    onSubmitComplete(formValue: ICompletePendingReceptionParamsEntity) {
        const original = this.selectedReception();
        if (!original) return;
        this.completeReception.emit(formValue);
        this.closeModal();
    }

    handleFormSubmit(event: ICompletePendingReceptionParamsEntity) {
        this.onSubmitComplete(event);
    }

    closeModal() {
        this.showCompleteModal.set(false);
        this.selectedReception.set(null);
        this.modalClosed.emit();
    }

    handleReadWeightRequest() {
        this.requestReadWeight.emit();
    }
}