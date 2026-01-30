import { IDriverEntity } from "./driver.entity";

export interface IUpdateDriverParamsEntity
	extends Partial<Pick<IDriverEntity, "documentNumber" | "name">>,
		Pick<IDriverEntity, "id"> {
	documents?: {
		cc?: File | null;
		arl?: File | null;
	};
}