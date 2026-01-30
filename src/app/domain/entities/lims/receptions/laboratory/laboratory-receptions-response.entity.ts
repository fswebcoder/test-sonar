import { IGeneralResponse } from "@SV-Development/utilities";

export interface ILaboratoryReceptionApiResponseEntity extends IGeneralResponse<ILaboratoryReceptionResponseEntity> {

}

export interface ILaboratoryReceptionResponseEntity {
    message: string;
    sampleId: string;
    newStatus: string;
}
