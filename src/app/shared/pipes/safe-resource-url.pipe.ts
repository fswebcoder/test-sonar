import { Inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ENVIRONMENT } from 'src/app.config';
import type { Environment } from '@/shared/types/environment';

@Pipe({
  name: 'safeResourceUrl',
  standalone: true
})
export class SafeResourceUrlPipe implements PipeTransform {
  constructor(
    private readonly sanitizer: DomSanitizer,
    @Inject(ENVIRONMENT) private readonly env: Environment
  ) {}

  transform(value: string | null | undefined): SafeResourceUrl | null {
    if (!value) return null;

    const raw = value.trim();
    if (!raw) return null;

    let resolved = raw;

    if (!/^https?:\/\//i.test(resolved)) {
      try {
        resolved = new URL(resolved, this.env.services.security).toString();
      } catch {
        return null;
      }
    }

    // Only allow http(s) URLs.
    if (!/^https?:\/\//i.test(resolved)) return null;

    return this.sanitizer.bypassSecurityTrustResourceUrl(resolved);
  }
}
