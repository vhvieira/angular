import { Component, Input } from '@angular/core';
import { moment } from 'ngx-bootstrap/chronos/test/chain';
import { UdtHistory } from './list-history.model';
import * as CONFIG from '../../../../constants';
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
    s[2] = this.formatDate(s[2]);
    return s.join(' , ');
  }

  removeBrackets(str: string): string {
    return str.replace(/[\[\]]/g, '');
  }

  formatDate(str: string): string {
    const date = moment(str);

    if (date.isValid()) {
      return date.format(CONFIG.DEFAULT_DATE_FORMAT);
    } else {
      return str;
    }
  }

  trackFn(index: any) {
    return index;
  }
}
