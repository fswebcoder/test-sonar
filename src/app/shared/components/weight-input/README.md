# SVI Weight Input Component

Componente especializado para la entrada de valores de peso con formato automático y unidades configurables.

## Características

- **Formato automático**: Aplica formato de separadores de miles y decimales
- **Unidades configurables**: Soporta Gr, Kg y Lb
- **Placeholder dinámico**: Se adapta automáticamente a la unidad seleccionada
- **Validación integrada**: Compatible con Reactive Forms
- **Responsive**: Se adapta al ancho del contenedor padre

## Uso Básico

```html
<svi-weight-input
  label="Peso retenido"
  formControlName="retainedWeight"
  unit="Gr"
>
</svi-weight-input>
```

## Propiedades de Entrada

| Propiedad | Tipo | Por defecto | Descripción |
|-----------|------|-------------|-------------|
| `label` | `string` | `'Peso'` | Etiqueta del campo |
| `unit` | `'Gr' \| 'Kg' \| 'Lb'` | `'Gr'` | Unidad de peso |
| `placeholder` | `string` | `'0,0 {unit}'` | Placeholder personalizado |
| `icon` | `string` | `undefined` | Clase CSS del icono |
| `allowNegativeNumbers` | `boolean` | `false` | Permite números negativos |
| `textRight` | `boolean` | `false` | Alinea el texto a la derecha |

## Ejemplos de Uso

### Peso en Gramos (por defecto)
```html
<svi-weight-input
  label="Peso retenido"
  formControlName="retainedWeight"
>
</svi-weight-input>
```

### Peso en Kilogramos
```html
<svi-weight-input
  label="Peso total"
  formControlName="totalWeight"
  unit="Kg"
>
</svi-weight-input>
```

### Peso en Libras con Icono
```html
<svi-weight-input
  label="Peso en libras"
  formControlName="weightInLbs"
  unit="Lb"
  icon="pi pi-weight"
>
</svi-weight-input>
```

### Con Placeholder Personalizado
```html
<svi-weight-input
  label="Peso de muestra"
  formControlName="sampleWeight"
  placeholder="Ingrese el peso de la muestra"
>
</svi-weight-input>
```

## Configuración por Defecto

- **Máscara**: `'separator.1'` (permite un decimal)
- **Separador de miles**: `.`
- **Marcador decimal**: `,`
- **Sufijo**: Se agrega automáticamente la unidad con un espacio

## Integración con Reactive Forms

El componente es completamente compatible con Angular Reactive Forms:

```typescript
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export class MyComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      retainedWeight: ['', [Validators.required, Validators.min(0)]]
    });
  }
}
```

## Estilos

El componente utiliza PrimeNG y PrimeFlex para los estilos. Se puede personalizar mediante CSS:

```scss
svi-weight-input {
  // Personalizaciones específicas
  .p-float-label label {
    font-weight: 600;
  }
}
``` 