import { IXrfParamsEntity } from '@/domain/entities/lims/analysis/xrf/xrf-params.entity';
import { ButtonComponent } from '@/shared/components/form/button/button.component';
import { FileInputComponent } from '@/shared/components/form/file-input/file-input.component';
import {
  InstructionItem,
  InstructionsPanelComponent
} from '@/shared/components/instructions-panel/instructions-panel.component';
import { ICONS } from '@/shared/enums/general.enum';
import { Component, inject, input, output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PermissionDirective } from '@/core/directives';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from "@/shared/components/confirm-dialog/confirm-dialog.component";
import { IErrorsXrfResponseEntity } from '@/domain/entities/lims/analysis/xrf/xrf-response';
import { ErrorListComponent } from "../components/error-list.component";

@Component({
  selector: 'svi-xrf-dump',
  imports: [ReactiveFormsModule, ButtonComponent, FileInputComponent, InstructionsPanelComponent, PermissionDirective, ErrorListComponent],
  templateUrl: './xrf-dump.component.html',
  styleUrl: './xrf-dump.component.scss'
})
export class XrfDumpComponent {

  router = inject(Router);
  formBuilder = inject(FormBuilder);

  currentErrors = input<IErrorsXrfResponseEntity | null>(null);
  onClearErrors = output<void>();

  @ViewChild('errorsXrf') xrfErrorDialog!: ConfirmDialogComponent;


  ICONS = ICONS;
  readonly path = this.router.url;
  instructions: InstructionItem[] = [
    {
      icon: ICONS.RAYGUN,
      iconColor: 'text-yellow-400',
      title: 'Archivo',
      description: 'Adjunta el archivo exportado de la pistola Niton'
    },
    {
      icon: ICONS.DOCUMENT,
      iconColor: 'text-blue-400',
      title: 'Formato',
      description: 'Asegurate que el archivo subido esté en formato .xlsx o .xls'
    }
  ];
  form!: FormGroup;

  onSaveXrf = output<IXrfParamsEntity>();

  ngOnInit() {
    this.createForm();
    this.listenFile()
  }

  createForm() {
    this.form = this.formBuilder.group({
      file: [null, Validators.required]
    });
  }

  resetForm() {
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  onSubmit() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }
    this.onSaveXrf.emit(this.form.value);
  }

  private listenFile() {
    this.form.get('file')?.valueChanges.subscribe((value) => {
      if(value){
        this.onClearErrors.emit()
      }
    });
  }

  get hasErrors(): boolean {
    return (
      this.currentErrors()?.repeatedSampleCodes.length! > 0 ||
      this.currentErrors()?.samplesWithNoQuarteringAnalysis.length! > 0 ||
      this.currentErrors()?.samplesWithXRFAnalysis.length! > 0
    );
  }

}