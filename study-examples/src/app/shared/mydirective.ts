import { Directive, Renderer, ElementRef, HostListener } from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[myRed]'
})
export class RedDirective {
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
      this.renderer.setElementStyle(this.el.nativeElement, 'color', 'red');
    } else {
      this.renderer.setElementStyle(this.el.nativeElement, 'color', 'black');
    }
  }
}
