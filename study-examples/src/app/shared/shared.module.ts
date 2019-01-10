import { NgModule } from '@angular/core';
import { RedDirective } from './mydirective';
import { HiddenDirective } from './hidden.directive';

@NgModule({
  declarations: [
    RedDirective, HiddenDirective
  ],
  exports: [
    RedDirective, HiddenDirective
  ],
  providers: []
})
export class SharedModule { }
