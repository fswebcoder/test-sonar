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
    }
};
