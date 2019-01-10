import { Directive, Renderer, ElementRef } from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[myHidden]'
})
export class HiddenDirective {
  constructor(
    private renderer: Renderer,
    private el: ElementRef
  ) {
    this.renderer.setElementStyle(this.el.nativeElement, 'display', 'none');
  }
}
