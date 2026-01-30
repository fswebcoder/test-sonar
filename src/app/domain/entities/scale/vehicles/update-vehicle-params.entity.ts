import { ICreateVehicleParamsEntity } from './create-vehicle-params.entity';
import { IVehicle } from './vehicle.entity';

export interface IUpdateVehicleParamsEntity
  extends Pick<Partial<IVehicle>, 'plate'>,
    Pick<ICreateVehicleParamsEntity, 'vehicleTypeId'>,
    Pick<IVehicle, 'id'> {
  documents?: {
    soat?: File | null;
    technomechanical?: File | null;
    registration?: File | null;
  };
}
