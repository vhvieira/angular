import { RemovePanModalComponent } from './rem-pan-modal.component';
import { ModalDirective } from 'ngx-bootstrap';
import { ListResponseCode, UdtList } from '../data/list-request-body';
import { of } from 'rxjs/observable/of';

describe('RemovePanModalComponent', function () {
  let loggerMock: any;
  let listService: any;
  let listServiceResp: any;
  let component: RemovePanModalComponent;
  let modalMock: ModalDirective;
  let toastrMock: any;

  beforeEach(function () {
    loggerMock = jasmine.createSpyObj(['debug', 'info']);
    listServiceResp =  { code: ListResponseCode.SUCCESS };
    listService = {
      removeItemMultipleLists: jasmine.createSpy('removeItemMultipleLists').and.returnValue(of(listServiceResp)),
      auditPost: jasmine.createSpy('auditPost').and.returnValue(of(true))
    };
    toastrMock = {
      success: jasmine.createSpy('success'),
      warning: jasmine.createSpy('warning'),
      error: jasmine.createSpy('error')
    };
    modalMock = jasmine.createSpyObj(['show', 'hide']);
    component = new RemovePanModalComponent(loggerMock, listService, toastrMock);
    component.ngOnInit();
    component.modal = modalMock;
  });

  describe('Method: onConfirmButton ', function () {
    it('should call service and toast a SUCCESS message', function () {
      const tableResponse = new UdtList();
      tableResponse.id = 1233;
      const initialList = [tableResponse];
      component.lists = initialList;

      component.onConfirmButton();
      expect(listService.removeItemMultipleLists).toHaveBeenCalled();
      expect(toastrMock.success).toHaveBeenCalled();
    });

    it('should call service and toast a WARNING message', function () {
      const responseMock = {
        code: ListResponseCode.PARTIAL_ERROR
      };
      listService.removeItemMultipleLists =
        jasmine.createSpy('removeItemMultipleLists').and.returnValue(of(responseMock));

      component.onConfirmButton();
      expect(listService.removeItemMultipleLists).toHaveBeenCalled();
      expect(toastrMock.warning).toHaveBeenCalled();
    });

    it('should call service and toast a ERROR message', function () {
      const responseMock = {
        code: ListResponseCode.FULL_ERROR
      };
      listService.removeItemMultipleLists =
        jasmine.createSpy('removeItemMultipleLists').and.returnValue(of(responseMock));

      component.onConfirmButton();
      expect(listService.removeItemMultipleLists).toHaveBeenCalled();
      expect(toastrMock.error).toHaveBeenCalled();
    });

    it('should call service and toast no message', function () {
      const responseMock = false;
      listService.removeItemMultipleLists =
        jasmine.createSpy('removeItemMultipleLists').and.returnValue(of(responseMock));

      component.onConfirmButton();
      expect(listService.removeItemMultipleLists).toHaveBeenCalled();
      expect(toastrMock.success).not.toHaveBeenCalled();
      expect(toastrMock.warning).not.toHaveBeenCalled();
      expect(toastrMock.error).not.toHaveBeenCalled();
    });
  });

  describe('Method: onCancelButton ', function () {
    it('should show the close modal', function () {
      component.onCancelButton();
      expect(modalMock.hide).toHaveBeenCalled();
    });
  });

  describe('Method: show ', function () {
    it('should show show modal', function () {
      component.show();
      expect(loggerMock.debug).toHaveBeenCalled();
      expect(modalMock.show).toHaveBeenCalled();
    });
  });

});
