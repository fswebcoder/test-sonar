/**
 * Construye un FormData a partir de un objeto.
 * @param args - El objeto a convertir en FormData.
 * @returns Un FormData con los datos del objeto.
 */
export const buildHttpFormData = (args: Record<string, any>): FormData => {
    const formData = new FormData();
    Object.entries(args).forEach(([key, value]: [string, any]) => {
        formData.append(key, value);
    });
    return formData;
}