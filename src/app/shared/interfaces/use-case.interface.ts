import { Observable } from 'rxjs';

export interface UseCase<O, I = unknown> {
  execute(params: I): Observable<O>;
}
