import { ILeachwellResponseEntity } from '@/domain/entities/lims/analysis/leachwell/leachwell-response-entity';
import { ConfirmDialogComponent } from '@/shared/components/confirm-dialog/confirm-dialog.component';
import { AsyncPipe, CommonModule, NgClass } from '@angular/common';
import { Component, computed, inject, Injector, input, output, ViewChild } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { differenceInSeconds, Duration, intervalToDuration, isAfter, isBefore } from 'date-fns';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { distinctUntilChanged, interval, map, shareReplay, startWith } from 'rxjs';
import { LeachwellCardContentComponent } from '../leachwell-card-content/leachwell-card-content.component';
import { CardButtonComponent } from '@/shared/components/card-button/card-button.component';
import { EActionSeverity } from '@/shared/enums/action-severity.enum';

@Component({
  selector: 'svi-leachwell-card',
  imports: [
    CommonModule,
    TagModule,
    ButtonModule,
    TooltipModule,
    AsyncPipe,
    NgClass,
    ConfirmDialogComponent,
    CardButtonComponent,
    LeachwellCardContentComponent
  ],
  templateUrl: './leachwell-card.component.html',
  styleUrl: './leachwell-card.component.scss'
})
export class LeachwellCardComponent {
  @ViewChild('confirmDialog') confirmDialog!: ConfirmDialogComponent;

  readonly circumference = 2 * Math.PI * 45;

  leachwell = input.required<ILeachwellResponseEntity>();
  onCompleteAnalisis = output<ILeachwellResponseEntity>();

  readonly startDate = computed(() => new Date(this.leachwell().analysisDate));
  readonly endDate = computed(() => new Date(this.leachwell().targetFinishDate));

  leachwell$ = toObservable(this.leachwell, { injector: inject(Injector) });

  readonly timer$ = interval(1000).pipe(startWith(0));

  readonly isOverdue$ = this.timer$.pipe(
    map(() => isBefore(this.endDate(), new Date())),
    distinctUntilChanged(),
    shareReplay({ refCount: true, bufferSize: 1 })
  );

  readonly remainingTime$ = this.timer$.pipe(
    map(() => {
      const now = new Date();
      const end = this.endDate();

      const overdue = isBefore(end, now);

      const duration = intervalToDuration({
        start: overdue ? end : now,
        end: overdue ? now : end
      });

      const formatted = this.formatDuration(duration);
      return overdue ? `+ ${formatted}` : formatted;
    }),
    shareReplay({ refCount: true, bufferSize: 1 })
  );

  readonly progressPercentage$ = this.timer$.pipe(
    map(() => {
      const now = new Date();
      const start = this.startDate();
      const end = this.endDate();

      if (isBefore(now, start)) {
        return 0;
      }

      if (isAfter(now, end)) {
        return 100;
      }
      const totalDuration = differenceInSeconds(end, start);
      const elapsed = differenceInSeconds(now, start);

      return Math.floor((elapsed / totalDuration) * 100);
    }),
    shareReplay({ refCount: true, bufferSize: 1 })
  );

  private formatDuration(duration: Duration): string {
    const h = (duration.hours ?? 0).toString().padStart(2, '0');
    const m = (duration.minutes ?? 0).toString().padStart(2, '0');
    const s = (duration.seconds ?? 0).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  }

  openConfirmDialog() {
    this.confirmDialog.show(
      '¿Está seguro que desea terminar el análisis?',
      () => {
        this.onCompleteAnalisis.emit(this.leachwell());
      },
      () => {}
    );
  }

  readonly EActionSeverity = EActionSeverity;
}
