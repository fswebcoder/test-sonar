export interface IWeightRegisterParams {
    id: string;
    weight: number;
    destinationStorageZoneId?: string;
    imageUrl?: string | null;
    imageTmpPath?: string | null;
}