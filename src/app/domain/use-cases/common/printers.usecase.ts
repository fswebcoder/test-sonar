import { IPrintParams } from '@/domain/entities/common/printers/print-params.entity';
import { IPrintBulkParams } from '@/domain/entities/common/printers/print-bulk-params.entity';
import { IPrinter } from '@/domain/entities/common/printers/printers.entity';
import { IPrintResponse } from '@/domain/entities/common/printers/print-response.entity';
import { PrintersRepository } from '@/domain/repositories/common/printers.repository';
import { inject, Injectable } from '@angular/core';
import { IGeneralResponse } from '@SV-Development/utilities';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PrintersUseCase implements PrintersRepository {
  private readonly PrintersRepository = inject(PrintersRepository);

  getAll(): Observable<IGeneralResponse<IPrinter[]>> {
    return this.PrintersRepository.getAll();
  }

  print(params: IPrintParams): Observable<IGeneralResponse<IPrintResponse>> {
    return this.PrintersRepository.print(params);
  }

  printBulk(params: IPrintBulkParams): Observable<IGeneralResponse<void>> {
    return this.PrintersRepository.printBulk(params);
  }
}
