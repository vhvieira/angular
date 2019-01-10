import { Directive, Renderer, ElementRef, HostListener } from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[myUnderline]'
})
export class UnderlineDirective {
  constructor(
    private renderer: Renderer,
    private el: ElementRef
  ) {}

  @HostListener('mouseenter')
  onMouseEnter() {
    this.hover(true);
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.hover(false);
  }

  hover(shoudUnderline: boolean) {
    if (shoudUnderline) {
      this.renderer.setElementStyle(this.el.nativeElement, 'text-decoration', 'underline');
    } else {
      this.renderer.setElementStyle(this.el.nativeElement, 'text-decoration', 'none');
    }
  }
}
