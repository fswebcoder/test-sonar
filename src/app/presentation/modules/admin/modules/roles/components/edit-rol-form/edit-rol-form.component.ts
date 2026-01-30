import { Component, input, OnInit, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FloatInputComponent } from '@/shared/components/form/float-input/float-input.component';
import { IActionEntity } from '@/domain/entities/common/action.entity';
import { ActionResourcePanelComponent } from '../action-resource-panel/action-resource-panel.component';
import { ButtonComponent } from '@/shared/components/form/button/button.component';
import { ICreateRolesParamsEntity } from '@/domain/entities/admin/roles/create-roles-params.entity';
import { IRoleEntity } from '@/domain/entities/admin/roles/role.entity';
import { IRoleDetailEntity } from '@/domain/entities/admin/roles/role-detail.entity';
import { ICONS } from '@/shared/enums/general.enum';

@Component({
  selector: 'svi-edit-rol-form',
  imports: [CommonModule, ReactiveFormsModule, FloatInputComponent, ActionResourcePanelComponent, ButtonComponent],
  templateUrl: './edit-rol-form.component.html',
  styleUrl: './edit-rol-form.component.scss'
})
export class EditRolFormComponent implements OnInit {
  form!: FormGroup;
  actionsPermissions = input.required<IActionEntity[]>();
  roleData = input.required<IRoleEntity>();
  roleDetail = input.required<IRoleDetailEntity>();
  onUpdateRole = output<ICreateRolesParamsEntity>();
  onCancel = output<void>();
  protectedActions = signal<string[]>([]);

  ICONS = ICONS;

  ngOnInit(): void {
    this.createForm();
    const { protectedActions } = this.processSelectedActions(this.getRoleActionIds());
    this.protectedActions.set(protectedActions);
  }

  createForm() {
    const detail = this.roleDetail();

    this.form = new FormGroup({
      name: new FormControl(detail.name || null, [Validators.required]),
      description: new FormControl(detail.description || null),
      actions: new FormControl(this.getRoleActionIds() || [], [Validators.required])
    });
  }

  getRoleActionIds(): string[] {
    const detail = this.roleDetail();
    const actionIds = detail?.actions?.map(action => action.id) || [];
    return Array.from(new Set(actionIds));
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
      this.onUpdateRole.emit(this.form.value);
    }
  }

  cancel() {
    this.form.reset();
    this.onCancel.emit();
  }
}
