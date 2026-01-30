import { IPrintParams } from '@/domain/entities/common/printers/print-params.entity';
import { IPrintBulkParams } from '@/domain/entities/common/printers/print-bulk-params.entity';
import { IPrintResponse } from '@/domain/entities/common/printers/print-response.entity';
import { IPrinter } from '@/domain/entities/common/printers/printers.entity';
import { IGetAll } from '@/shared/interfaces/get-all.interface';
import { Injectable } from '@angular/core';
import { IGeneralResponse } from '@SV-Development/utilities';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export abstract class PrintersRepository implements IGetAll<IPrinter> {
  abstract getAll(): Observable<IGeneralResponse<IPrinter[]>>;
  abstract print(params: IPrintParams): Observable<IGeneralResponse<IPrintResponse>>;
  abstract printBulk(params: IPrintBulkParams): Observable<IGeneralResponse<void>>;
}
