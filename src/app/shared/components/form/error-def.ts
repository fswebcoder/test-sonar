import { maxValue, minValue } from '@/shared/helpers/min-max-values.helper';

export const ERROR_DEFS: Record<string, Record<string, string>> = {
  email: {
    required: 'El campo es requerido',
    email: 'Formato inválido'
  },
  password: {
    required: 'El campo es requerido',
    minlength: 'Mínimo 8 caracteres'
  },

  company: {
    required: 'El campo es requerido'
  },

  code: {
    required: 'El campo es requerido',
    minlength: 'Mínimo 10 caracteres',
    maxlength: 'Máximo 10 caracteres',
    pattern: 'El campo debe ser un número',
    invalid: 'El campo es inválido'
  },
  totalPrint: {
    required: 'Este campo es requerido',
    max: maxValue(20),
    min: minValue(2)
  },
  weight: {
    required: 'El campo es requerido',
    min: minValue(0.1),
    max: maxValue(40000)
  },
  roleName: {
    required: 'El campo es requerido',
    pattern: 'El nombre del rol debe ser en mayúsculas y sin espacios'
  },
  rows: {
    required: 'El campo es requerido',
    max: maxValue(5)
  },
  columns: {
    required: 'El campo es requerido',
    max: maxValue(5)
  },
  analysisQuantity: {
    required: 'El campo es requerido',
    min: minValue(1),
    max: maxValue(5)
  },

  bigBagWeight: {
    required: 'El campo es requerido',
    min: minValue(900),
    max: maxValue(1001)
  }

};
