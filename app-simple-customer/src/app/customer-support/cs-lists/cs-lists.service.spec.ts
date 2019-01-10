import { CSListService } from './cs-lists.service';
import { ListItemRequest, UdtList, UserDefinedTableData } from './data/list-request-body';
import { of } from 'rxjs/observable/of';
import { HttpResponse, ToastrService } from '@mc-fraud-center/commons';
import { Observable } from 'rxjs/Observable';
import * as CONFIG from '../../constants';
import { CsTransactionsFormService } from '../form/cs-transactions-form.service';
import { UdtDetail } from './list-summary/list.model';

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
    udtList.UserDefinedTableResponse = new UserDefinedTableData();
    udtList.id = '43040';
    udtList.UserDefinedTableResponse.id = '43040';
    selectedLists = [udtList];
    loggerMock = jasmine.createSpyObj(['debug']);
    toastrMock = jasmine.createSpyObj(['warning']);
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
    it('should return an Observable<HttpResponse<ListItemResponse>>', function () {
      const request = ListItemRequest.createRequest('1', '12345', new Date(), new Date());
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
    it('should return an Observable<HttpResponse<ListItemResponse>>', function () {
      const request = ListItemRequest.createRequest('1', '12345', new Date(), new Date());
      service.remItemList(request).subscribe( _ => {
        expect(httpMock.post).toHaveBeenCalled();
      });
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

  describe('Method: getLists', function () {
    it('should return an Observable<HttpResponse<ListItemResponse>>', function () {
      service.getLists().subscribe( _ => {
          expect(httpMock.get).toHaveBeenCalled();
        });
    });
  });

});
