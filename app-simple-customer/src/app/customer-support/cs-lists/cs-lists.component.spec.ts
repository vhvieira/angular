import { CsListsComponent } from './cs-lists.component';
import { CsTransactionsFormService } from '../form/cs-transactions-form.service';
import { CSListService } from './cs-lists.service';
import { UdtList,
        ListItemResponse,
        ItemsList,
        UdtListResponse,
        UserDefinedTableData,
        Column,
        Status } from './data/list-request-body';
import { Router } from '@angular/router';
import { of } from 'rxjs/observable/of';
const loggerMock = {
  debug: jasmine.createSpy('debug'),
} as any;
let transactionsFormServiceMock: CsTransactionsFormService;
let listServiceMock: CSListService;

describe('CsListsComponent', function () {

  let component: CsListsComponent;
  let lists: UdtList[] = [];
  let routerMock: Router;
  let listServiceRespList: any;
  let listServiceRespPan: any;
  let mockResponse: ListItemResponse;
  const mockPan = '5205880000010074';
  const responseOK: any = {
    id: 43040,
    status: {
        message: 'OK',
        code: 0
    }
  };
  let udtList: any;
  beforeEach(function () {
    // prepare mock data
    udtList = new UdtList();
    udtList.id = '43040';
    lists = [udtList];
    // prepare mock response
    const item = new ItemsList(mockPan, new Date(), new Date());
    mockResponse = ListItemResponse.createResponse(responseOK);
    mockResponse.items = [item];
    routerMock = {
      navigateByUrl: jasmine.createSpy('navigateByUrl')
    } as any;
    listServiceRespList = {
      subscribe: jasmine.createSpy('subscribe').and.returnValue(of(lists))
    } as any;
    listServiceRespPan = {
      subscribe: jasmine.createSpy('subscribe').and.returnValue(mockResponse)
    } as any;
    listServiceMock = {
      getLists: jasmine.createSpy('getLists').and.returnValue(listServiceRespList),
      getPanFromList: jasmine.createSpy('getPanFromList').and.returnValue(listServiceRespPan)
    } as any;
    transactionsFormServiceMock = { auditInformation: null } as any;
    component = new CsListsComponent(loggerMock,
      transactionsFormServiceMock,
      listServiceMock,
      routerMock
    );
    component.pan = mockPan;
  });

  describe('Method: ngOnInit ', function () {
    it('should initialize the component', function () {
      component.ngOnInit();
      expect(loggerMock.debug).toHaveBeenCalled();
    });
    it('should call getLists if there is auditInformation', () => {
      const newTransactionsFormServiceMock = {
        auditInformation: {
          custId: '123'
        }
      } as any;
      const newComponent = new CsListsComponent(
        loggerMock,
        newTransactionsFormServiceMock,
        listServiceMock, routerMock
      );
      newComponent.onLoad = jasmine.createSpy('onLoad');
      newComponent.ngOnInit();
      expect(loggerMock.debug).toHaveBeenCalled();
      expect(newComponent.onLoad).toHaveBeenCalled();
    });
  });
  describe('Method: onLoad', () => {
    it('should use auditInformation PAN if available', () => {
      const formSvcMock = {auditInformation: { pan: '123' } } as any;
      const component2 = new CsListsComponent(loggerMock, formSvcMock, listServiceMock, routerMock);
      component2.onLoad();
      expect(component2.pan).toEqual(formSvcMock.auditInformation.pan);
    });
  });
  describe('Method: processListResponse', () => {
    it('should call getPanFromLists', () => {
      const formSvcMock = {auditInformation: { pan: '123' } } as any;
      const component2 = new CsListsComponent(loggerMock, formSvcMock, listServiceMock, routerMock);
      // mock response
      const udtResponse: UdtListResponse = new UdtListResponse();
      const refreshIds: string[] = [];
      lists[0].id = '43040';
      lists[0].UserDefinedTableResponse = new UserDefinedTableData();
      lists[0].UserDefinedTableResponse.id = '43040';
      udtResponse.udts = lists;
      component2.processListResponse(udtResponse, refreshIds);
      expect(listServiceMock.getPanFromList).toHaveBeenCalled();
    });
  });
  describe('Method: processListResponse', () => {
    it('should update isPanInList flag', () => {
      const formSvcMock = {auditInformation: { pan: '123' } } as any;
      const component2 = new CsListsComponent(loggerMock, formSvcMock, listServiceMock, routerMock);
      // mock response
      const listResponse: ListItemResponse = new ListItemResponse();
      const list: ItemsList[] = [];
      const columns: Column[] = [] ;
      const column: Column = new Column(1, 'A');
      const itemList: ItemsList = new ItemsList('1', new Date(), new Date());
      const status: Status = new Status();
      columns[0] = column;
      list[0] = itemList;
      status.code = 0;
      status.message = 'OK';
      listResponse.status = status;
      listResponse.items = list;
      component2.processGetPanResponse(listResponse, udtList);
      expect(udtList.isPanInList).toBeFalsy();
    });
  });
  describe('Method: onRefreshLists', function () {
    it('should call onInit and getList', function () {
      const formSvcMock = {auditInformation: { pan: '123' } } as any;
      const component2 = new CsListsComponent(loggerMock, formSvcMock, listServiceMock, routerMock);
      const udtLists: UdtList[] = [];
      component2.onRefreshLists(udtLists);
      expect(listServiceMock.getLists).toHaveBeenCalled();
    });
  });
  describe('Method: onRefreshLists', function () {
    it('should call getLists', function () {
      const formSvcMock = {auditInformation: { pan: '123' } } as any;
      const component2 = new CsListsComponent(loggerMock, formSvcMock, listServiceMock, routerMock);
      // mock response
      const udtResponse: UdtListResponse = new UdtListResponse();
      lists[0].id = '43040';
      lists[0].UserDefinedTableResponse = new UserDefinedTableData();
      lists[0].UserDefinedTableResponse.id = '43040';
      udtResponse.udts = lists;
      component2.onRefreshLists(udtResponse.udts);
      expect(listServiceMock.getLists).toHaveBeenCalled();
    });
  });
});
