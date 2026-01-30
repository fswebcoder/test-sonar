import { Injectable, Signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { StoreState } from '../../store/store.state';
import { IDoreSampleType } from '@/domain/entities/common/dore-reception-origin-response.entity';

@Injectable({
  providedIn: 'root'
})
export class GlobalListsService {
  public readonly departments: Signal<any[]>;
  public readonly cities: Signal<any[]>;
  public readonly receptionOrigins: Signal<any[]>;
  public readonly doreReceptionOrigins: Signal<any[]>;

  constructor(private store: Store<StoreState>) {
    this.departments = toSignal(
      this.store.select(state => state.common.departments),
      { initialValue: [] }
    ) as Signal<any[]>;

    this.cities = toSignal(
      this.store.select(state => state.common.cities),
      { initialValue: [] }
    ) as Signal<any[]>;
    
    this.receptionOrigins = toSignal(
      this.store.select(state => state.common.sampleTypes),
      { initialValue: [] }
    ) as Signal<any[]>;
    
    this.doreReceptionOrigins = toSignal(
      this.store.select(state => state.common.doreSampleTypes),
      { initialValue: [] }
    ) as Signal<any[]>;
  }

  getDepartments(): Signal<any[]> {
    return this.departments;
  }

  getCities(): Signal<any[]> {
    return this.cities;
  }

  getReceptionOrigins(): Signal<any[]> {
    return this.receptionOrigins;
  }

  getDoreReceptionOrigins(): Signal<IDoreSampleType[]> {
    return this.doreReceptionOrigins;
  }
}
