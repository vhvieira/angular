import { Component, OnInit } from '@angular/core';
import { Logger } from '@mastercard/ng-commons';
import { CsTransactionsFormService } from '../form/cs-transactions-form.service';
import { CSListService } from './cs-lists.service';
import * as CONFIG from './../../constants';
import { UdtList, UdtListResponse, ListItemResponse } from './data/list-request-body';
import { Router } from '@angular/router';
import { find } from 'underscore';
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
      this.router.navigateByUrl(`/transactions`);
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

  getLists(refreshIds: string[] = []) {
    this.listService.getLists().subscribe( lists =>
      this.processListResponse(lists, refreshIds)
    );
  }

  processListResponse (lists: UdtListResponse, refreshIds: string[] = []): void {
      if (lists.udts && lists.udts.length > 0) {
        const lookupLists: UdtList[] = [];
        const oldData: UdtList[] = this.data || [];

        // loop thru new lists
        lists.udts.forEach(udt => {
          const listId = udt.UserDefinedTableResponse.id;
          const oldDataMatch: UdtList | undefined = find(oldData, function(item) {
            return item.UserDefinedTableResponse.id === listId;
          });

          if (refreshIds.indexOf(listId) > -1 || !oldDataMatch || (oldDataMatch.isPanInList === undefined)) {
            lookupLists.push(udt);
          } else {
            udt.isPanInList = oldDataMatch.isPanInList;
          }
        });

        if (lookupLists.length > 0) {
          this.getPanFromLists(lookupLists);
        }

        this.data = lists.udts;
      } else {
        this.data = [];
      }
  }

  getPanFromLists(lists: UdtList[] = []) {
    lists.forEach(rawList => {
      const list = rawList.UserDefinedTableResponse;
      rawList.id = list.id;
      this.logger.debug('call to this.listService.getPanFromList. listId='
                         + list.id + ' pan= ' + this.pan);
      this.listService.getPanFromList(list.id, this.pan).subscribe(
        response =>
          this.processGetPanResponse(response, rawList)
        );
    });
  }

  processGetPanResponse(response: ListItemResponse, rawList: UdtList): void {
    // chek if response PAN is null
    if (!response.items[0] || response.items[0] === undefined || response.items[0] === null
      || !response.items[0].columns[0] || response.items[0].columns[0] === undefined
      || response.items[0].columns[0] === null ||  !response.items[0].columns[0].value
    ) {
      // set false (not in list)
      this.logger.debug('isPanInList = false');
      rawList.isPanInList = false;
    } else {
      // validate pan is the same
      this.logger.debug('pan returned is = ' + response.items[0].columns[0].value);
      rawList.isPanInList = response.items[0].columns[0].value === this.pan;
      this.logger.debug('isPanInList = ' + rawList.isPanInList);
      this.logger.debug(this.data);
    }
  }

  onRefreshLists(lists: UdtList[]) {
    if (!lists || lists.length === 0) {
      this.logger.debug('Retrieve all lists');
      this.onLoad();
    } else {
      this.logger.debug('Retrive pan in lists for some lists:' + JSON.stringify(lists));
      this.getLists(lists.map(list => list.UserDefinedTableResponse.id));
    }
  }
}
