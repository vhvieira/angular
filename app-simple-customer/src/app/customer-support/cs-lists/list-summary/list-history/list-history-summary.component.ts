import { Component, Input } from '@angular/core';
import { moment } from 'ngx-bootstrap/chronos/test/chain';
import { UdtHistory } from './list-history.model';

@Component({
  selector: 'cs-list-history-summary',
  templateUrl: './list-history-summary.component.html',
  styleUrls: ['./list-history-summary.component.scss']
})
export class ListHistoryDetailComponent {

  @Input() data: UdtHistory[];

  formatComment(str: string) {
    str = this.removeBrackets(str);
    const s = str.split(',');
    s[1] = this.formatDate(s[1]);
    return s.join(' , ');
  }

  removeBrackets(str: string): string {
    return str.replace(/[\[\]]/g, '');
  }

  formatDate(str: string): string {
    return moment(str).format('ddd DD - MMM - YYYY hh:mmA');
  }

  trackFn(index: any) {
    return index;
  }
}
