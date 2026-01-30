# Ejemplos de Validación para svi-weight-input

## Configuración Básica con Validaciones

```typescript
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export class MyComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      retainedWeight: ['', [
        Validators.required,
        Validators.min(0),
        Validators.max(40000)
      ]]
    });
  }
}
```

```html
<svi-weight-input
  label="Peso retenido"
  formControlName="retainedWeight"
  unit="Gr"
  [errorMessages]="{
    'required': 'El peso retenido es obligatorio',
    'min': 'El peso no puede ser menor a 0',
    'max': 'El peso retenido no puede ser mayor a 40000'
  }"
>
</svi-weight-input>
```

## Validaciones Personalizadas

### Validación de Rango Específico
```typescript
this.form = this.fb.group({
  sampleWeight: ['', [
    Validators.required,
    Validators.min(1),
    Validators.max(1000)
  ]]
});
```

```html
<svi-weight-input
  label="Peso de muestra"
  formControlName="sampleWeight"
  unit="Gr"
  [errorMessages]="{
    'required': 'El peso de la muestra es obligatorio',
    'min': 'El peso debe ser al menos 1 gramo',
    'max': 'El peso no puede exceder 1000 gramos'
  }"
>
</svi-weight-input>
```

### Validación con Patrón Personalizado
```typescript
this.form = this.fb.group({
  preciseWeight: ['', [
    Validators.required,
    Validators.pattern(/^\d+(\.\d{1,2})?$/)
  ]]
});
```

```html
<svi-weight-input
  label="Peso preciso"
  formControlName="preciseWeight"
  unit="Gr"
  [errorMessages]="{
    'required': 'El peso preciso es obligatorio',
    'pattern': 'El peso debe tener máximo 2 decimales'
  }"
>
</svi-weight-input>
```

## Validaciones por Unidad

### Para Kilogramos
```html
<svi-weight-input
  label="Peso total"
  formControlName="totalWeight"
  unit="Kg"
  [errorMessages]="{
    'required': 'El peso total es obligatorio',
    'min': 'El peso debe ser mayor a 0 kg',
    'max': 'El peso no puede exceder 100 kg'
  }"
>
</svi-weight-input>
```

### Para Libras
```html
<svi-weight-input
  label="Peso en libras"
  formControlName="weightInLbs"
  unit="Lb"
  [errorMessages]="{
    'required': 'El peso en libras es obligatorio',
    'min': 'El peso debe ser mayor a 0 lb',
    'max': 'El peso no puede exceder 220 lb'
  }"
>
</svi-weight-input>
```

## Validaciones Asíncronas

```typescript
import { AsyncValidatorFn } from '@angular/forms';
import { map } from 'rxjs/operators';

export class MyComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder, private weightService: WeightService) {
    this.form = this.fb.group({
      validatedWeight: ['', [
        Validators.required,
        Validators.min(0)
      ], [
        this.validateWeightRange.bind(this)
      ]]
    });
  }

  validateWeightRange: AsyncValidatorFn = (control) => {
    return this.weightService.validateWeight(control.value).pipe(
      map(isValid => isValid ? null : { invalidWeight: true })
    );
  };
}
```

```html
<svi-weight-input
  label="Peso validado"
  formControlName="validatedWeight"
  unit="Gr"
  [errorMessages]="{
    'required': 'El peso es obligatorio',
    'min': 'El peso debe ser mayor a 0',
    'invalidWeight': 'El peso no está dentro del rango permitido'
  }"
>
</svi-weight-input>
```

## Manejo de Estados de Validación

```typescript
export class MyComponent {
  form: FormGroup;

  get isWeightValid(): boolean {
    return this.form.get('retainedWeight')?.valid ?? false;
  }

  get weightErrors(): string[] {
    const control = this.form.get('retainedWeight');
    if (control?.errors) {
      return Object.keys(control.errors);
    }
    return [];
  }
}
```

```html
<div class="form-group">
  <svi-weight-input
    label="Peso retenido"
    formControlName="retainedWeight"
    unit="Gr"
    [errorMessages]="{
      'required': 'El peso retenido es obligatorio',
      'min': 'El peso no puede ser menor a 0',
      'max': 'El peso retenido no puede ser mayor a 40000'
    }"
  >
  </svi-weight-input>
  
  @if (isWeightValid) {
    <div class="valid-feedback">
      ✓ Peso válido
    </div>
  }
</div>
```

## Configuración Global de Mensajes de Error

```typescript
// En un servicio o constante global
export const WEIGHT_ERROR_MESSAGES = {
  required: 'El peso es obligatorio',
  min: 'El peso debe ser mayor a 0',
  max: 'El peso excede el límite permitido',
  pattern: 'Formato de peso inválido'
};

// En el componente
export class MyComponent {
  weightErrorMessages = WEIGHT_ERROR_MESSAGES;
}
```

```html
<svi-weight-input
  label="Peso retenido"
  formControlName="retainedWeight"
  unit="Gr"
  [errorMessages]="weightErrorMessages"
>
</svi-weight-input>
```

## Consejos para Mensajes de Error Efectivos

1. **Sé específico**: En lugar de "Campo inválido", usa "El peso debe estar entre 0 y 40000 gramos"
2. **Usa el contexto**: Incluye la unidad en el mensaje cuando sea relevante
3. **Mantén consistencia**: Usa el mismo tono y formato en todos los mensajes
4. **Proporciona ayuda**: Incluye sugerencias cuando sea apropiado
5. **Localización**: Considera usar un servicio de traducción para mensajes en múltiples idiomas 