import { Component, ViewChild, Input, Output, OnChanges } from '@angular/core';
import { Logger } from '@mastercard/ng-commons';
import { CSListService } from '../cs-lists.service';
import { AddPanModalComponent } from '../add-pan-modal/add-pan-modal.component';
import { RemovePanModalComponent } from '../rem-pan-modal/rem-pan-modal.component';
import { UdtList } from '../data/list-request-body';
import { CsTransactionsFormService } from '../../form/cs-transactions-form.service';
import { Router } from '@angular/router';
import { EventEmitter } from '@angular/core';
import { UdtHistory } from './list-history/list-history.model';
import * as CONFIG from '../../../constants';
import * as momentNS from 'moment';

@Component({
  selector: 'cs-list-summary',
  templateUrl: './list-summary.component.html',
  styleUrls: ['./list-summary.component.scss']
})
export class ListSummaryComponent implements OnChanges {

  @Input() lists: UdtList[] = [];
  @Input() pan: string;

  @Output() refreshLists = new EventEmitter<UdtList[]>();

  dialogText  = '';
  recordsPerPage = 10;
  totalRecords = 100;
  selectedLists: UdtList[] = []; // = [{id: CONFIG.TEST_HARDCODE_LIST_CODE}];
  selectedListsList = [];
  sortOrder = 1;
  sortField = 'tableName';
  defaultDateFormat = CONFIG.DEFAULT_DATE_FORMAT;
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

  ngOnChanges(): void {
    this.logger.debug('List history initialized');
    this.sortBy(this.sortField, this.sortOrder);
  }

  onNewInquiry(): void {
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
  getListHistory(listId: number) {
    this.logger.info('Calling getListHistory for listId=' + listId);
    this.listService.getListHistory(listId, this.pan).subscribe( response => {
      this.history = response.map(item => item);
    });
  }

  onClickHistory(listId: number) {
      this.toggleVisibleHistory(listId);
      this.getListHistory(listId);
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

  get disableAddPanButton(): boolean {
    return !this.selectedLists || !this.selectedLists.length;
  }

  get disableRemovePanButton(): boolean {
    const selected = this.selectedLists || [];
    return selected.every(l => !l.isPanInList || l.isPanInList === CONFIG.PAN_LIST_STATUS.NOT_IN_LIST);
  }

  changedSelectedLists(eventList: any) {
    const listAlreadySelected = this.selectedLists.find(list =>
      list.id === eventList.id);
    if (listAlreadySelected) {
      this.selectedLists = this.selectedLists.filter(list =>
        list.id !== eventList.id);
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

  onRefreshButtonClick(): void {
    this.doRefreshLists([]);
  }

  onPanRemoved(event: UdtList[]) {
    this.logger.debug('onPanRemoved ', event);
    this.doRefreshLists(event);
  }

  onPanAdded(event: UdtList[]) {
    this.logger.debug('onPanAdded ', event);
    this.doRefreshLists(event);
  }

  isPanInListText (list: UdtList): { text: string; params: { startDate?: string, endDate?: string } } {
    if (!list.startDate) {
      return { text: 'CUSTOMER_SUPPORT.LABELS.PAN_NOT_IN_LIST', params: {} };
    }

    const startDate = momentNS(list.startDate).format(CONFIG.FULL_DATE_FORMAT);
    const endDate = momentNS(list.endDate).format(CONFIG.FULL_DATE_FORMAT);
    const isPanInListText = `CUSTOMER_SUPPORT.LABELS.PAN_IN_LIST_TOOLTIP`;

    return {text: isPanInListText, params: { startDate, endDate }};
  }

  sortBy(field: string, order = 1): void {
    this.sortOrder = order;
    this.sortField = field;
    const normalize = (value: any): any => {
      return typeof value === 'string' ? value.toLowerCase() : value;
    };
    this.lists.sort((left, right) => {
      const a = normalize(left[field]);
      const b = normalize(right[field]);
      if (a === b) return 0;
      if (a == null || a === '') return order * -1;
      if (b == null || b === '') return order;
      if (a < b) return order * -1;
      return order;
    });
  }

  getFullOriginalDate (date: any) {
    return momentNS.parseZone(date).format(CONFIG.FULL_DATE_FORMAT);
  }
}
