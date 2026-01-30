import { Component, DestroyRef, inject } from '@angular/core';
import { RetallaDumpComponent } from '../retalla-dump/retalla-dump.component';
import { IRetallaParamsEntity } from '@/domain/entities/lims/analysis/retalla/retalla-params.entity';
import { RetallaUseCase } from '@/domain/use-cases/lims/analysis/retalla.usecase';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastCustomService } from '@SV-Development/utilities';
import { LoadingService } from '@/shared/services/loading.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'svi-retalla-smart',
  imports: [RetallaDumpComponent],
  templateUrl: './retalla-smart.component.html',
  styleUrl: './retalla-smart.component.scss'
})
export class RetallaSmartComponent {
  private readonly toastService = inject(ToastCustomService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly retallaUseCase = inject(RetallaUseCase);
  private readonly loadingService = inject(LoadingService);

  createRetalla(retallaParams: IRetallaParamsEntity) {
    this.loadingService.setButtonLoading('create-retalla-btn', true);
    this.retallaUseCase
      .create(retallaParams)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loadingService.setButtonLoading('create-retalla-btn', false))
      )
      .subscribe({
        next: () => {
          this.toastService.success('Retalla creada correctamente');
        },
        error: (error: HttpErrorResponse) => {
          this.handleRetallaError(error);
        }
      });
  }

  handleRetallaError(error: HttpErrorResponse) {
    this.toastService.error(error.error.message || 'Error al crear la retalla');
  }
}
