import { IDoreRegisterEntity } from '@/domain/entities/lims/receptions/dore/dore-register.entity';
import { Component, inject, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextAreaComponent } from "@shared/components/form/text-area/text-area.component";
import { ButtonComponent } from "@shared/components/form/button/button.component";
import { ImageModule } from 'primeng/image';
import { MessageModule } from 'primeng/message';
import { FileUploadModule } from 'primeng/fileupload';
import { AccordionModule } from 'primeng/accordion';
import { ToastCustomService } from '@SV-Development/utilities';
import { FloatInputComponent } from "@/shared/components/form/float-input/float-input.component";
import { ERROR_DEFS } from '@/shared/components/form/error-def';

@Component({
  selector: 'svi-dore-register-form',
  imports: [TextAreaComponent, ButtonComponent, ReactiveFormsModule, ImageModule, MessageModule, FileUploadModule, AccordionModule, FloatInputComponent],
  templateUrl: './dore-register-form.component.html',
  styleUrl: './dore-register-form.component.scss'
})
export class DoreRegisterFormComponent {
  onAddRegister = output<IDoreRegisterEntity>();
  onCancel = output<void>();
  toasts = inject(ToastCustomService);

  form!: FormGroup;
  isLoading = signal<boolean>(false);
  isDataLoaded = signal<boolean>(false);
  isManualInput = signal<boolean>(false);
  showImageUpload = signal<boolean>(false);

  weightErrorMessages = ERROR_DEFS['weight'];

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.form = new FormGroup({
      receivedWeight: new FormControl({ value: 0, disabled: true }, [Validators.required]),
      observation: new FormControl(""),
      image: new FormControl({ 
        value: { format: 'image/jpeg', base64: '' }, 
        disabled: true 
      }, [Validators.required])
    });
  }

  async getScaleData() {
    this.form.reset();
    this.isManualInput.set(false);
    this.showImageUpload.set(false);
    this.isLoading.set(true);
      
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const mockResponse = {
        weight: 1250.75,
        image: {
          format: 'image/jpeg',
          base64: '9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCABkAGQDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAEC'
        }
      };
      
      this.form.patchValue({
        receivedWeight: mockResponse.weight,
        image: mockResponse.image
      });
      this.form.get('receivedWeight')?.enable();
      this.form.get('observation')?.enable();
      
      this.isDataLoaded.set(true);
      
    } catch (error) {
      this.isManualInput.set(true);
      this.showImageUpload.set(true);
      
      this.form.get('receivedWeight')?.enable();
      this.form.get('observation')?.enable();
      this.form.get('image')?.enable();
      
      this.toasts.error('Error al obtener datos de la balanza. Ingrese los datos manualmente.');
    } finally {
      this.isLoading.set(false);
    }
  }

  onImageUpload(event: any) {
    const file = event.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const dataUrl = e.target.result;
        const base64 = dataUrl.split(',')[1];
        
        this.form.patchValue({
          image: {
            format: file.type,
            base64: base64
          }
        });
      };
      reader.readAsDataURL(file);
    }
  }

  getImageUrl(): string {
    const imageValue = this.form.get('image')?.value;
    if (imageValue?.base64 && imageValue?.format) {
      return `data:${imageValue.format};base64,${imageValue.base64}`;
    }
    return '';
  }

  removeImage() {
    this.form.patchValue({
      image: { format: 'image/jpeg', base64: '' }
    });
  }

  addRegister() {
    const formValue = this.form.getRawValue();
    
    if (!formValue.image || !formValue.image.base64) {
      this.toasts.error('Debe seleccionar una imagen antes de agregar el registro');
      return;
    }
  
    const weight = Number(formValue.receivedWeight);
    if (isNaN(weight) || weight <= 0) {
      this.toasts.error('El peso debe ser un número válido mayor a 0');
      return;
    }
    
    this.onAddRegister.emit({
      receivedWeight: weight,
      observation: formValue.observation,
      image: formValue.image
    });
  }

  cancel() {
    this.onCancel.emit();
  }
}
