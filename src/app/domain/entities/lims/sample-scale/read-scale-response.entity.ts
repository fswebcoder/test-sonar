import { IGeneralResponse } from '@SV-Development/utilities';
import { ITareScaleEntity } from './tare-scale.entity';
import { IWeightScaleEntity } from './weight-scale.entity';

export type IReadScaleResponseEntity<isTareWeight extends boolean = false> = isTareWeight extends true
	? IGeneralResponse<ITareScaleEntity>
	: IGeneralResponse<IWeightScaleEntity>;