import { IVehicle } from './vehicle.entity';

export interface ICreateVehicleParamsEntity extends Pick<IVehicle, 'plate'> {
    soat?: File | null;
    technomechanical?: File | null;
    registration?: File | null;
    vehicleTypeId: string;
}
