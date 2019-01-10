import { AddPanModalComponent } from './add-pan-modal.component';
import { ModalDirective } from 'ngx-bootstrap';
import { AddPanConfirmationModalComponent } from './add-pan-confirmation-modal/add-pan-confirmation-modal.component';

describe('AddPanModalComponent', function () {
  let loggerMock: any;
  let listService: any;
  let listServiceResp: any;
  let component: AddPanModalComponent;
  let modalMock: ModalDirective;
  let modalConfirmationMock: AddPanConfirmationModalComponent;
  let toastrMock;
  beforeEach(function () {
    loggerMock = jasmine.createSpyObj(['debug', 'info']);
    modalMock = jasmine.createSpyObj(['show', 'hide']);
    modalConfirmationMock = jasmine.createSpyObj(['show', 'hide']);
    listServiceResp = jasmine.createSpyObj(['subscribe']);
    listService = {
      addItemMultipleLists: jasmine.createSpy('addItemMultipleLists').and.returnValue(listServiceResp),
      auditPost: jasmine.createSpy('auditPost').and.returnValue(listServiceResp)
    };
    toastrMock = {
      success: jasmine.createSpy('success')
    } as any;
    component = new AddPanModalComponent(loggerMock, listService, toastrMock);
    component.modal = modalMock;
    component.confirmationModal = modalConfirmationMock;
  });

  describe('Method: onAddButton ', function () {
    it('should call service', function () {
      component.onAddButton();
      expect(modalMock.hide).toHaveBeenCalled();
      expect(modalConfirmationMock.show).toHaveBeenCalled();
    });
  });

  describe('Method: onCancelButton ', function () {
    it('should show the close modal', function () {
      component.onCancelButton();
      expect(modalMock.hide).toHaveBeenCalled();
    });
  });

  describe('Method: addPanToSelectedList ', function () {
    it('should call service', function () {
      component.startDate = new Date();
      component.setRequestDates();
      component.addPanToSelectedList();
      expect(listService.addItemMultipleLists).toHaveBeenCalled();
    });
  });

  describe('Method: show ', function () {
    it('should show show modal', function () {
      component.show();
      expect(loggerMock.debug).toHaveBeenCalled();
      expect(modalMock.show).toHaveBeenCalled();
    });
  });

  describe('Method: isEndDateGreaterThanStartDate ', function () {
    it('should be true', function () {
      component.startDate = new Date('12/31/2099');
      component.endDate = new Date();
      const result = component.isStartDateGreaterThanEndDate();
      expect(result).toBeTruthy();
    });
    it('should be false', function () {
      component.startDate = new Date();
      component.endDate = new Date('12/31/2099');
      const result = component.isStartDateGreaterThanEndDate();
      expect(result).toBeFalsy();
    });
  });

  describe('Method: changedData ', function () {
    it('should be invalid', function () {
      component.startDate = new Date('12/31/2099');
      component.endDate = new Date();
      component.changedData();
      expect(component.endDatepickerClasses).toEqual('form-control input-standard icon-calendar input-error-icon');
    });
    it('should be valid', function () {
      component.startDate = new Date();
      component.endDate = new Date('12/31/2099');
      component.changedData();
      expect(component.endDatepickerClasses).toEqual(component.datepickerClasses);
    });
  });

  describe('Method: setRequestDates ', function () {
    it('passing end date', function () {
      component.startDate = new Date();
      component.endDate = new Date('01/01/2099');
      component.setRequestDates();
      expect(component.requestStartDate).toBeDefined();
      expect(component.requestEndDate).toBeDefined();
    });
    it('Using default end date', function () {
      component.startDate = new Date();
      component.setRequestDates();
      expect(component.requestStartDate).toBeDefined();
      expect(component.requestEndDate).toBeDefined();
    });
  });
});
