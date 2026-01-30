# Ejemplo de Migración: svi-float-input → svi-weight-input

## Antes (svi-float-input)

```html
<svi-float-input
  label="Peso retenido (gr)"
  formControlName="retainedWeight"
  mask="separator.1"
  thousandSeparator="."
  decimalMarker=","
  suffix=" Gr"
  placeholder="20,1 Gr"
>
</svi-float-input>
```

## Después (svi-weight-input)

```html
<svi-weight-input
  label="Peso retenido"
  formControlName="retainedWeight"
  unit="Gr"
  placeholder="20,1 Gr"
>
</svi-weight-input>
```

## Beneficios de la Migración

### 1. **Menos Configuración**
- No necesitas especificar `mask`, `thousandSeparator`, `decimalMarker` ni `suffix`
- La configuración está optimizada para pesos por defecto

### 2. **Más Semántico**
- El nombre del componente indica claramente su propósito
- La propiedad `unit` es más explícita que el `suffix`

### 3. **Más Flexible**
- Fácil cambio de unidad: solo cambia `unit="Gr"` por `unit="Kg"`
- Placeholder automático basado en la unidad

### 4. **Mejor Mantenibilidad**
- Configuración centralizada para todos los inputs de peso
- Consistencia en toda la aplicación

## Otros Ejemplos de Migración

### Peso en Kilogramos

**Antes:**
```html
<svi-float-input
  label="Peso total (kg)"
  formControlName="totalWeight"
  mask="separator.2"
  thousandSeparator="."
  decimalMarker=","
  suffix=" Kg"
  placeholder="0,00 Kg"
>
</svi-float-input>
```

**Después:**
```html
<svi-weight-input
  label="Peso total"
  formControlName="totalWeight"
  unit="Kg"
  mask="separator.2"
  placeholder="0,00 Kg"
>
</svi-weight-input>
```

### Peso en Libras

**Antes:**
```html
<svi-float-input
  label="Peso (lb)"
  formControlName="weightInLbs"
  mask="separator.1"
  thousandSeparator="."
  decimalMarker=","
  suffix=" Lb"
>
</svi-float-input>
```

**Después:**
```html
<svi-weight-input
  label="Peso"
  formControlName="weightInLbs"
  unit="Lb"
>
</svi-weight-input>
```

## Configuraciones Avanzadas

### Con Icono
```html
<svi-weight-input
  label="Peso de muestra"
  formControlName="sampleWeight"
  unit="Gr"
  icon="pi pi-weight"
>
</svi-weight-input>
```

### Con Validación Personalizada
```html
<svi-weight-input
  label="Peso mínimo"
  formControlName="minWeight"
  unit="Kg"
  [errorMessages]="{
    'required': 'El peso es obligatorio',
    'min': 'El peso debe ser mayor a 0'
  }"
>
</svi-weight-input>
```

### Con Alineación a la Derecha
```html
<svi-weight-input
  label="Peso calculado"
  formControlName="calculatedWeight"
  unit="Gr"
  [textRight]="true"
>
</svi-weight-input>
``` 