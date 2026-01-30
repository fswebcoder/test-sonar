import { NgTemplateOutlet } from '@angular/common';
import { Component, inject, input, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { SplitterModule } from 'primeng/splitter';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'svi-split-page',
  imports: [SplitterModule, RouterOutlet, NgTemplateOutlet, ButtonModule],
  templateUrl: './split-page.component.html',
  styleUrl: './split-page.component.scss'
})
export class SplitPageComponent {
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  isRouterActive = signal(false);
  label = input<string>();

  isMobile(): boolean {
    return window.innerWidth <= 768;
  }

}
