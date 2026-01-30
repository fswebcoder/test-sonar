import { ECurrentShiftActions, EShiftConfigActions } from "@/presentation/modules/plant/modules/actions.enum";

export interface IShiftActions {
        AGREGAR_PERSONAL: ECurrentShiftActions.AGREGAR_PERSONAL_TURNO | EShiftConfigActions.AGREGAR_PERSONAL_CONFIGURACION_TURNO,
        ELIMINAR_PERSONAL: ECurrentShiftActions.ELIMINAR_PERSONAL_TURNO | EShiftConfigActions.ELIMINAR_PERSONAL_CONFIGURACION_TURNO,
}
