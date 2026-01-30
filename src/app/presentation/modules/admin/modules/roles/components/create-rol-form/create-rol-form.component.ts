import { Component, input, OnInit, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FloatInputComponent } from '@/shared/components/form/float-input/float-input.component';
import { IActionEntity } from '@/domain/entities/common/action.entity';
import { ActionResourcePanelComponent } from '../action-resource-panel/action-resource-panel.component';
import { ButtonComponent } from '@/shared/components/form/button/button.component';
import { ICreateRolesParamsEntity } from '@/domain/entities/admin/roles/create-roles-params.entity';
import { ICONS } from '@/shared/enums/general.enum';
import { AccordionModule } from 'primeng/accordion';
import { FormatRolDirective } from '@/core/directives';
import { ERROR_DEFS } from '@/shared/components/form/error-def';

@Component({
  selector: 'svi-create-rol-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FloatInputComponent,
    ActionResourcePanelComponent,
    ButtonComponent,
    AccordionModule,
    FormatRolDirective
  ],
  templateUrl: './create-rol-form.component.html',
  styleUrl: './create-rol-form.component.scss'
})
export class CreateRolFormComponent implements OnInit {
  form!: FormGroup;
  actionsPermissions = input.required<IActionEntity[]>();
  onCreateRole = output<ICreateRolesParamsEntity>();

  ERROR_DEFS = ERROR_DEFS

  errorMessages = ERROR_DEFS["roleName"]

  protectedActions = signal<string[]>([]);

  ICONS = ICONS;
  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.form = new FormGroup({
      name: new FormControl(null, [Validators.required, Validators.pattern(/^[A-Z0-9_]+$/)]),
      description: new FormControl(null),
      actions: new FormControl([], [Validators.required])
    });
  }

  getSelectedActionsCount() {
    const selectedIds = this.form.get('actions')?.value || [];
    return selectedIds.length;
  }

  getSelectedActions() {
    const selectedIds = this.form.get('actions')?.value || [];
    return this.actionsPermissions().filter(action => selectedIds.includes(action.id));
  }

  onActionsChange(selectedActionIds: string[]) {
    const { actionsSelected, protectedActions } = this.processSelectedActions(selectedActionIds);
    this.protectedActions.set(protectedActions);
    this.form.get('actions')?.setValue(actionsSelected);
  }

  processSelectedActions(selectedActionIds: string[]) {
    let dependsOnActionsIds: string[] = [];

    this.actionsPermissions().forEach(action => {
      if (action.dependsOnId && selectedActionIds.includes(action.id)) {
        dependsOnActionsIds.push(action.dependsOnId);
      }
    });
    return {
      actionsSelected: Array.from(new Set([...selectedActionIds, ...dependsOnActionsIds])),
      protectedActions: [...dependsOnActionsIds]
    };
  }

  onSubmit() {
    if (this.form.valid) {
      this.onCreateRole.emit(this.form.value);
    }
  }

  cancel() {
    this.form.reset();
    this.protectedActions.set([]);
  }
}
