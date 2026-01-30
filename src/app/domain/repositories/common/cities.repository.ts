import { ICitiesResponseEntity } from '@/domain/entities/common/cities-response.entity';
import { IGetAll } from '@/shared/interfaces/get-all.interface';
import { IGeneralResponse } from '@SV-Development/utilities';
import { Observable } from 'rxjs';

export abstract class CitiesRepository implements IGetAll<ICitiesResponseEntity> {
    abstract getAll(): Observable<IGeneralResponse<ICitiesResponseEntity[]>>;
}