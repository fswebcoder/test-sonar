import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ICONS } from '@/shared/enums/general.enum';
import { ButtonComponent } from '@/shared/components/form/button/button.component';

@Component({
  selector: 'svi-smelting-grid',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent],
  templateUrl: './smelting-grid.component.html',
  styleUrls: ['./smelting-grid.component.scss']
})
export class SmeltingGridComponent {
  @Input() rows: number = 1;
  @Input() columns: number = 1;
  @Input() samples: (string | null)[] = [];
  @Input() weights: (number | null)[] = [];
  @Input() weightMode: boolean = false;
  @Input() finished: boolean = false;
  @Input() readOnly: boolean = false;
  @Input() units: string = 'g';
  @Output() cellSelected = new EventEmitter<{ row: number, col: number }>();
  @Output() editCell = new EventEmitter<{ row: number, col: number, value: string }>();
  @Output() deleteCell = new EventEmitter<{ row: number, col: number }>();
  @Output() weightCellSelected = new EventEmitter<{ row: number, col: number, value: string }>();

  ICONS = ICONS

  rowsArray(): any[] {
    return Array(this.rows);
  }

  columnsArray(): any[] {
    return Array(this.columns);
  }

  isCellEmpty(row: number, col: number): boolean {
    const idx = row * this.columns + col;
    return !this.samples[idx];
  }

  hasWeight(row: number, col: number): boolean {
    const idx = row * this.columns + col;
  const v = this.weights?.[idx];
  return typeof v === 'number' && v > 0;
  }

  displayWeight(row: number, col: number): string {
    const idx = row * this.columns + col;
    const w = this.weights?.[idx];
    if (w === null || w === undefined) return '';
  return w.toFixed(2);
  }

  onCellClick(row: number, col: number) {
  if (this.finished || this.readOnly) return;
    const idx = row * this.columns + col;
    const value = this.samples[idx];
    if (this.weightMode) {
      if (value) {
        this.weightCellSelected.emit({ row, col, value });
      }
      return;
    }
    if (!value) {
      this.cellSelected.emit({ row, col });
    } else {
      this.editCell.emit({ row, col, value });
    }
  }

  onDelete(row: number, col: number, event: MouseEvent) {
    event.stopPropagation();
  if (this.weightMode || this.finished || this.readOnly) return;
    this.deleteCell.emit({ row, col });
  }

  getCellPosition(row: number, col: number): number {
    return row * this.columns + col + 1;
  }

  formatSample(sample: string | null): string {
    return sample ? sample : '';
  }

  ngOnInit() {}

  trackByIndex(index: number, _: any) {
    return index;
  }

}
