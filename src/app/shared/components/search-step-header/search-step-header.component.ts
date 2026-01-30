import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { FloatInputComponent } from '@/shared/components/form/float-input/float-input.component';
import { ButtonComponent } from '@/shared/components/form/button/button.component';
import { ICONS } from '@/shared/enums/general.enum';
import { VehiclePlateDirective } from '@SV-Development/utilities';

@Component({
  selector: 'svi-search-step-header',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FloatInputComponent, ButtonComponent, VehiclePlateDirective],
  templateUrl: './search-step-header.component.html',
  styleUrl: './search-step-header.component.scss'
})
export class SearchStepHeaderComponent {
  searchTitle = input.required<string>();

  control = input.required<FormControl<string>>();
  inputId = input.required<string>();
  inputLabel = input.required<string>();
  inputType = input<'text' | 'number' | 'password' | 'email'>('text');
  inputUppercase = input<boolean>(false);
  useVehiclePlateDirective = input<boolean>(false);

  disabled = input<boolean>(false);
  minLength = input<number>(1);
  hintText = input<string>('');

  searchLabel = input<string>('Buscar');
  searchIcon = input<string>(ICONS.SEARCH);

  leftColMd = input<number>(6);
  rightColMd = input<number>(5);

  createTitle = input<string>('¿No aparece en la búsqueda?');
  createLabel = input.required<string>();
  createIcon = input<string>(ICONS.ADD);
  createLoadingId = input<string | null>(null);
  createDisabled = input<boolean>(false);

  searchClick = output<string>();
  createClick = output<void>();

  readonly ICONS = ICONS;

  triggerSearch(): void {
    const rawValue = this.control().value ?? '';
    let normalized = rawValue.toString().trim();

    if (this.inputUppercase()) {
      normalized = normalized.toUpperCase();
    }

    if (normalized.length < this.minLength()) {
      return;
    }

    this.control().setValue(normalized, { emitEvent: false });
    this.searchClick.emit(normalized);
  }
}
