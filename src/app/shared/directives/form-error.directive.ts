import { Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[sviFormError]',
  standalone: true
})
export class FormErrorDirective implements OnChanges {
  @Input() errorMessage: string = '';
  @Input() show: boolean = false;

  private errorContainer: HTMLElement | null = null;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['show'] || changes['errorMessage']) && this.show && this.errorMessage) {
      this.showError();
    } else {
      this.hideError();
    }
  }
  private showError(): void {
    if (!this.errorContainer) {
      this.errorContainer = this.renderer.createElement('div');
      this.renderer.addClass(this.errorContainer, 'flex');
      this.renderer.addClass(this.errorContainer, 'validation-error-msg');
      this.renderer.addClass(this.errorContainer, 'items-center');
      this.renderer.addClass(this.errorContainer, 'mt-1');

      const icon = this.renderer.createElement('i');
      this.renderer.addClass(icon, 'fa-solid');
      this.renderer.addClass(icon, 'fa-duotone');
      this.renderer.addClass(icon, 'fa-triangle-exclamation');
      this.renderer.addClass(icon, 'mr-2');

      const message = this.renderer.createElement('small');
      this.renderer.addClass(message, 'text-danger');
      this.renderer.addClass(message, 'flex-1');
      this.renderer.addClass(message, 'text-left');

      this.renderer.appendChild(message, this.renderer.createText(this.errorMessage));
      this.renderer.appendChild(this.errorContainer, icon);
      this.renderer.appendChild(this.errorContainer, message);
      this.renderer.appendChild(this.el.nativeElement, this.errorContainer);
    } else {
      const message = this.errorContainer.querySelector('small');
      if (message) {
        message.textContent = this.errorMessage;
      }
    }
  }

  private hideError(): void {
    if (this.errorContainer) {
      this.renderer.removeChild(this.el.nativeElement, this.errorContainer);
      this.errorContainer = null;
    }
  }
}
