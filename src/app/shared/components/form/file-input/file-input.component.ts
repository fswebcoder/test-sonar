import { NgClass } from '@angular/common';
import { Component, forwardRef, inject, input, signal } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors
} from '@angular/forms';
import { uniqBy } from 'lodash';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { PrimeNG } from 'primeng/config';
import { DividerModule } from 'primeng/divider';
import { RippleModule } from 'primeng/ripple';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'svi-file-input',
  standalone: true,
  imports: [
    ButtonModule,
    BadgeModule,
    DividerModule,
    TagModule,
    TooltipModule,
    RippleModule,
    ReactiveFormsModule,
    NgClass,
    CommonModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileInputComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => FileInputComponent),
      multi: true
    }
  ],
  templateUrl: './file-input.component.html',
  styleUrl: './file-input.component.scss'
})
export class FileInputComponent {
  private readonly config = inject(PrimeNG);
  multiple = input<boolean>(true);
  accept = input<string>('*');
  maxSize = input<number>(5 * 1024 * 1024);
  files = signal<File[]>([]);
  isDisabled = signal<boolean>(false);
  isDragOver = signal(false);
  errors: string[] = [];

  protected onChange: (value: File | File[] | null) => void = () => {};
  protected onTouched: () => void = () => {};

  clearErrors() {
    this.errors = [];
  }

  writeValue(obj: any): void {
    this.files.set(this.normalizeIncomingValue(obj));
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  validate(control: AbstractControl): ValidationErrors | null {
    const files = this.files();
    const oversizedFiles = files.filter(file => file.size > this.maxSize());
    this.clearErrors();

    if (oversizedFiles.length > 0) {
      this.errors.push(
        `Los siguientes archivos exceden el tamaño máximo de ${this.formatFileSize(this.maxSize())}: ${oversizedFiles.map(f => f.name).join(', ')}`
      );
    }

    const accept = this.accept()?.trim();
    if (accept && accept !== '*') {
      const acceptedTypes = accept.split(',').map(type => type.trim().toLowerCase());
      const invalidFiles = files.filter(file => {
        const fileType = file.type.toLowerCase();
        const fileName = file.name.toLowerCase();
        const fileExt = '.' + fileName.split('.').pop();
        return !acceptedTypes.some(accepted => {
          if (accepted.includes('/')) return fileType === accepted;
          if (accepted.startsWith('.')) return fileExt === accepted;
          return false;
        });
      });

      if (invalidFiles.length > 0) {
        this.errors.push(
          `Los siguientes archivos tienen un tipo no permitido: ${invalidFiles.map(f => f.name).join(', ')}`
        );
      }
    }

    return this.errors.length > 0 ? { fileInvalid: this.errors } : null;
  }

  onFilesChange(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files) {
      this.processFiles(Array.from(input.files));
      this.onTouched();
    }
    input.value = '';
  }

  onDragOver(event: DragEvent) {
    if (this.isDisabled()) return;
    event.preventDefault();
    this.isDragOver.set(true);
  }

  onDragLeave(event: DragEvent) {
    if (this.isDisabled()) return;
    event.preventDefault();
    this.isDragOver.set(false);
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault();
    if (this.isDisabled() || !event.dataTransfer?.files) return;

    this.isDragOver.set(false);
    const accept = this.accept()?.trim();
    const allFiles = Array.from(event.dataTransfer.files);

    if (accept === '*') {
      this.processFiles(allFiles);
      return;
    }

    const acceptedTypes = accept.split(',').map(type => type.trim().toLowerCase());

    const validFiles = allFiles.filter(file => {
      const fileType = file.type.toLowerCase();
      const fileName = file.name.toLowerCase();
      const fileExt = '.' + fileName.split('.').pop();

      return acceptedTypes.some(accepted => {
        if (accepted.includes('/')) return fileType === accepted;
        if (accepted.startsWith('.')) {
          return fileExt === accepted;
        }
        return false;
      });
    });

    if (validFiles.length === 0) {
      this.errors.push('Ningún archivo válido fue agregado. Verifica los tipos permitidos.');
    }

    if (validFiles.length > 0) {
      this.processFiles(validFiles);
    }
  }

  removeFile(fileToRemove: File) {
    this.processFiles(this.files().filter(file => file !== fileToRemove));
  }

  formatFileSize(bytes: number): string {
    const k = 1024;
    const dm = 3;
    const sizes = this.config.translation.fileSizeTypes!;

    if (bytes === 0) {
      return `0 ${sizes[0]}`;
    }

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

    return `${formattedSize} ${sizes[i]}`;
  }

  private processFiles(newFiles: File[]) {
    const multiple = this.multiple();
    this.files.update(old => uniqBy(multiple ? [...old, ...newFiles] : newFiles.slice(0, 1), 'name'));

    const currentFiles = this.files();
    this.onChange(multiple ? currentFiles : (currentFiles[0] ?? null));
  }

  private normalizeIncomingValue(value: unknown): File[] {
    if (!value) return [];

    const maybeWrappedValue = (value as any)?.value;
    if (maybeWrappedValue !== undefined) {
      return this.normalizeIncomingValue(maybeWrappedValue);
    }

    if (value instanceof File) {
      return [value];
    }

    if (typeof FileList !== 'undefined' && value instanceof FileList) {
      return Array.from(value);
    }

    if (Array.isArray(value)) {
      return value.filter(v => v instanceof File) as File[];
    }

    return [];
  }

  trackByFileName(index: number, file: File): string {
    return file.name;
  }
}
