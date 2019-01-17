import { ListSummaryComponent } from './list-summary.component';
import { AddPanModalComponent } from '../add-pan-modal/add-pan-modal.component';
import { RemovePanModalComponent } from '../rem-pan-modal/rem-pan-modal.component';
import { UdtList } from '../data/list-request-body';
import { of } from 'rxjs/observable/of';
import { UdtHistory } from './list-history/list-history.model';
import { PAN_LIST_STATUS } from '../../../constants';

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
  const udtHistory = [new UdtHistory()];

  beforeEach(function () {
    loggerMock = jasmine.createSpyObj(['debug', 'info']);
    listServiceResp = of(udtHistory);
    listService = {
      getListHistory: jasmine.createSpy('getListHistory').and.returnValue(listServiceResp)
    };
    routerService = {
      navigateByUrl: jasmine.createSpy('navigateByUrl').and.returnValue(Promise.resolve(true)),
    };
    formService = jasmine.createSpyObj(['setTransactionsTab', 'reset']);
    addPanModal = jasmine.createSpyObj(['show', 'hide']);
    remPanModal = jasmine.createSpyObj(['show', 'hide']);
    component = new ListSummaryComponent(loggerMock, listService, formService, routerService);
    component.addPanModal = addPanModal;
    component.remPanModal = remPanModal;
    // mock list data
    udtList = new UdtList();
    udtList.id = 43040;
    component.lists = [udtList];
  });

  describe('Method: ngOnChanges ', function () {
    it('should initialize variables and call sortBy function', function () {
      component.sortBy = jasmine.createSpy('sortBy');

      component.ngOnChanges();

      expect(component.sortOrder).toBe(1);
      expect(component.sortField).toBe('tableName');
      expect(component.sortBy).toHaveBeenCalledWith(component.sortField, component.sortOrder);
    });
  });

  describe('Method: onNewInquiry ', function () {
    it('should navigate to /transactions and call setTransactionsTab', function (done) {
      component.onNewInquiry();

      setTimeout(function() {
        expect(formService.reset).toHaveBeenCalled();
        expect(routerService.navigateByUrl).toHaveBeenCalledWith('/transactions');
        expect(formService.setTransactionsTab).toHaveBeenCalled();
        done();
      }, 1);
    });

    it('should not call setTransactionsTab if navigation has error', function (done) {
      routerService = {
        navigateByUrl: jasmine.createSpy('navigateByUrl').and.returnValue(Promise.resolve(false)),
      };
      const component2 = new ListSummaryComponent(loggerMock, listService, formService, routerService);

      component2.onNewInquiry();

      setTimeout(function() {
        expect(formService.reset).toHaveBeenCalled();
        expect(routerService.navigateByUrl).toHaveBeenCalledWith('/transactions');
        expect(formService.setTransactionsTab).not.toHaveBeenCalled();
        done();
      }, 1);
    });
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
      expect(component.history).toEqual(udtHistory);
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

  describe('Method: disableAddPanButton', () => {
    it('should return true if selectedLists is undefined or has no items ', () => {
        const test = component.disableAddPanButton;

        expect(test).toBeTruthy();
    });

    it('should return false if selectedLists has at least one item', () => {
      component.selectedLists = [new UdtList()];

      const test = component.disableAddPanButton;

      expect(test).toBeFalsy();
    });
  });

  describe('Method: disableRemovePanButton', () => {
    it('should return true if selectedLists is undefined or has no items ', () => {
        const test = component.disableRemovePanButton;

        expect(test).toBeTruthy();
    });

    it('should return false if selectedLists has at least one item that is active on list', () => {
      component.selectedLists = [new UdtList(), new UdtList()];
      component.selectedLists[0].isPanInList = PAN_LIST_STATUS.ACTIVE;

      const test = component.disableRemovePanButton;

      expect(test).toBeFalsy();
    });

    it('should return true if selectedLists has no active pan', () => {
      component.selectedLists = [new UdtList(), new UdtList()];

      const test = component.disableRemovePanButton;

      expect(test).toBeTruthy();
    });
  });

  describe('Method: changedSelectedLists', () => {
    it('should add new lists if ids are different', () => {
      const initialList = [udtList];
      const udtList2 = new UdtList();
      udtList2.id = 43041;
      component.selectedLists = initialList;

      component.changedSelectedLists(udtList2);

      expect(component.selectedLists.length).toBe(2);
    });

    it('should remove parameter list from component.selectedLists if they are duplicated', () => {
      const udtList2 = new UdtList();
      udtList2.id = 43041;

      const initialList = [udtList, udtList2];

      component.selectedLists = initialList;

      component.changedSelectedLists(udtList2);

      expect(component.selectedLists.length).toBe(1);
      expect(component.selectedLists[0]).toEqual(udtList);
    });
  });

  describe('Method: doRefreshLists', () => {
    it('should refresh list variables', () => {
      component.selectedLists = [udtList];
      component.sortBy = jasmine.createSpy('sortBy');

      component.doRefreshLists([udtList]);

      expect(component.selectedListsList).toEqual([]);
      expect(component.selectedLists).toEqual([]);
      expect(component.visibleHistory).toBe(-1);
      expect(component.sortBy).toHaveBeenCalled();
    });
  });

  describe('Method: onRefreshButtonClick', () => {
    it('should call doRefreshLists method with an empty array', () => {
      component.doRefreshLists = jasmine.createSpy('doRefreshLists');
      component.onRefreshButtonClick();
      expect(component.doRefreshLists).toHaveBeenCalledWith([]);
    });
  });

  describe('Method: onPanRemoved', () => {
    it('should call method doRefreshLists with parameter', () => {
      component.doRefreshLists = jasmine.createSpy('doRefreshLists');

      component.onPanRemoved([udtList]);

      expect(component.doRefreshLists).toHaveBeenCalledWith([udtList]);
    });
  });

  describe('Method: onPanAdded', () => {
    it('should call method doRefreshLists with parameter', () => {
      component.doRefreshLists = jasmine.createSpy('doRefreshLists');

      component.onPanAdded([udtList]);

      expect(component.doRefreshLists).toHaveBeenCalledWith([udtList]);
    });
  });

  describe('Method: sortBy', () => {
    it('should keep sorting after reloading lists ', () => {
      const initialList = [new UdtList(), new UdtList(), new UdtList(), new UdtList()];

      component.lists = initialList;
      component.lists[0].isPanInList = PAN_LIST_STATUS.NOT_IN_LIST;
      component.lists[1].isPanInList = PAN_LIST_STATUS.NOT_IN_LIST;
      component.lists[2].isPanInList = PAN_LIST_STATUS.ACTIVE;
      component.lists[3].isPanInList = PAN_LIST_STATUS.NOT_IN_LIST;

      component.sortBy('isPanInList');

      component.doRefreshLists([]);

      expect(component.sortField).toBe('isPanInList');
      expect(component.sortOrder).toBe(1);
      expect(component.lists[0].isPanInList).toBe(PAN_LIST_STATUS.ACTIVE);
      expect(component.lists[1].isPanInList).toBe(PAN_LIST_STATUS.NOT_IN_LIST);
      expect(component.lists[2].isPanInList).toBe(PAN_LIST_STATUS.NOT_IN_LIST);
      expect(component.lists[3].isPanInList).toBe(PAN_LIST_STATUS.NOT_IN_LIST);
    });
    it('should sort the list with "isPanInList" flagged items last.', () => {
      const initialList = [new UdtList(), new UdtList(), new UdtList(), new UdtList()];

      component.lists = initialList;
      component.lists[0].isPanInList = PAN_LIST_STATUS.NOT_IN_LIST;
      component.lists[1].isPanInList = PAN_LIST_STATUS.NOT_IN_LIST;
      component.lists[2].isPanInList = PAN_LIST_STATUS.ACTIVE;
      component.lists[3].isPanInList = PAN_LIST_STATUS.NOT_IN_LIST;

      component.sortBy('isPanInList');

      expect(component.lists[0].isPanInList).toBe(PAN_LIST_STATUS.ACTIVE);
      expect(component.lists[1].isPanInList).toBe(PAN_LIST_STATUS.NOT_IN_LIST);
      expect(component.lists[2].isPanInList).toBe(PAN_LIST_STATUS.NOT_IN_LIST);
      expect(component.lists[3].isPanInList).toBe(PAN_LIST_STATUS.NOT_IN_LIST);
    });

    it('should sort the list with "isPanInList" flagged items first.', () => {
      const initialList = [new UdtList(), new UdtList(), new UdtList(), new UdtList()];

      component.lists = initialList;
      component.lists[0].isPanInList = PAN_LIST_STATUS.NOT_IN_LIST;
      component.lists[1].isPanInList = PAN_LIST_STATUS.NOT_IN_LIST;
      component.lists[2].isPanInList = PAN_LIST_STATUS.ACTIVE;
      component.lists[3].isPanInList = PAN_LIST_STATUS.NOT_IN_LIST;

      component.sortBy('isPanInList', -1);

      expect(component.lists[0].isPanInList).toBe(PAN_LIST_STATUS.NOT_IN_LIST);
      expect(component.lists[1].isPanInList).toBe(PAN_LIST_STATUS.NOT_IN_LIST);
      expect(component.lists[2].isPanInList).toBe(PAN_LIST_STATUS.NOT_IN_LIST);
      expect(component.lists[3].isPanInList).toBe(PAN_LIST_STATUS.ACTIVE);
    });

    it('should sort case-insensitively ASC', () => {
      const list = [{foo: 'Z'}, {foo: 'a'}];

      component.lists = list as any;
      component.sortBy('foo');

      expect(list).toEqual([{foo: 'a'}, {foo: 'Z'}]);
    });

    it('should sort case-insensitively DESC', () => {
      const list = [{foo: 'a'}, {foo: 'Z'}];

      component.lists = list as any;
      component.sortBy('foo', -1);

      expect(list).toEqual([{foo: 'Z'}, {foo: 'a'}]);
    });

    it('should sort Dates ASC', () => {
      const list = [{foo: new Date('2018-01-01')}, {foo: new Date('2018-02-01')}];

      component.lists = list as any;
      component.sortBy('foo');

      expect(list).toEqual([{foo: new Date('2018-01-01')}, {foo: new Date('2018-02-01')}]);
    });

    it('should sort Dates DESC', () => {
      const list = [{foo: new Date('2018-01-01')}, {foo: new Date('2018-02-01')}];

      component.lists = list as any;
      component.sortBy('foo', -1);

      expect(list).toEqual([{foo: new Date('2018-02-01')}, {foo: new Date('2018-01-01')}]);
    });

    it('should sort the list by id (higher to lower)', () => {

      const tableResponse1 = new UdtList();
      tableResponse1.id = 1233;

      const tableResponse2 = new UdtList();
      tableResponse2.id = 1234;

      const tableResponse3 = new UdtList();
      tableResponse3.id = 1232;

      const tableResponse4 = new UdtList();
      tableResponse4.id = 1235;

      const initialList = [] as UdtList[];
      component.lists = initialList;
      component.lists[0] = tableResponse1;
      component.lists[1] = tableResponse2;
      component.lists[2] = tableResponse3;
      component.lists[3] = tableResponse4;

      component.sortBy('id', -1);

      expect(component.lists[0].id).toBe(1235);
      expect(component.lists[1].id).toBe(1234);
      expect(component.lists[2].id).toBe(1233);
      expect(component.lists[3].id).toBe(1232);
    });
  });
  describe('Method: getFullOriginalDate ', () => {
    it('should return the original timezone time in a FULL mode', () => {
      const mockDate = '2018-10-18T09:23:49-0500';
      const result = component.getFullOriginalDate(mockDate);
      expect(result).toEqual('18-Oct-2018 09:23:49 GMT-05:00');
    });
  });
});
