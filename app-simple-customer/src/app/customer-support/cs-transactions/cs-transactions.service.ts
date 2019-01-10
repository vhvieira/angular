import { Injectable } from '@angular/core';
import { HttpService, HttpWriteRequest } from '@mc-fraud-center/commons';
import {
    ResearchTransactionRequest,
    ResearchTransactionResponse
} from '../../core/interfaces/research-transaction-request';
import { RequestOptions } from '@angular/http';
import { Logger } from '@mastercard/ng-commons';
import * as CONFIG from '../../constants';

@Injectable()
export class CsTransactionsService {

  customerId: string;

  constructor(
    private http: HttpService,
    private logger: Logger
  ) {
    this.customerId = '';
  }

    researchOwner (query: ResearchTransactionRequest) {
      this.logger.debug('Service: researchOwner ', query);
      const url = CONFIG.RESEARCH_OWNER_URL;
      const request = HttpWriteRequest.create(url, query, ResearchTransactionRequest, ResearchTransactionResponse)
      .withWaitMessage('CUSTOMER_SUPPORT.WAIT.PAN_INFO')
      .withToastMessages(false);

      return this.http.post(request);
    }

    researchDeclinedTransactions (auditInformation: ResearchTransactionRequest) {
      this.logger.debug('Service: researchDeclinedTransactions ', auditInformation);
      const headers = this.http.defaultHeaders;
      if (!auditInformation.custId) {
        this.logger.error('ResearchTransactionRequest is Missing custId');
      }
      this.customerId = auditInformation.custId!.toString();
      headers.set('X-Customer-ID', auditInformation.custId!.toString());
      const options = new RequestOptions({ headers });
      const url = CONFIG.RESEARCH_TRANSACTIONS_URL;
      const query = auditInformation;

      if (auditInformation.searchType === CONFIG.SEARCH_TYPE.TRANSACTION_ID) {
        delete query.pan;
      }

      const request = HttpWriteRequest.create(url, query, ResearchTransactionRequest, ResearchTransactionResponse)
        .withWaitMessage('CUSTOMER_SUPPORT.WAIT.SEARCH_TRANSACTIONS')
        .withOptions(options)
        .withToastMessages(false);

      return this.http.post(request);
    }

    declinesForProcessedTransactionId (auditInformation: ResearchTransactionRequest) {
      this.logger.debug('Service: declinesForProcessedTransactionId ', auditInformation);
      // pass normal TFC custom headers including xsrf, productGroupId but NOT customerId since we don't have it yet
      const url = CONFIG.RESEARCH_TRANSACTIONS_URL;
      const query = auditInformation;
      if (auditInformation.searchType === CONFIG.SEARCH_TYPE.TRANSACTION_ID) {
        delete query.pan;
      }
      const request = HttpWriteRequest.create(url, auditInformation, ResearchTransactionRequest)
      .withWaitMessage('CUSTOMER_SUPPORT.WAIT.SEARCH_TRANSACTIONS')
      .withToastMessages(false);

      return this.http.post(request);
    }

    allTransactionsForPan (query: ResearchTransactionRequest) {
      const url = CONFIG.RESEARCH_TRANSACTIONS_HISTORY_URL;
      const request = HttpWriteRequest.create(url, query, ResearchTransactionRequest, ResearchTransactionResponse)
        .withWaitMessage('CUSTOMER_SUPPORT.WAIT.SEARCH_TRANSACTIONS')
        .withToastMessages(false);

      return this.http.post(request);
    }

    getCustomerId(): string {
      return this.customerId;
    }

}
