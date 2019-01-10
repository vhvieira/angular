import { Component, OnInit } from '@angular/core';
import { Logger } from '@mastercard/ng-commons';

@Component({
  selector: 'cs-lists',
  templateUrl: './cs-lists.component.html',
  styleUrls: ['./cs-lists.component.scss']
})
export class CsListsComponent implements OnInit {

  constructor(private logger: Logger) { }

  ngOnInit() {
    this.logger.debug('CsListsComponent ngOnInit()');
  }

}
