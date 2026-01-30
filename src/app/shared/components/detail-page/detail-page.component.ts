import { CommonModule } from '@angular/common';
import { Component, HostListener, inject, input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'svi-detail-page',
  standalone: true,
  imports: [ButtonModule, RippleModule, CommonModule, TooltipModule, ButtonModule],
  templateUrl: './detail-page.component.html',
  styleUrl: './detail-page.component.scss'
})
export class DetailPageComponent {
  label = input<string>();
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  allowBack = input<boolean>(true);

  @HostListener('document:keydown.escape', ['$event'])
  handleEscapeKey(event: KeyboardEvent) {
    this.goBack();
  }

  goBack() {
    this.router.navigate(['../'], { relativeTo: this.activatedRoute });
  }
}
