import { Component, OnDestroy, OnInit } from '@angular/core';
import { Logger } from '@mastercard/ng-commons';

@Component({
  selector: 'cs-customer-support',
 // template: `<cs-list-history></cs-list-history>`,
  template: `<router-outlet></router-outlet>`,
})
export class CustomerSupportComponent implements OnInit, OnDestroy {
  constructor(private logger: Logger) {
    this.logger.debug('CustomerSupportComponent component built');
  }

  ngOnInit() {
    this.logger.debug('CustomerSupportComponent component initialized');
  }

  ngOnDestroy() {
    this.logger.debug('CustomerSupportComponent component destroyed');
  }

}
