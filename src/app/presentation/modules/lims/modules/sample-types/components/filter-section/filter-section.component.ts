import { CheckboxComponent } from "@/shared/components/form/checkbox/checkbox.component";
import { FloatInputComponent } from "@/shared/components/form/float-input/float-input.component";
import { Component, DestroyRef, inject, output } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { debounceTime } from "rxjs";

@Component({
  selector: 'svi-filter-section',
  imports: [ReactiveFormsModule, FloatInputComponent, CheckboxComponent],
  template: `
    <form [formGroup]="form" class="flex align-items-center gap-3">
        <svi-float-input formControlName="search" label="Buscar por nombre"></svi-float-input>
      <svi-checkbox formControlName="withDeleted" label="¿Incluir eliminados?" class="my-auto"></svi-checkbox>
    </form>
  `
})
export class FilterSectionComponent {
    form!: FormGroup;

    onDeletedChange = output<boolean>();
    onSearchChange = output<string>();

    destroyRef = inject(DestroyRef);

    ngOnInit() {
        this.createForm();
        this.listenToFormChanges();
    }

    private listenToFormChanges() {
        this.form.get('withDeleted')?.valueChanges.pipe(
            takeUntilDestroyed(this.destroyRef)
        ).subscribe(value => {
            this.onDeletedChange.emit(value);
        });

        this.form.get('search')?.valueChanges.pipe(
            takeUntilDestroyed(this.destroyRef),
            debounceTime(500)
        ).subscribe(value => {
            this.onSearchChange.emit(value);
        });
    }

    private createForm() {
        this.form = new FormGroup({
            withDeleted: new FormControl(false),
            search: new FormControl(''),
        });
    }
}