import { CSListService } from './cs-lists.service';
import { ListItemRequest, UdtList, ListItemResponse, Status } from './data/list-request-body';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';
import { HttpResponse, ToastrService } from '@mc-fraud-center/commons';
import { Observable } from 'rxjs/Observable';
import * as CONFIG from '../../constants';
import { CsTransactionsFormService } from '../form/cs-transactions-form.service';
import { UdtDetail } from './list-summary/list.model';
import { ResponseOptions, Response } from '@angular/http';

describe('CSListService', function () {

  let loggerMock: any;
  let httpReturnMock: Observable<HttpResponse<any>>;
  let httpMock: any;
  let toastrMock: ToastrService;
  let windowMock: any;
  let transactionMock: CsTransactionsFormService;
  let service: CSListService;
  let testingPAN: string;
  let selectedLists: UdtList[];
  let mockMessageService: any;

  beforeEach(function () {
    testingPAN = CONFIG.TEST_HARDCODE_PAN;
    const udtList = new UdtList();
    udtList.id = 43040;
    selectedLists = [udtList];
    loggerMock = jasmine.createSpyObj(['debug', 'error']);
    toastrMock = jasmine.createSpyObj(['warning', 'error']);
    mockMessageService = {
      post: jasmine.createSpy('post')
    };

    transactionMock = new CsTransactionsFormService(mockMessageService);
    httpReturnMock = of(new HttpResponse<any>( { body: 'data' } as any,
      { status: {message: CONFIG.LIST_MGMT_RESPONSE_OK }})
    );
    httpMock = {
      get: jasmine.createSpy('http.get').and.returnValue(httpReturnMock),
      post: jasmine.createSpy('http.post').and.returnValue(httpReturnMock),
      defaultHeaders: jasmine.createSpyObj(['set'])
    };
    windowMock = {
      sessionStorage: {
        setItem: jasmine.createSpy('setItem'),
        getItem: jasmine.createSpy('getItem'),
        get: jasmine.createSpy('get'),
        length: jasmine.createSpy('length').and.returnValue(2)
      }
    };
    service = new CSListService(windowMock, httpMock, transactionMock, loggerMock, toastrMock);
  });

  describe('Method: getListHistory', function () {
    it('should return an Observable<UdtHistory[]> from the webservice', function ( doneCb ) {
      const list: any = { udtId: 1, pan: '5432'} ;
      service.historyStorage.get = jasmine.createSpy('get');
      service.historyStorage.set = jasmine.createSpy('set');
      service.getListHistory(list.udtId, list.pan).subscribe( _ => {
        expect(httpMock.get).toHaveBeenCalled();
        expect(service.historyStorage.get).toHaveBeenCalled();
        expect(service.historyStorage.set).toHaveBeenCalled();
        doneCb();
      });
    });

    it('should return an Observable<UdtHistory[]> from the session', function ( doneCb ) {
      const list: any = { udtId: 1, pan: '5432'};
      const udtDetailExample: UdtDetail = new UdtDetail();
      const storageKey: string = list.udtId.toString();

      service.historyStorage.set(storageKey, udtDetailExample);
      service.historyStorage.set('PAN_REF', list.pan);
      spyOn(service.historyStorage, 'get').and.callThrough();
      spyOn(service.historyStorage, 'set').and.callThrough();

      service.getListHistory(list.udtId, list.pan).subscribe( _ => {
        expect(httpMock.get).not.toHaveBeenCalled();
        expect(service.historyStorage.get).toHaveBeenCalled();
        expect(service.historyStorage.set).not.toHaveBeenCalled();
        doneCb();
      });
    });

  });

  describe('Method: addItemList', function () {
    let request: ListItemRequest;
    beforeEach(() => {
      request = ListItemRequest.createRequest(1, '12345', new Date(), new Date());
    });
    it('should return an Observable<HttpResponse<ListItemResponse>>', function () {
      service.addItemList(request).subscribe( _ => {
        expect(httpMock.post).toHaveBeenCalled();
      });
    });
  });

  describe('Method: addItemMultipleLists', function () {
    it('should return an Observable<HttpResponse<ListItemResponse>>', function () {
      service.addItemMultipleLists(selectedLists,
        testingPAN, new Date(), CONFIG.DEFAULT_END_DATE).subscribe( _ => {
         expect(httpMock.post).toHaveBeenCalled();
      });
    });
  });

  describe('Method: remItemList', function () {
    let request: ListItemRequest;
    beforeEach(() => {
      request = ListItemRequest.createRequest(1, '12345', new Date(), new Date());
    });
    it('should return an Observable<HttpResponse<ListItemResponse>>', function () {
      service.remItemList(request).subscribe( _ => {
        expect(httpMock.post).toHaveBeenCalled();
      });
    });
    it('should throw error', done => {
      httpMock.post = jasmine.createSpy('post').and.returnValue(_throw({}));
      service.remItemList(request).subscribe(
        _ => done.fail(`Request should fail but it didn't.`),
        (_: any) => {
          expect(httpMock.post).toHaveBeenCalled();
          done();
        }
      );
    });
  });

  describe('Method: removeItemMultipleLists', function () {
    it('should return an Observable<HttpResponse<ListItemResponse>>', function () {
      service.removeItemMultipleLists(selectedLists,
        testingPAN, new Date(), CONFIG.DEFAULT_END_DATE).subscribe( _ => {
          expect(httpMock.post).toHaveBeenCalled();
        });
    });
  });

  describe('Method: aggregateReponse ', () => {
    it('should return ListAggregatorResponse with SUCCESS status code', () => {
      const response = new ListItemResponse();
      response.status =  new Status();
      response.status.message = CONFIG.LIST_MGMT_RESPONSE_OK;
      service.addItemList = jasmine.createSpy('addItemList').and.returnValue(of(response));
      service.addItemMultipleLists(selectedLists, testingPAN, new Date(), CONFIG.DEFAULT_END_DATE).subscribe();
      expect(service.addItemList).toHaveBeenCalled();
    });
    it('should return ListAggregatorResponse with FULL_ERROR status code', () => {
      const response = new ListItemResponse();
      response.status =  new Status();
      service.addItemList = jasmine.createSpy('addItemList').and.returnValue(of(response));
      service.addItemMultipleLists(selectedLists, testingPAN, new Date(), CONFIG.DEFAULT_END_DATE).subscribe();
      expect(service.addItemList).toHaveBeenCalled();
    });
    it('should return ListAggregatorResponse with SUCCESS status code', () => {
      const udtList = new UdtList();
      udtList.id = 43040;
      selectedLists.push(udtList);
      const response = new ListItemResponse();
      response.status =  new Status();
      response.status.message = CONFIG.LIST_MGMT_RESPONSE_OK;
      service.addItemList = jasmine.createSpy('addItemList').and.returnValue(of(response));
      service.addItemMultipleLists(selectedLists, testingPAN, new Date(), CONFIG.DEFAULT_END_DATE).subscribe();
      expect(service.addItemList).toHaveBeenCalled();
    });
    it('should return ListAggregatorResponse with FULL_ERROR status code', () => {
      const udtList = new UdtList();
      udtList.id = 43040;
      selectedLists.push(udtList);
      const response = new ListItemResponse();
      response.status =  new Status();
      service.addItemList = jasmine.createSpy('addItemList').and.returnValue(of(response));
      service.addItemMultipleLists(selectedLists, testingPAN, new Date(), CONFIG.DEFAULT_END_DATE).subscribe();
      expect(service.addItemList).toHaveBeenCalled();
    });
  });

  describe('Method: getLists', () => {
    it('should call mapForErrors and http.get methods', done => {
      const status = new Status();
      status.message = '';
      status.code = 200;
      const data: ListItemResponse = new ListItemResponse();
      data.status = status;
      httpMock.get = jasmine.createSpy('get').and.returnValue(of(data));
      service.mapForErrors = jasmine.createSpy('mapForErrors');
      service.getLists().subscribe((_: any) => {
        expect(httpMock.get).toHaveBeenCalled();
        expect(service.mapForErrors).toHaveBeenCalled();
        expect(loggerMock.debug).toHaveBeenCalledTimes(5);
        done();
      });
    });
    it('should log the error', done => {
      const mockError = 'Error happened';
      httpMock.get = jasmine.createSpy('get').and.returnValue(_throw(mockError));
      service.getLists().subscribe(
        (result: any) => {
          expect(loggerMock.error).toHaveBeenCalledWith('error getLists', mockError);
          expect(result).toEqual([]);
          done();
        }
      );
    });
  });

  describe('Method: mapForErrors', () => {
    let resp: Response;
    beforeEach(() => {
      const options = {body: '', status: 200, headers: null, url: null} as ResponseOptions;
      resp = new Response(options);
    });
    it('should throw new Error', () => {
      const status = new Status();
      status.message = '';
      status.code = 400;
      const data: ListItemResponse = new ListItemResponse();
      data.status = status;
      const response = new HttpResponse(resp, data);
      try {
      service.mapForErrors(response, '', {});
      } catch (e) {
      expect(loggerMock.error).toHaveBeenCalled();
      expect(toastrMock.error).toHaveBeenCalled();
      expect(e instanceof Error).toBeTruthy();
      }
    });
    it('should return HttpResponse', () => {
      const data: ListItemResponse = new ListItemResponse();
      const response = new HttpResponse(resp, data);
      const expected = service.mapForErrors(response, '', {});
      expect(expected).toEqual(response);
    });
    it('should cover empty object branch', () => {
      const response = new HttpResponse(resp);
      const expected = service.mapForErrors(response, '', {});
      expect(expected).toEqual(response);
    });
  });

  describe('Method: getPanFromList', () => {
    it('should return data from endpoint response', done => {
      const status = new Status();
      status.message = '';
      status.code = 200;
      const data: ListItemResponse = new ListItemResponse();
      data.status = status;
      httpMock.get = jasmine.createSpy('get').and.returnValue(of(data));
      service.getPanFromList(0, '').subscribe(
        (_: any) => {
          expect(httpMock.get).toHaveBeenCalled();
          done();
        }
      );
    });
    it('should throw an Error', done => {
      httpMock.get = jasmine.createSpy('get').and.returnValue(_throw({}));
      service.getPanFromList(0, '').subscribe(
        _ => done.fail(`Request should fail but it didn't.`),
        (_: any) => {
          expect(httpMock.get).toHaveBeenCalled();
          done();
        }
      );
    });
  });

  describe('Method: auditPost', () => {
    it('should return response', done => {
      const status = new Status();
      status.message = '';
      status.code = 200;
      const data: ListItemResponse = new ListItemResponse();
      data.status = status;
      httpMock.post = jasmine.createSpy('post').and.returnValue(of(data));
      service.auditPost([0]).subscribe(
        (_: any) => {
          expect(httpMock.post).toHaveBeenCalled();
          done();
        }
      );
    });

    it('should throw an Error', done => {
      httpMock.post = jasmine.createSpy('post').and.returnValue(_throw({}));
      service.auditPost([0], 1).subscribe(
        _ => done.fail(`Request should fail but it didn't.`),
        (_: any) => {
          expect(httpMock.post).toHaveBeenCalled();
          done();
        }
      );
    });
  });

  describe('Method: resetListHistory', () => {
    it('should call clear method on historyStorage map', () => {
      service.historyStorage.set('PAN_REF', 1283712837);

      service.resetListHistory();

      expect(service.historyStorage.size).toBe(0);
    });
  });
});
