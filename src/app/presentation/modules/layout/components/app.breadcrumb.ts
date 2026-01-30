import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationEnd, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

interface Breadcrumb {
  label: string;
  url?: string;
}

@Component({
  selector: '[app-breadcrumb]',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, RippleModule, ],
  template: `
    <nav class="layout-breadcrumb p-2">
      <ol>
        <i class="fa-duotone fa-regular fa-house"></i>
        @for (item of breadcrumbs$ | async; track item.url) {
          <li><i class="pi pi-angle-right"></i></li>
          <li [routerLink]="item.url" class="cursor-pointer">
            <span>{{ item.label }}</span>
          </li>
        }
      </ol>
    </nav>
    <div class="layout-breadcrumb-buttons"></div>
  `,
  host: {
    class: 'layout-breadcrumb-container'
  }
})
export class AppBreadcrumb {
  private readonly _breadcrumbs$ = new BehaviorSubject<Breadcrumb[]>([]);

  readonly breadcrumbs$ = this._breadcrumbs$.asObservable();

  constructor(private router: Router) {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(event => {
      const root = this.router.routerState.snapshot.root;
      const breadcrumbs: Breadcrumb[] = [];
      this.addBreadcrumb(root, [], breadcrumbs);

      this._breadcrumbs$.next(breadcrumbs);
    });
  }

  private addBreadcrumb(route: ActivatedRouteSnapshot, parentUrl: string[], breadcrumbs: Breadcrumb[]) {
    const routeUrl = parentUrl.concat(route.url.map(url => url.path));
    const breadcrumb = route.data['breadcrumb'];
    const parentBreadcrumb = route.parent && route.parent.data ? route.parent.data['breadcrumb'] : null;

    if (breadcrumb && breadcrumb !== parentBreadcrumb) {
      breadcrumbs.push({
        label: route.data['breadcrumb'],
        url: '/' + routeUrl.join('/')
      });
    }

    if (route.firstChild) {
      this.addBreadcrumb(route.firstChild, routeUrl, breadcrumbs);
    }
  }
}
