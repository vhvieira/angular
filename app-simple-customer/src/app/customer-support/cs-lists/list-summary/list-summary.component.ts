import { Component, ViewChild, OnInit, Input, Output } from '@angular/core';
import { Logger } from '@mastercard/ng-commons';
import { CSListService } from '../cs-lists.service';
import { AddPanModalComponent } from '../add-pan-modal/add-pan-modal.component';
import { RemovePanModalComponent } from '../rem-pan-modal/rem-pan-modal.component';
// import * as CONFIG from '../../../constants';
import { UdtList } from '../data/list-request-body';
import { CsTransactionsFormService } from '../../form/cs-transactions-form.service';
import { Router } from '@angular/router';
import { EventEmitter } from '@angular/core';
import { sortBy } from 'underscore';
import { UdtHistory } from './list-history/list-history.model';
@Component({
  selector: 'cs-list-summary',
  templateUrl: './list-summary.component.html',
  styleUrls: ['./list-summary.component.scss']
})
export class ListSummaryComponent implements OnInit {

  @Input() lists: UdtList[] = [];
  @Input() pan: string;

  @Output() refreshLists = new EventEmitter<UdtList[]>();

  dialogText  = '';
  recordsPerPage = 10;
  totalRecords = 100;
  selectedLists: UdtList[] = []; // = [{id: CONFIG.TEST_HARDCODE_LIST_CODE}];
  selectedListsList = [];
  sortOrder = 1;
  sortField = '';
  public visibleHistory: number | undefined;
  public history: UdtHistory[] = [];

  @ViewChild('addPanModal') addPanModal: AddPanModalComponent;
  @ViewChild('remPanModal') remPanModal: RemovePanModalComponent;

  constructor(
    private logger: Logger,
    private listService: CSListService,
    private formService: CsTransactionsFormService,
    private router: Router) {

  }

  ngOnInit() {
    this.logger.debug('List history initialized');
    this.sortOrder = 1;
    this.sortField = 'tableName';
    this.sortBy(this.sortField, this.sortOrder);
  }

  onNewInquiry (_: any) {
    this.logger.debug('onNewInquiry');
    this.formService.reset();
    this.router.navigateByUrl('/transactions').then(
      ok => {
        if (ok) {
          this.formService.setTransactionsTab();
        }
      }
    );
  }
  getListHistory(listId: string) {
    this.logger.info('Calling getListHistory for listId=' + listId);
    this.listService.getListHistory(listId, this.pan).subscribe( response => {
      this.history = response.map(item => item);
    });
  }

  onClickHistory(listId: number) {
      this.toggleVisibleHistory(listId);
      this.getListHistory(listId.toString());
  }

  trackFn(index: number) {
    return index;
  }

  openAddPanModal(): void {
    this.addPanModal.show();
  }

  openRemPanModal(): void {
    this.remPanModal.show();
  }

  toggleVisibleHistory(i: number) {
    this.visibleHistory = this.visibleHistory === i ? -1 : i;
  }

  checkShouldDisable(exceptedValue: boolean): boolean {
    for (const currList of this.selectedLists) {
      if (currList.isPanInList !== exceptedValue)
        return true;
    }
    return false;
  }

  get disableAddPanButton() {
    if (this.selectedLists && this.selectedLists.length > 0) {
      return this.checkShouldDisable(true);
    }
    return true; // true is disabled
  }

  get disableRemovePanButton() {
    if (this.selectedLists && this.selectedLists.length > 0) {
      return this.checkShouldDisable(false);
    }
    return true; // true is disable
  }

  changedSelectedLists(eventList: any) {
    const listAlreadySelected = this.selectedLists.find(list =>
      list.UserDefinedTableResponse.id === eventList.UserDefinedTableResponse.id);
    if (listAlreadySelected) {
      this.selectedLists = this.selectedLists.filter(list =>
        list.UserDefinedTableResponse.id !== eventList.UserDefinedTableResponse.id);
    } else {
      this.selectedLists.push(eventList);
    }
    this.logger.debug('changedSelectedLists selectedLists: ', this.selectedLists);
  }

  doRefreshLists(lists: UdtList[]) {
    this.selectedListsList = [];
    this.selectedLists = [];
    this.visibleHistory = -1;
    this.refreshLists.emit(lists);
    this.sortBy(this.sortField, this.sortOrder);
  }

  onPanRemoved(event: UdtList[]) {
    this.logger.debug('onPanRemoved ', event);
    this.doRefreshLists(event);
  }

  onPanAdded(event: UdtList[]) {
    this.logger.debug('onPanAdded ', event);
    this.doRefreshLists(event);
  }

  sortBy(field: string, order = 1) {
    this.sortOrder = order;
    this.sortField = field;
    if (field === 'isPanInList') {
      this.lists = sortBy(this.lists, (item: UdtList) => item.isPanInList);
    } else {
      this.lists = sortBy(this.lists, (item: UdtList) => item.UserDefinedTableResponse[field]);
    }
    if (order === -1) {
      this.lists.reverse();
    }
  }
}
