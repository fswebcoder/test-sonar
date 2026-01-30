import { ICreateUsersParamsEntity } from "@/domain/entities/admin/users/create-users-params.entity";
import { IUserEntity } from "@/domain/entities/admin/users/user.entity";
import { inject, Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class FormCreateEditService {
    private formBuilder = inject(FormBuilder);
    private formGroup!: FormGroup;

    constructor() {
        this.initializeForm();
        this.formGroup.markAllAsTouched();

    }

    private initializeForm(): void {
        this.formGroup = this.formBuilder.group({
            name: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', [Validators.email]],
            phone: [''],
            documentNumber: ['', Validators.required],
            documentTypeId: ['', Validators.required],
            roleId: ['', Validators.required],
            image: [''], 
            password: [''] 
        });
    }

    buildForm(data?: IUserEntity | null): FormGroup {
        if (!this.formGroup) {
            
            this.initializeForm();
        }

        if (data) {
            const patchData = {
                name: data.name || '',
                lastName: data.lastName || '',
                email: data.email || '',
                phone: data.phone || '',
                image: data.image || '',
                documentNumber: data.documentNumber || '',
                documentTypeId: data.documentTypeId || '',
                roleId: data.roleId || '',
                password: ''
            };
            this.formGroup.patchValue(patchData);
        } else {
            this.formGroup.reset();
        }
        
        return this.formGroup;
    }

    getFormData() {
        const formValue: ICreateUsersParamsEntity = this.formGroup.value;
        if (!formValue.password || formValue.password.trim() === '') {
            const { password, ...dataWithoutPassword } = formValue;
            return dataWithoutPassword;
        }
        return formValue;
    }

    getFormGroup(): FormGroup {
        return this.formGroup;
    }

    resetForm(): void {
        this.formGroup.reset();
    }
}