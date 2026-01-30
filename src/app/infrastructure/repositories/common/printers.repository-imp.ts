import { PrintersDatasourceService } from '@/infrastructure/datasources/common/printers.datasource.service';
import { PrintersRepository } from '@/domain/repositories/common/printers.repository';
import { IPrinter } from '@/domain/entities/common/printers/printers.entity';
import { IGeneralResponse } from '@SV-Development/utilities';
import { Observable } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { IPrintParams } from '@/domain/entities/common/printers/print-params.entity';
import { IPrintBulkParams } from '@/domain/entities/common/printers/print-bulk-params.entity';
import { IPrintResponse } from '@/domain/entities/common/printers/print-response.entity';

@Injectable({
  providedIn: 'root'
})
export class PrintersRepositoryImp implements PrintersRepository {
  printersDatasourceService = inject(PrintersDatasourceService);

  getAll(): Observable<IGeneralResponse<IPrinter[]>> {
    return this.printersDatasourceService.getAll();
  }

  print(params: IPrintParams): Observable<IGeneralResponse<IPrintResponse>> {
    return this.printersDatasourceService.print(params);
  }

  printBulk(params: IPrintBulkParams): Observable<IGeneralResponse<void>> {
    return this.printersDatasourceService.printBulk(params);
  }
}
