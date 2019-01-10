import { Component, OnInit } from '@angular/core';
import { Logger } from '@mastercard/ng-commons';
import modConfig from './data/tran-viewer-mod-config';
import { TvColumnData } from '@mc-fraud-center/ng-transaction-viewer/shared/tv-column/tv-column-data.interface';
import {
  TvSaveSettingsEvent,
  TvRowSelectEvent,
  TvRowDoubleClickEvent,
  TvViewerComponent
} from '@mc-fraud-center/ng-transaction-viewer';
import { Router } from '@angular/router';
import { ViewEncapsulation } from '@angular/core';
import {
  ResearchTransactionRequest,
  ResearchTransactionResponse,
  ResearchOwnerResponse
} from '../../core/interfaces/research-transaction-request';
import { CsTransactionsService } from './cs-transactions.service';
import { ErrorResponse, FcDialogComponent } from '@mc-fraud-center/commons';
import { FormGroup } from '@angular/forms';
import { ViewChild } from '@angular/core';
import * as CONFIG from '../../constants';
import { CsTransactionsFormService } from '../form/cs-transactions-form.service';

export interface SortingSettings {
  sortField: string;
  sortOrder: number;
}

@Component({
  selector: 'cs-transactions',
  templateUrl: './cs-transactions.component.html',
  styleUrls: ['./cs-transactions.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CsTransactionsComponent implements OnInit {

  @ViewChild(FcDialogComponent) dialog: FcDialogComponent;
  @ViewChild('viewer') viewer: TvViewerComponent;

  enableGrouping = false;
  columnDefs = modConfig.elements;
  data = { modConfig };
  settings = modConfig.configs;
  sort: SortingSettings;
  transactions: ResearchTransactionResponse[] = []; // data;
  selectedTransactions: TvColumnData[] = [];
  enableRecordSelection = false;
  currentIca: string | null;
  currentInstitutionName: string | null;
  auditInformation: ResearchTransactionRequest | null;
  notFoundMessage = '';
  dialogText = '';
  historyVisible = false;
  enableViewer = true;

  constructor(
    private logger: Logger,
    private router: Router,
    private transactionsService: CsTransactionsService,
    private transactionsFormService: CsTransactionsFormService
  ) {
    logger.debug(modConfig);
    this.sort = {
      sortField: 'localTransactionDateTime',
      sortOrder: -1
    };
    setTimeout(() => {
      this.transactionsFormService.setTransactionsTab();
    }, 1000);
  }

  ngOnInit() {
    const transactions = this.transactionsFormService.getTransactions();
    if (transactions && transactions.length > 0) {
      this.transactions = transactions;
    }
    this.historyVisible = this.transactionsFormService.getHistoryVisible();
    this.auditInformation = this.transactionsFormService.auditInformation;
  }

  get enableHistory () {
    return this.auditInformation
      && this.auditInformation.searchType === CONFIG.SEARCH_TYPE.PAN
      || this.transactions.length > 0;
  }

  onRefresh() {
    // this.transactionService.refreshTransactions().subscribe();
    this.logger.info(`refresh transactions`);
  }

  onShowDialog(msg: string) {
    this.dialogText = msg;
    this.dialog.show();
  }

  /*
  * Method that handles the received event from CsTransactionsFormComponent
  * @Param SearchForm searchForm the FormGroup sent via EventEmitter
  * # Switch Handles Technical Notes #2 and #3
  */
  onSearch(searchForm: FormGroup) {
    this.notFoundMessage = '';
    this.logger.debug('formservice', this.transactionsFormService);
    this.auditInformation = this.transactionsFormService.auditInformation;

    this.logger.debug('Parsed search object (auditInformation): ', this.auditInformation!);
    switch (this.auditInformation!.searchType) {
      case '1':
        this.auditInformation!.pan = searchForm.controls.searchField.value;
        this.onSearchByPan();
        break;
      case '2':
        this.auditInformation!.processedTranId = searchForm.controls.searchField.value;
        this.onSearchByTransactionId();
        break;
    }
  }

  onToggleHistory () {
    this.logger.debug('onToggleHistory ', this.historyVisible);
    this.historyVisible = !this.historyVisible;
    if ( this.historyVisible ) {
      this.onSearchHistory();
    } else {
      this.auditInformation!.searchType === CONFIG.SEARCH_TYPE.PAN
      ? this.onSearchByPan()
      : this.onSearchByTransactionId();
    }
  }

  onSearchHistory() {
    this.transactionsService
      .allTransactionsForPan(this.auditInformation!)
      .subscribe(
        res => this.onTransactionsReceived(res.data as any),
        err => this.onRequestError(err)
      );
  }

  /*
  * Perform the search by PAN
  * @params ResearchTransactionRequest searchObject audit info object
  * populated with data from the event received form`s searchForm
  * Handles technical Notes #2.1
  */
  onSearchByPan () {
    this.logger.debug('onSearchByPan ', this.auditInformation);
    this.transactionsService
      .researchOwner(this.auditInformation!)
      .subscribe(
          res => this.handleresearchOwner(res.response.json()),
          (err: ErrorResponse) => this.onRequestError(err)
      );
  }

  /*
  * Performs search of declines for processedTransactionId
  * # Technical notes #3.1
  *
  */
  onSearchByTransactionId () {
    this.transactionsService
      .declinesForProcessedTransactionId(this.auditInformation!)
      .subscribe(
          // TODO: change this
          res => this.handleDeclinesForProcessedTransactionId(res.response.json()),
          (err: ErrorResponse) => this.onRequestError(err)
      );
  }

  onRequestError (err: ErrorResponse) {
    this.logger.error('onRequestError ', err);
    this.onShowDialog('CUSTOMER_SUPPORT.ERROR.SYSTEM');
  }

  /*
  *  Adds received ResearchTransactionResponse data for the auditInformation
  *  and performs the next request to get researchDeclinedTransactions
  *  Also, updates the currentIca and currentInstitutionName so the form is able to show them
  *  @param ResearchTransactionResponse body received from onSearchByPan
  *
  * Technical notes #2
  * OR
  * Technical notes #3.4
  */
  handleresearchOwner (body: any) {
    if (!body) {
      this.noRowsToShow();
      return;
    }
    this.logger.debug('handleresearchOwner ', body, this.auditInformation, body as ResearchOwnerResponse);
    this.auditInformation!.ica  = body.memberId;
    this.auditInformation!.custId  = body.custId;
    this.auditInformation!.custName  = body.legalName;
    this.logger.debug('AUDIT INFO NOW IS FROM SVC', this.transactionsFormService.auditInformation);
    this.currentIca = `${body.memberId}`;
    this.currentInstitutionName = body.legalName;

    // # Technical notes #2.3
    this.transactionsService
      .researchDeclinedTransactions(this.auditInformation!)
      .subscribe(
        res => this.onTransactionsReceived(res.data as any),
        err => this.onRequestError(err)
      );
  }

  noRowsToShow () {
    switch (this.auditInformation!.searchType) {
      case '1':
        this.notFoundMessage = 'CUSTOMER_SUPPORT.MESSAGES.NOT_FOUND.PAN';
        break;
      case '2':
        this.notFoundMessage = 'CUSTOMER_SUPPORT.MESSAGES.NOT_FOUND.TRANSACTION_ID';
        break;
      default:
        throw new Error('Invalid Search Type');
    }
    this.logger.info('No Rows to Show for ', this.auditInformation!.searchType, this.notFoundMessage);
  }

  /*
  * Handles the research-transactions result for TransactionId, doing one of the following:
  * 1. If row returned, extract PAN from this response and proceed to next step (researchOwner)
  * 2. If no rows returned, display message under grid that no matching record was found
  * @param ResearchTransactionResponse body
  */
  handleDeclinesForProcessedTransactionId (body: ResearchTransactionResponse[]) {
    this.logger.debug('handleDeclinesForProcessedTransactionId ', body);

    if (body.length === 0) {
      this.noRowsToShow();
      return;
    }

    this.auditInformation!.pan = body[0].de2PrimaryAccountNumber;
    this.logger.debug('new audit ', this.auditInformation);
    this.transactionsService
      .researchOwner(this.auditInformation!)
      .subscribe(
        res => this.handleresearchOwner(res.response.json()),
        (err: ErrorResponse) => this.onRequestError(err)
      );
  }

  /*
  * Handles the response from researchDeclinedTransactions, that will be parsed and displayed in the grid
  * @param body
  *
  * # Technical Notes 2.4
  */
  onTransactionsReceived = (body: ResearchTransactionResponse[]) => {
    if (body.length > 0) {
      this.auditInformation!.acctRngId  = body[0].acctRngId;
      this.auditInformation!.pan = body[0].de2PrimaryAccountNumber!;
    } else {
      this.noRowsToShow();
    }

    this.transactions = body;

    this.transactionsFormService.setTransactions(this.transactions, this.historyVisible);

    this.viewer.setPage(0);
  }

  onChangeSettings(settingsEvent: TvSaveSettingsEvent) {
    this.logger.info(`onChangeSettings`, settingsEvent);
    if (settingsEvent.settings.sortOrder && settingsEvent.settings.sortField ) {
      this.settings.sortOrder = settingsEvent.settings.sortOrder;
      this.settings.sortField = settingsEvent.settings.sortField;
      // this.sortFunction(settingsEvent);
    }
    // this.storageService.setTvSettings(settingsEvent.settings);
  }

  recordSelected(selectedTransactions: TvRowSelectEvent) {
    this.logger.info(`recordSelected`, selectedTransactions );
    this.selectedTransactions = selectedTransactions.transactions;
  }

  onNewInquiry() {
    this.transactions = [];
    this.auditInformation = null;
    this.historyVisible = false;
    this.notFoundMessage = '';
    this.currentIca = null;
    this.currentInstitutionName = null;
    this.settings.sortField = 'processedDateTime';
    this.settings.sortOrder = -1;
    this.enableViewer = false;
    setTimeout(() => {
      this.enableViewer = true;
    }); // TODO: Remove timeout and make sure sorting is reseted
  }

  onRowDoubleClick($event: TvRowDoubleClickEvent) {
    this.logger.info(`onRowSelected`, $event);
    this.transactionsFormService.auditInformation = this.auditInformation;
    this.transactionsFormService.setChosenPan($event.transaction);
    this.router.navigate(['lists']);
  }
}
