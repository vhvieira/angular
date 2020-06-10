import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector, DoBootstrap } from '@angular/core';

import { AppComponent } from './app.component';
import { UIButtonComponent } from './uibutton/uibutton.component';
import { createCustomElement } from '@angular/elements';
import { ElementZoneStrategyFactory } from 'elements-zone-strategy';

@NgModule({
  declarations: [
    UIButtonComponent,
  ],
  imports: [
    BrowserModule,
  ],
  entryComponents: [UIButtonComponent],
})
export class AppModule implements DoBootstrap {

  constructor(private injector: Injector) {
    const strategyFactory = new ElementZoneStrategyFactory(UIButtonComponent, injector);
    const webComponent = createCustomElement(UIButtonComponent, {injector, strategyFactory});
    customElements.define('log-activity', webComponent);
  }

  ngDoBootstrap() {}
 }
