import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { LayoutService } from '../service/layout.service';

@Component({
  standalone: true,
  selector: '[app-footer]',
  imports: [ButtonModule],
  template: ` <span class="font-medium text-lg text-muted-color">
      <i class="pi pi-copyright"></i>
      <small>{{ currentYear }} |</small>
      <small>Todos los derechos reservados</small>
    </span>
    <div class="flex">
      <!-- <img src="/layout/images/logo/footer-ultima{{layoutService.isDarkTheme() ? '-dark.svg' : '.svg'}}"/> -->
      <img src="Sun Valley Isotipo color.png" width="40" />
    </div>`,
  host: {
    class: 'layout-footer'
  }
})
export class AppFooter {
  layoutService = inject(LayoutService);
  currentYear: number = new Date().getFullYear();
}
