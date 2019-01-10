import { APP_BASE_HREF } from '@angular/common';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { Http, HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrModule, GlobalConfig } from 'ngx-toastr';
import { CookieModule } from 'ngx-cookie';

import {
  AccordionModule,
  AlertModule,
  ButtonsModule,
  CarouselModule,
  CollapseModule,
  ModalModule,
  BsDropdownModule,
  PaginationModule,
  ProgressbarModule,
  RatingModule,
  SortableModule,
  TabsModule,
  TimepickerModule,
  TooltipModule,
  TypeaheadModule,
  PopoverModule,
 } from 'ngx-bootstrap';

import { SharedModule } from '../shared/shared.module';
import { FraudCenterCommons } from '@mc-fraud-center/commons';
import { MastercardCommons, TranslateStaticLoader, makeConfig } from '@mastercard/ng-commons';
import { MCErrorComponent } from './error-page/error-page.component';

export function getAppBaseHref() {
  return window ? window.location.pathname : '';
}

export function customTranslateLoader(http: Http) {
  return new TranslateStaticLoader(http, 'assets/i18n', '.json', ['customer-support']);
}

const toastrConfig: Partial<GlobalConfig> = {
  positionClass: 'toast-bottom-right',
};

/**
 * This module provides services (singletons) at the app level.
 * It also exports some components needed by the root {@link AppComponent}.
 * @see https://angular.io/styleguide#!#04-11
 */
@NgModule({
  imports: [
    SharedModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    TranslateModule.forRoot(makeConfig(customTranslateLoader)),
    ToastrModule.forRoot(toastrConfig),
    CookieModule.forRoot(),
    MastercardCommons.forRoot(),
    FraudCenterCommons.forRoot(),

    // bootstrap
    AccordionModule.forRoot(),
    AlertModule.forRoot(),
    ButtonsModule.forRoot(),
    CarouselModule.forRoot(),
    CollapseModule.forRoot(),
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
    PaginationModule.forRoot(),
    ProgressbarModule.forRoot(),
    RatingModule.forRoot(),
    SortableModule.forRoot(),
    TabsModule.forRoot(),
    TimepickerModule.forRoot(),
    TooltipModule.forRoot(),
    TypeaheadModule.forRoot(),
    PopoverModule.forRoot(),
  ],
  declarations: [
    MCErrorComponent,
  ],
  providers: [
    { provide: APP_BASE_HREF, useFactory: getAppBaseHref },
  ]
})
export class CoreModule {

  constructor(@Optional() @SkipSelf() parentModule?: CoreModule) {
    if (parentModule) {
      throw new Error(`CoreModule has already been loaded. Import Core modules in the AppModule only.`);
    }
  }

}
