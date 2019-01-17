import { Injectable, Inject } from '@angular/core';
import { LOCALE, Logger } from '@mastercard/ng-commons';
import { RequestOptions } from '@angular/http';
import { HttpService, HttpReadRequest, HttpResponse, HttpWriteRequest, ToastrService } from '@mc-fraud-center/commons';
import * as CONFIG from '../../constants';
import { Observable } from 'rxjs/Observable';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { ListAggregateResponse,
        ListItemRequest,
        ListItemResponse,
        ListResponseCode,
        UdtListResponse, UdtList } from './data/list-request-body';
import { Serialize } from 'cerialize';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { CsTransactionsFormService } from '../form/cs-transactions-form.service';
import { tap } from 'rxjs/operators/tap';
import { AuditRequestBody } from '../../core/interfaces/auditInformation';
import { UdtDetail } from './list-summary/list.model';
import { UdtHistory } from './list-summary/list-history/list-history.model';

@Injectable()
export class CSListService {

  historyStorage: Map<string, any> = new Map<string, any>();
  sessionService: any;
  readonly addListItemEndpoint = CONFIG.LIST_ADD_ITEM_URL;
  readonly removeListItemEndpoint = CONFIG.LIST_REMOVE_ITEM_URL;

  constructor( @Inject('Window') window: any,
               private http: HttpService,
               private trxFormService: CsTransactionsFormService,
               private logger: Logger,
               private toastr: ToastrService ) {
    this.sessionService = window.sessionStorage;
  }

  getListHistory(listId: number, pan: string): Observable<UdtHistory[]> {
    // same pan check, if not clear historyStorage
    const storageKey: string = listId.toString();
    const historyPan: string = this.historyStorage.get('PAN_REF');
    if (!historyPan || (pan !== historyPan)) {
      this.historyStorage.clear();
      this.historyStorage.set('PAN_REF', pan);
    }
    let listDetail: UdtDetail = this.historyStorage.get(storageKey);
    if ( listDetail !== undefined && listDetail != null) {
      this.logger.debug('history found', listDetail);
      return of(listDetail.udtHistory);
    } else {
      return this.callUdtHistoryEndpoint(listId, pan).pipe(map(resp => {
        if (!this.showWarningMessages(resp)) {
          this.logger.debug('Returned list history from endpoint. ', listDetail);
          listDetail = resp.data;
          this.historyStorage.set(storageKey, listDetail);
          return listDetail.udtHistory;
        } else {
          return [];
        }
      }));
    }
  }

  resetListHistory(): void {
    this.logger.debug('history cleared');
    this.historyStorage.clear();
  }

  getLists(): Observable<UdtListResponse> {
    this.logger.debug('Fetching lists');
    const url = CONFIG.API_LIST_LISTS;
    const request = HttpReadRequest.create(url, UdtListResponse)
      .withOptions(this.createHeaders())
      .withWaitMessage('CUSTOMER_SUPPORT.WAIT.LOAD_UDTS')
      .withToastMessages(false, false);
    this.logger.debug('callUdtListsEndpoint get()');
    return this.http.get(request).pipe(
        tap((res: HttpResponse<UdtListResponse>) => {
          return this.mapForErrors(res, 'getLists', request);
        }),
        map((res: any) => {
          this.logger.debug(res);
          this.logger.debug(res.data);
          this.showWarningMessages(res);
          return res.data;
        }),
        catchError((error: any) => {
          this.logger.error('error getLists', error);
          return of([]);
      })
    );
  }

  mapForErrors(res: HttpResponse<any>, methodName: string, parameters: any ) {
    const status = res.data ? res.data.status : {};
    if (status.code && status.code !== '200') {
      this.logger.error('status not 200', status, methodName, parameters);
      this.toastr.error(status.message, 'ERROR', 3000);
      throw new Error(status.message);
    }
    return res;
  }

  getPanFromList(listId: number, pan: string): Observable<ListItemResponse> {
    const url = CONFIG.API_LIST_PAN.replace('{listId}', listId.toString()).replace('{pan}', pan);
    const request = HttpReadRequest.create(url, ListItemResponse)
      .withOptions(this.createHeaders())
      .withWaitMessage('CUSTOMER_SUPPORT.WAIT.SEARCH_UDT')
      .withToastMessages(false, false);
    return this.http.get(request).pipe( map((res: any) => res.data));
  }

  addItemMultipleLists( lists: UdtList[], pan: string,
                        startDate: Date, endDate: any): Observable<ListAggregateResponse> {
      let isFirst = true;
      let response: ListAggregateResponse = new ListAggregateResponse();
      return new Observable( (observer) => {
        for (let i = 0; i < lists.length; i++) {
              const body = ListItemRequest.createRequest(lists[i].id, pan, startDate, endDate);
              this.addItemList(body).subscribe(item => {
                response = this.aggregateResponse(response, item , isFirst);
                isFirst = false;
                response.items.push(item);
                if (i >= (lists.length - 1)) {
                  observer.next(response);
                  observer.complete();
                }
              });
        }
      });
  }

  removeItemMultipleLists( lists: UdtList[], pan: string,
                           startDate: Date, endDate: any): Observable<ListAggregateResponse> {
      let isFirst = true;
      let response: ListAggregateResponse = new ListAggregateResponse();
      return new Observable( (observer) => {
        for (let i = 0; i < lists.length; i++) {
              const body = ListItemRequest.createRequest(lists[i].id, pan, startDate, endDate);
              this.remItemList(body).subscribe(item => {
                response = this.aggregateResponse(response, item , isFirst);
                isFirst = false;
                response.items.push(item);
                if (i >= (lists.length - 1)) {
                  observer.next(response);
                  observer.complete();
                }
              });
        }
      });
    }

  auditPost(tableIds: number[], type = 1) {
    const body: AuditRequestBody[] = [];
    tableIds.forEach(idNumber => {
      const typeProperty = { customerSupportActionType: CONFIG.AUDIT_ACTION_TYPES[type] };
      const auditBody = Object.assign(
        { udtTblId: idNumber },
        this.trxFormService.auditInformation as any,
        typeProperty
      );
      body.push(auditBody);
    });

    const bodyRequest = Serialize(body);
    const url = CONFIG.API_AUDIT_URL;
    const request = HttpWriteRequest.create(url, bodyRequest, AuditRequestBody)
      .withOptions(this.createHeaders())
      .withWaitMessage('CUSTOMER_SUPPORT.WAIT.ADD_AUDIT_RECORD')
      .withToastMessages(
        false,
        false
      );
    return this.http.post(request)
    .pipe(
      map((res: any) => {
        return res.data;
      }),
      catchError((error: any) =>  ErrorObservable.create(error))
    );
  }

  addItemList(body: ListItemRequest): Observable<ListItemResponse> {
    const tableId: string = body.id.toString();
    const bodyRequest = Serialize(body);
    this.logger.debug(bodyRequest);
    const url = this.addListItemEndpoint.replace(':tableId', tableId);
    const request = HttpWriteRequest.create(url, bodyRequest, ListItemRequest, ListItemResponse)
      .withOptions(this.createHeaders())
      .withWaitMessage('CUSTOMER_SUPPORT.WAIT.ADD_PAN_TO_UDT')
      .withToastMessages(
        false,
        false
      );

    return this.http.post(request)
    .pipe(
      map((res: any) => {
        this.historyStorage.delete(tableId);
        return res.data;
      }),
      catchError((error: any) =>  ErrorObservable.create(error))
    );
  }

  remItemList(body: ListItemRequest): Observable<ListItemResponse> {
    const tableId: string = body.id.toString();
    const bodyRequest = Serialize(body);
    this.logger.debug(bodyRequest);
    const url = this.removeListItemEndpoint.replace(':tableId', tableId);
    const request = HttpWriteRequest.create(url, bodyRequest, ListItemRequest, ListItemResponse)
      .withOptions( this.createHeaders() )
      .withWaitMessage('CUSTOMER_SUPPORT.WAIT.REMOVE_PAN_FROM_UDT')
      .withToastMessages(
          false,
          false
        );

    return this.http.post(request)
    .pipe(
      map((res: any) => {
        this.historyStorage.delete(tableId);
        return res.data;
      }),
      catchError( (error: any) => ErrorObservable.create(error) )
    );
  }

  private showWarningMessages(res: any): boolean {
    if (res.data && res.data instanceof ListItemResponse) {
      if (res.data.status.message !== CONFIG.LIST_MGMT_RESPONSE_OK) {
        this.toastr.warning(res.data.status.message);
        return true;
      }
    }
    return false;
  }

  private aggregateResponse(agg: ListAggregateResponse,
                            item: ListItemResponse, isFirst: boolean ): ListAggregateResponse {
    if (item != null && item instanceof ListItemResponse) {
      if (item.status != null && item.status.message === CONFIG.LIST_MGMT_RESPONSE_OK) {
        // update status rules in case of success
        if (isFirst) {
          agg.code = ListResponseCode.SUCCESS;
          return agg;
        } else {
          if (agg.code === ListResponseCode.SUCCESS)
            return agg;
          else {
            agg.code = ListResponseCode.PARTIAL_ERROR;
            return agg;
          }
        }
      } else {
        // update status in case of error
        if (isFirst) {
          agg.code = ListResponseCode.FULL_ERROR;
          return agg;
        } else {
          if (agg.code === ListResponseCode.FULL_ERROR)
            return agg;
          else {
            agg.code = ListResponseCode.PARTIAL_ERROR;
            return agg;
          }
        }
      }
    }
    return agg;
  }

  private callUdtHistoryEndpoint(utdId: number, pan: string): Observable<HttpResponse<UdtDetail>> {
    const url = CONFIG.API_LIST_HIST.replace('{id}', utdId.toString()).replace('{pan}', pan);
    const request = HttpReadRequest.create(url, UdtDetail)
      .withOptions(this.createHeaders())
      .withWaitMessage('CUSTOMER_SUPPORT.WAIT.LISTHISTORY')
      .withToastMessages(false, false);
    return this.http.get(request);
  }

  private createHeaders(): RequestOptions {
    let cid = '';
    let grpId = '';
    const headers = this.http.defaultHeaders;
    if (this.trxFormService.auditInformation) {
      this.logger.debug('Creating headers with ', this.trxFormService.auditInformation);
      cid = this.trxFormService.auditInformation.custId ?
      this.trxFormService.auditInformation!.custId!.toString() : '8';
      grpId = this.sessionService.getItem('prdctGrpId');
    }
    headers.set('X-MC-FS-Accept-Language', LOCALE.ENGLISH);
    headers.set('X-Customer-ID', cid);
    headers.set('X-PRDCT-GRP-ID', grpId);
    this.logger.debug('Creating headers  ', headers);
    return new RequestOptions({ headers });
  }

}
