import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

export type KeyValueTableVariant = 'labelValue' | 'valueTimestamp';

export type KeyLabelMapper = Record<string, string> | ((key: string) => string);
export type KeyValueFormatter =
  | Record<string, (value: unknown) => string>
  | ((key: string, value: unknown) => string);

export interface KeyValueRow {
  left: string;
  right: string;
}

@Component({
  selector: 'svi-key-value-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './key-value-table.component.html',
  styleUrls: ['./key-value-table.component.scss']
})
export class KeyValueTableComponent {
  rows = input<KeyValueRow[] | null>(null);
  data = input<Record<string, unknown> | null>(null);
  keyOrder = input<ReadonlyArray<string> | null>(null);
  labelMapper = input<KeyLabelMapper | null>(null);
  valueFormatter = input<KeyValueFormatter | null>(null);

  variant = input<KeyValueTableVariant>('labelValue');
  leftHeader = input<string>('');
  rightHeader = input<string>('');

  displayRows(): KeyValueRow[] {
    const explicitRows = this.rows();
    if (explicitRows?.length) {
      return explicitRows;
    }

    const data = this.data();
    if (!data) {
      return [];
    }

    const keys = this.keyOrder()?.length ? [...this.keyOrder()!] : Object.keys(data);
    return keys.map((key) => ({
      left: this.getLabel(key),
      right: this.getFormattedValue(key, data[key])
    }));
  }

  private getLabel(key: string): string {
    const mapper = this.labelMapper();
    if (!mapper) return key;
    if (typeof mapper === 'function') return mapper(key);
    return mapper[key] ?? key;
  }

  private getFormattedValue(key: string, value: unknown): string {
    if (value === null || value === undefined || value === '') {
      return 'N/A';
    }

    const formatter = this.valueFormatter();
    if (formatter) {
      if (typeof formatter === 'function') {
        return formatter(key, value);
      }
      if (formatter[key]) {
        return formatter[key](value);
      }
    }

    return String(value);
  }
}
