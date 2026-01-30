import { IPrinter } from '@/domain/entities/common/printers/printers.entity';
import { ButtonComponent } from '@/shared/components/form/button/button.component';
import { FloatSelectComponent } from '@/shared/components/form/float-select/float-select.component';
import { CommonModule } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputNumberComponent } from '@shared/components/form/input-number/input-number.component';
import { MessageModule } from 'primeng/message';
import { CardModule } from 'primeng/card';
import { IPrintParams } from '@/domain/entities/common/printers/print-params.entity';
import { ERROR_DEFS } from '../form/error-def';
import { ICONS } from '@/shared/enums/general.enum';
import { InstructionItem, InstructionsPanelComponent } from '../instructions-panel/instructions-panel.component';

function multipleOfTwoValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;

  if (value == null || value === '') return null;

  const numValue = Number(value);
  if (isNaN(numValue)) return { invalidNumber: true };
  if (!Number.isInteger(numValue)) return { notInteger: true };
  if (numValue <= 0) return { notPositive: true };
  if (numValue % 2 !== 0) return { notMultipleOfTwo: true };

  return null;
}

@Component({
  selector: 'svi-print',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    FloatSelectComponent,
    InputNumberModule,
    InputNumberComponent,
    MessageModule,
    CardModule,
    InstructionsPanelComponent
  ],
  templateUrl: './print.component.html',
  styleUrl: './print.component.scss'
})
export class PrintComponent {
  ICONS = ICONS;

  sample = input.required<Omit<IPrintParams, 'count' | 'printerId'>>();
  form!: FormGroup;
  formBuilder = inject(FormBuilder);
  readonly printers = input<IPrinter[]>();
  readonly emitCancel = output<void>();
  readonly emitPrint = output<IPrintParams>();
  readonly instructions: InstructionItem[] = [
    {
      icon: ICONS.CHECK,
      iconColor: 'text-green-500',
      title: 'Selecciona una impresora',
      description: 'Elige la impresora donde se realizará la impresión'
    },
    {
      icon: ICONS.CHECK,
      iconColor: 'text-green-500',
      title: 'Cantidad de impresiones',
      description: 'Ingresa un número par (múltiplo de 2) entre 2 y 20'
    },
    {
      icon: ICONS.LIGHTBULB,
      iconColor: 'text-yellow-500',
      title: 'Ejemplos válidos',
      description: '2, 4, 6, 8, 10, 12, 14, 16, 18, 20'
    }
  ];

  errorMessages = ERROR_DEFS['totalPrint'];

  constructor() {
    this.initForm();
  }

  initForm() {
    this.form = this.formBuilder.group({
      totalPrint: new FormControl(null, [
        Validators.required,
        multipleOfTwoValidator,
        Validators.min(2),
        Validators.max(20)
      ]),
      printer: new FormControl(null, [Validators.required])
    });
  }

  getTotalPrintErrorMessage(): string {
    const control = this.form.get('totalPrint');

    if (control?.hasError('required')) {
      return 'Este campo es requerido';
    }

    if (control?.hasError('invalidNumber')) {
      return 'Debe ingresar un número válido';
    }

    if (control?.hasError('notInteger')) {
      return 'Debe ingresar un número entero';
    }

    if (control?.hasError('notPositive')) {
      return 'Debe ingresar un número positivo';
    }

    if (control?.hasError('notMultipleOfTwo')) {
      return 'El número debe ser múltiplo de 2 (ej: 2, 4, 6, 8...)';
    }

    return '';
  }

  hasTotalPrintError(): boolean {
    const control = this.form.get('totalPrint');
    return !!(control?.invalid && (control?.dirty || control?.touched));
  }

  getSuggestion(): string {
    const control = this.form.get('totalPrint');
    const value = control?.value;

    if (value && !isNaN(Number(value))) {
      const numValue = Number(value);
      if (numValue > 0 && numValue % 2 !== 0) {
        const nextEven = Math.ceil(numValue / 2) * 2;
        return `Sugerencia: ${nextEven}`;
      }
    }

    return '';
  }

  correctToNextMultiple(): void {
    const control = this.form.get('totalPrint');
    const value = control?.value;

    if (value && !isNaN(Number(value))) {
      const numValue = Number(value);
      if (numValue > 0 && numValue % 2 !== 0) {
        const nextEven = Math.ceil(numValue / 2) * 2;
        control?.setValue(nextEven);
      }
    }
  }

  print() {
    if (this.form.valid) {
      const params = this.generatePrintParams();
      this.resetForm();
      this.emitPrint.emit(params);
    }
  }

  cancel() {
    this.emitCancel.emit();
  }

  resetForm() {
    this.form.reset();
  }

  generatePrintParams(): IPrintParams {
    const params: IPrintParams = {
      count: Number(this.form.get('totalPrint')?.value),
      printerId: this.form.get('printer')?.value.id,
      sampleId: this.sample().sampleId,
    };

    return params;
  }
}
