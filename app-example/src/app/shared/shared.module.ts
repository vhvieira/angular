import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatToolbarModule, MatInputModule, MatIconModule } from '@angular/material';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
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
import { MastercardCommons } from '@mastercard/ng-commons';
import { MccCommons } from '@mc-connect/ng-commons';
import { FraudCenterCommons } from '@mc-fraud-center/commons';
import { InputMaskModule } from 'primeng/components/inputmask/inputmask';

const bsModules = [
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
];

/**
 * This module provides common components, directives etc. shared by the other modules.
 */
@NgModule({
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    MastercardCommons,
    MatButtonModule,
    MatToolbarModule,
    MatInputModule,
    MatIconModule,
    FraudCenterCommons,
    TranslateModule,
    ...bsModules,
    MccCommons,
    InputMaskModule,
  ],
  providers: [
    // Do not provide services here. Services are usually singletons that are provided once for
    // the entire application or in a particular feature module.
    // https://angular.io/styleguide#!#04-10
  ]
})
export class SharedModule { }
