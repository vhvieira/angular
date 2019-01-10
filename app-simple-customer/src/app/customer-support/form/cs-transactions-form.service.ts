import { Injectable } from '@angular/core';
import { MessageService } from '@mastercard/ng-commons';
import {
  ResearchTransactionRequest,
  ResearchTransactionResponse
} from '../../core/interfaces/research-transaction-request';
import * as CONFIG from '../../constants';
import { TvColumnData } from '@mc-fraud-center/ng-transaction-viewer/shared/tv-column/tv-column-data.interface';

@Injectable()
export class CsTransactionsFormService {
  auditInformation: ResearchTransactionRequest | null = null;
  chosenPan: TvColumnData | null = null;
  transactions: ResearchTransactionResponse[];
  historyVisible: boolean;

  constructor(private messageService: MessageService) {
    // .
  }

  setAuditInformation(data: ResearchTransactionRequest) {
    this.auditInformation = data;
    this.auditInformation.customerSupportUserId = '123'; // this should be added by SAML
  }

  setChosenPan(pan: TvColumnData) {
    this.chosenPan = pan;
  }

  setTransactionsTab() {
    const action = CONFIG.TRANSACTION_NAVIGATE_ACTION;
    const message = { action, message: CONFIG.SELECT_TAB_MSG_KEY };
    this.messageService.post(message);
  }

  setTransactions (transactions: ResearchTransactionResponse[], historyVisible: boolean) {
    this.transactions = transactions.slice(0);
    this.historyVisible = historyVisible;
  }

  getTransactions () {
    return this.transactions;
  }

  getHistoryVisible () {
    return this.historyVisible;
  }

  reset () {
    this.auditInformation = null;
    this.chosenPan = null;
    this.transactions = [];
    this.historyVisible = false;
  }
}
