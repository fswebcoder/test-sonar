import { BaseHttpService } from '@/core/providers/base-http.service';
import { IPrintParams } from '@/domain/entities/common/printers/print-params.entity';
import { IPrintBulkParams } from '@/domain/entities/common/printers/print-bulk-params.entity';
import { IPrintResponse } from '@/domain/entities/common/printers/print-response.entity';
import { IPrinter } from '@/domain/entities/common/printers/printers.entity';
import { PrintersRepository } from '@/domain/repositories/common/printers.repository';
import { inject, Injectable } from '@angular/core';
import { IGeneralResponse } from '@SV-Development/utilities';
import { Observable } from 'rxjs';
import { ENVIRONMENT } from 'src/app.config';

@Injectable({
  providedIn: 'root'
})
export class PrintersDatasourceService extends BaseHttpService<PrintersRepository> implements PrintersRepository {
  private env = inject(ENVIRONMENT);
  protected baseUrl = `${this.env.services.security}printer/`;

  getAll(): Observable<IGeneralResponse<IPrinter[]>> {
    return this.get<IGeneralResponse<IPrinter[]>>(``);
  }

  print(params: IPrintParams): Observable<IGeneralResponse<IPrintResponse>> {
    return this.post<IGeneralResponse<IPrintResponse>>(params, 'print-qr');
  }

  printBulk(params: IPrintBulkParams): Observable<IGeneralResponse<void>> {
    return this.post<IGeneralResponse<void>>(params, 'print-qr-bulk');
  }
}
