import { RemovePanModalComponent } from './rem-pan-modal.component';
import { ModalDirective } from 'ngx-bootstrap';

describe('RemovePanModalComponent', function () {
  let loggerMock: any;
  let listService: any;
  let listServiceResp: any;
  let component: RemovePanModalComponent;
  let modalMock: ModalDirective;
  let toastrMock: any;

  beforeEach(function () {
    loggerMock = jasmine.createSpyObj(['debug', 'info']);
    listServiceResp = jasmine.createSpyObj(['subscribe']);
    listService = {
      removeItemMultipleLists: jasmine.createSpy('removeItemMultipleLists').and.returnValue(listServiceResp),
      auditPost: jasmine.createSpy('auditPost').and.returnValue(listServiceResp)
    };
    toastrMock = {
      success: jasmine.createSpy('success')
    };
    modalMock = jasmine.createSpyObj(['show', 'hide']);
    component = new RemovePanModalComponent(loggerMock, listService, toastrMock);
    component.ngOnInit();
    component.modal = modalMock;
  });

  describe('Method: onConfirmButton ', function () {
    it('should call service', function () {
      component.onConfirmButton();
      expect(listService.removeItemMultipleLists).toHaveBeenCalled();
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
