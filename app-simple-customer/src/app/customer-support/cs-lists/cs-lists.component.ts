import { Component, OnInit } from '@angular/core';
import { Logger } from '@mastercard/ng-commons';
import { CsTransactionsFormService } from '../form/cs-transactions-form.service';
import { CSListService } from './cs-lists.service';
import * as CONFIG from './../../constants';
import { UdtList, ListItemResponse } from './data/list-request-body';
import { Router } from '@angular/router';
import * as momentNS from 'moment';
import { mergeMap } from 'rxjs/operators';
import { forkJoin } from 'rxjs/observable/forkJoin';

@Component({
  selector: 'cs-lists',
  templateUrl: './cs-lists.component.html',
  styleUrls: ['./cs-lists.component.scss']
})
export class CsListsComponent implements OnInit {

  data: UdtList[] = [];
  pan: string;

  constructor(
    private logger: Logger,
    private transactionsFormService: CsTransactionsFormService,
    private listService: CSListService,
    private router: Router
  ) { }

  ngOnInit() {
    // TODO: use this.transactionsFormService.auditInformation to fill the form
    // this.transactionsFormService.auditInformation.ica is forms @input ica
    // this.transactionsFormService.auditInformation.custName is forms @input institutionName
    this.logger.debug('CsListsComponent ngOnInit()', this.transactionsFormService.auditInformation);
    if (this.transactionsFormService.auditInformation && this.transactionsFormService.auditInformation.custId) {
      this.onLoad();
    } else {
      this.router.navigateByUrl(`/transactions`).then(
        ok => {
          if (ok) {
          setTimeout( () => this.transactionsFormService.setTransactionsTab(), 0);
        }
    });
    }
  }

  onLoad() {
    if (!this.transactionsFormService.auditInformation || !this.transactionsFormService.auditInformation.pan) {
      this.logger.debug('Using testing PAN');
      this.pan = CONFIG.TEST_HARDCODE_PAN;
    } else {
      this.pan = this.transactionsFormService.auditInformation!.pan!;
    }
    this.getLists();
  }

  getLists(_: number[] = []) {
    const lists$ = this.listService.getLists()
      .pipe(
        mergeMap(
          lists => {
            const udts = lists.udts;
            const getPanFromList$ = udts.map(udt => this.listService.getPanFromList(udt.id, this.pan));
            return forkJoin(getPanFromList$, (...results: any[]) => {
              udts.forEach((udt, i) => this.processGetPanResponse(results[i], udt));
              return udts;
            });
          }
        )
      );

    lists$
      .subscribe( lists => {
        this.data = lists;
      }
    );
  }

  processGetPanResponse(response: ListItemResponse, list: UdtList): void {
    if (
      !response.items[0] ||
      !response.items[0].columns[0] ||
      !response.items[0].columns[0].value
    ) {
      list.isPanInList = CONFIG.PAN_LIST_STATUS.NOT_IN_LIST; // false;
    } else {
      this.setPanInListStatusText(response, list);
    }
  }

  setPanInListStatusText (response: ListItemResponse, list: UdtList): void {
    this.logger.debug('setPanInListStatusText ', response, list);
    const today = momentNS();
    const startDate = response.items[0].columns[1].value;
    list.startDate = startDate;
    const endDate = response.items[0].columns[2].value;
    list.endDate = endDate;
    if (today.isBefore(startDate)) {
      list.isPanInList = CONFIG.PAN_LIST_STATUS.FUTURE;
    } else if (today.isAfter(endDate)) {
      list.isPanInList = CONFIG.PAN_LIST_STATUS.EXPIRED;
    } else {
      list.isPanInList = CONFIG.PAN_LIST_STATUS.ACTIVE; // response.items[0].columns[0].value === this.pan;
    }
  }

  onRefreshLists(lists: UdtList[]) {
    if (!lists || lists.length === 0) {
      this.logger.debug('Retrieve all lists');
      this.listService.resetListHistory();
      this.onLoad();
    } else {
      this.logger.debug('Retrive pan in lists for some lists:' + JSON.stringify(lists));
      this.getLists(lists.map(list => list.id));
    }
  }
}
