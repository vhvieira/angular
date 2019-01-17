import { CsListsComponent } from './cs-lists.component';
import { CsTransactionsFormService } from '../form/cs-transactions-form.service';
import { CSListService } from './cs-lists.service';
import { UdtList,
        ListItemResponse,
        ItemsList,
        UdtListResponse,
       } from './data/list-request-body';
import { Router } from '@angular/router';
import * as CONFIG from './../../constants';
import { of } from 'rxjs/observable/of';
import * as momentNS from 'moment';

let transactionsFormServiceMock: CsTransactionsFormService;
let listServiceMock: CSListService;

describe('CsListsComponent', function () {

  let component: CsListsComponent;
  let response: UdtListResponse;
  let lists: UdtList[] = [];
  let routerMock: Router;
  let listServiceRespList: any;
  let listServiceRespPan: any;
  let mockResponse: ListItemResponse;
  let mockPan: string;
  let loggerMock: any;
  let responseOK: any;
  let udtList: UdtList;
  let listsServiceMock: CSListService;

  beforeEach(function () {
    // prepare mock data
    listsServiceMock = {} as CSListService;
    responseOK = {
      id: 43040,
      status: {
          message: 'OK',
          code: 0
      }
    };
    loggerMock = {
      debug: jasmine.createSpy('debug'),
    } as any;
    mockPan = '5205880000010074';
    response = new UdtListResponse();
    udtList = new UdtList();
    udtList.id = 43040;
    lists = [udtList];
    response.udts = lists;
    // prepare mock response
    const item = new ItemsList(mockPan, new Date(), new Date());
    mockResponse = ListItemResponse.createResponse(responseOK);
    mockResponse.items = [item];
    routerMock = {
      navigateByUrl: jasmine.createSpy('navigateByUrl').and.returnValue(new Promise( () => true ) )
    } as any;
    listServiceRespList = {
      subscribe: jasmine.createSpy('subscribe').and.returnValue(of(response)),
      pipe: jasmine.createSpy('subscribe').and.returnValue(of(response)),
    } as any;
    listServiceRespPan = {
      subscribe: jasmine.createSpy('subscribe').and.returnValue(mockResponse)
    } as any;
    listServiceMock = {
      getLists: jasmine.createSpy('getLists').and.returnValue(listServiceRespList),
      getPanFromList: jasmine.createSpy('getPanFromList').and.returnValue(listServiceRespPan),
      resetListHistory: jasmine.createSpy('resetListHistory')
    } as any;
    transactionsFormServiceMock = { auditInformation: null } as any;
    component = new CsListsComponent(loggerMock,
      transactionsFormServiceMock,
      listServiceMock,
      routerMock
    );
    component.pan = mockPan;
    component.onLoad = jasmine.createSpy('onLoad');
    component.getLists = jasmine.createSpy('getLists');
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
    it('should redirect to transaction when custId is empty', () => {
      transactionsFormServiceMock.setTransactionsTab = jasmine.createSpy('setTransactionsTab');
      const listComponent = new CsListsComponent(
        loggerMock,
        transactionsFormServiceMock,
        listServiceMock, routerMock
      );
      listComponent.ngOnInit();
      expect(routerMock.navigateByUrl).toHaveBeenCalled();
    });
  });

  describe('Method: onLoad', () => {
    it('should use auditInformation PAN if available', () => {
      const formSvcMock = {auditInformation: { pan: '123' } } as any;
      const component2 = new CsListsComponent(loggerMock, formSvcMock, listServiceMock, routerMock);
      component2.onLoad();
      expect(component2.pan).toEqual(formSvcMock.auditInformation.pan);
    });
    it ('should use testing PAN', () => {
      const formServiceMock = {auditInformation: {}} as any;
      const comp = new CsListsComponent(loggerMock, formServiceMock, listServiceMock, routerMock);
      comp.onLoad();
      expect(loggerMock.debug).toHaveBeenCalledWith('Using testing PAN');
      expect(comp.pan).toEqual(CONFIG.TEST_HARDCODE_PAN);
    });
  });

  describe('Method: onRefreshLists', () => {
    it('should call onLoad method when lists is empty or undefined', () => {
      component.onRefreshLists([] as UdtList[]);
      expect(loggerMock.debug).toHaveBeenCalled();
      expect(component.onLoad).toHaveBeenCalled();
      expect(listServiceMock.resetListHistory).toHaveBeenCalled();
    });
    it('should call getLists method', () => {
      const list = new UdtList();
      list.id = 1;
      const arrayLists = [new UdtList()];
      arrayLists[0] = list;
      component.onRefreshLists(arrayLists);
      expect(loggerMock.debug).toHaveBeenCalled();
      expect(component.getLists).toHaveBeenCalled();
    });
  });

  describe('Method: getLists', () => {
    let newResponse: UdtListResponse;
    let newUdtList: UdtList;
    let newComponent: CsListsComponent;
    beforeEach(() => {
      newResponse = new UdtListResponse();
      newUdtList = new UdtList();
      newUdtList.id = 43040;
      lists = [newUdtList];
      newResponse.udts = lists;

      listsServiceMock.getLists = jasmine.createSpy('getLists').and.returnValue(of(newResponse));
      listsServiceMock.getPanFromList = jasmine.createSpy('getPanFromList').and.returnValue(of());

      newComponent = new CsListsComponent(loggerMock, transactionsFormServiceMock, listsServiceMock, routerMock);
    });
    it('should set component.data to the same value returned by the service', () => {
      newComponent.data = [newUdtList];
      newComponent.getLists();
      expect(newComponent.data).toEqual(lists);
      expect(listsServiceMock.getLists).toHaveBeenCalled();
    });
    it('should cover oldData branch', () => {
      newComponent.data = null as any;
      newComponent.getLists();
    });
    it('should set component.data to []', () => {
      const emptyResponse = new UdtListResponse();
      listsServiceMock.getLists = jasmine.createSpy('getLists').and.returnValue(of(emptyResponse));
      newComponent = new CsListsComponent(loggerMock, transactionsFormServiceMock, listsServiceMock, routerMock);
      newComponent.getLists();
      expect(newComponent.data).toEqual([]);
      expect(listsServiceMock.getLists).toHaveBeenCalled();
      expect(listsServiceMock.getPanFromList).not.toHaveBeenCalled();
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
      lists[0].id = 43040;
      udtResponse.udts = lists;
      component2.onRefreshLists(udtResponse.udts);
      expect(listServiceMock.getLists).toHaveBeenCalled();
    });
  });
  describe('Method: setPanInListStatusText ', () => {
    let mockResponsePanInList: any;
    beforeEach(() => {
      mockResponsePanInList = {
        items: [{
          columns: [
            {},
            {
              value: momentNS() // start date
            },
            {
              value: momentNS().add(`2 day`) // end date
            }
          ]
        }]
      };
    });
    it('should set future if startDate is in the future', () => {
      const mockList = { isPaInList: '' } as any;
      mockResponsePanInList.items[0].columns[1].value = momentNS().add(3, 'day');
      mockResponsePanInList.items[0].columns[2].value = momentNS().add(5, 'days');
      component.setPanInListStatusText(mockResponsePanInList, mockList);
      expect(mockList.isPanInList).toEqual(CONFIG.PAN_LIST_STATUS.FUTURE);
    });
    it('should set expired if endDate is before today', () => {
      const mockList = { isPaInList: '' } as any;
      mockResponsePanInList.items[0].columns[1].value = momentNS().subtract(5, 'days');
      mockResponsePanInList.items[0].columns[2].value = momentNS().subtract(3, 'days');
      component.setPanInListStatusText(mockResponsePanInList, mockList);
      expect(mockList.isPanInList).toEqual(CONFIG.PAN_LIST_STATUS.EXPIRED);
    });
    it('should set active if endDate is after today and startDate before', () => {
      const mockList = { isPaInList: '' } as any;
      mockResponsePanInList.items[0].columns[1].value = momentNS().subtract(5, 'days');
      mockResponsePanInList.items[0].columns[2].value = momentNS().add(3, 'days');
      component.setPanInListStatusText(mockResponsePanInList, mockList);
      expect(mockList.isPanInList).toEqual(CONFIG.PAN_LIST_STATUS.ACTIVE);
    });
    describe('Method: processGetPanResponse', () => {
      it('should check if ListItemResponse has start and end dates and set not in list if NOT', () => {
        const mockList = { isPaInList: '' } as any;
        delete mockResponsePanInList.items[0].columns[1].value;
        component.processGetPanResponse(mockResponsePanInList, mockList);
        expect(mockList.isPanInList).toEqual(CONFIG.PAN_LIST_STATUS.NOT_IN_LIST);
      });
    });
  });
});
