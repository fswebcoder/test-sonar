import { Component, inject, Input, input } from '@angular/core';
import { ButtonComponent } from '../form/button/button.component';
import { Router } from '@angular/router';
import { ICONS } from '@/shared/enums/general.enum';

@Component({
  selector: 'svi-back-button',
  imports: [ButtonComponent],
  templateUrl: './back-button.component.html',
  styleUrl: './back-button.component.scss'
})
export class BackButtonComponent {
  @Input({ required: true }) href: string = '';

  ICONS = ICONS;

  router = inject(Router);

  goBack(): void {
    this.router.navigate([this.href]);
  }
}
