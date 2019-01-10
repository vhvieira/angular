import { Component, OnInit } from '@angular/core';
import { Logger } from '@mastercard/ng-commons';

@Component({
  selector: 'cs-transactions',
  templateUrl: './cs-transactions.component.html',
  styleUrls: ['./cs-transactions.component.scss']
})
export class CsTransactionsComponent implements OnInit {

  constructor(private logger: Logger) { }

  ngOnInit() {
    this.logger.debug('CsTransactionsComponent ngOnInit()');
  }

}
