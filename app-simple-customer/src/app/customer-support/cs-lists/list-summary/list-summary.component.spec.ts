import { ListSummaryComponent } from './list-summary.component';
import { AddPanModalComponent } from '../add-pan-modal/add-pan-modal.component';
import { RemovePanModalComponent } from '../rem-pan-modal/rem-pan-modal.component';
import { UdtList, UserDefinedTableData } from '../data/list-request-body';

describe('ListSummaryComponent', function () {
  let loggerMock: any;
  let listService: any;
  let listServiceResp: any;
  let component: ListSummaryComponent;
  let formService: any;
  let routerService: any;
  let addPanModal: AddPanModalComponent;
  let remPanModal: RemovePanModalComponent;
  let udtList: UdtList;

  beforeEach(function () {
    loggerMock = jasmine.createSpyObj(['debug', 'info']);
    listServiceResp = jasmine.createSpyObj(['subscribe']);
    listService = {
      getListHistory: jasmine.createSpy('getListHistory').and.returnValue(listServiceResp)
    };
    routerService = {
      navigateByUrl: jasmine.createSpy('navigateByUrl').and.returnValue('url'),
    };
    formService = jasmine.createSpyObj(['setTransactionsTab', 'reset']);
    addPanModal = jasmine.createSpyObj(['show', 'hide']);
    remPanModal = jasmine.createSpyObj(['show', 'hide']);
    component = new ListSummaryComponent(loggerMock, listService, formService, routerService);
    component.addPanModal = addPanModal;
    component.remPanModal = remPanModal;
    // mock list data
    udtList = new UdtList();
    const tableResponse = new UserDefinedTableData();
    tableResponse.id = '43040';
    udtList.UserDefinedTableResponse = tableResponse;
    component.lists = [udtList];
  });

  describe('Method: onClickHistory ', function () {
    it('should get and show the history', function () {
      component.onClickHistory(43040);
      expect(listService.getListHistory).toHaveBeenCalled();
    });
  });

  describe('Method: getListHistory ', function () {
    it('should show the history', function () {
      component.getListHistory(udtList.id);
      expect(listService.getListHistory).toHaveBeenCalled();
    });
  });
  describe('Method: toggleVisibleHistory', () => {
    it('should set the visibleHistory to ', () => {
      component.visibleHistory = 0;
      component.toggleVisibleHistory(0);
      expect(component.visibleHistory).toBe(-1);
    });
  });
  describe('Method: trackFn', () => {
    it('should be called and return ', () => {
      const result = component.trackFn(1);
      expect(result).toEqual(1);
    });
  });
  describe('Method: openAddPanModal', () => {
    it('should be called and trigger mocks ', () => {
      component.openAddPanModal();
      expect(addPanModal.show).toHaveBeenCalled();
    });
  });
  describe('Method: openRemPanModal', () => {
    it('should be called and trigger mocks ', () => {
      component.openRemPanModal();
      expect(remPanModal.show).toHaveBeenCalled();
    });
  });
  describe('Method: checkShouldDisable', () => {
    it('sshould return false for disable ', () => {
      const udtList2 = new UdtList();
      udtList2.isPanInList = true;
      component.selectedLists = [udtList2];
      const result = component.checkShouldDisable(true);
      expect(result).toBeFalsy();
    });
    it('should return true for disable', () => {
      const udtList2 = new UdtList();
      udtList2.isPanInList = true;
      component.selectedLists = [udtList2];
      const result = component.checkShouldDisable(false);
      expect(result).toBeTruthy();
    });
  });
});
