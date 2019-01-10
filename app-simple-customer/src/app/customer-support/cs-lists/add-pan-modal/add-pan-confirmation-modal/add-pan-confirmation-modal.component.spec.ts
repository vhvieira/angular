import { AddPanConfirmationModalComponent } from './add-pan-confirmation-modal.component';
import { EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';

describe('AddPanConfirmationModalComponent', function () {
  let loggerMock: any;
  let component: AddPanConfirmationModalComponent;
  let modalMock: ModalDirective;
  let confirmedMock = new EventEmitter<void>();
  let cancelledMock = new EventEmitter<void>();

  beforeEach(function () {
    loggerMock = jasmine.createSpyObj(['debug', 'info']);
    modalMock = jasmine.createSpyObj(['show', 'hide']);
    confirmedMock = jasmine.createSpyObj(['emit']);
    cancelledMock = jasmine.createSpyObj(['emit']);
    component = new AddPanConfirmationModalComponent(loggerMock);
    component.modal = modalMock;
    component.confirmed = confirmedMock;
    component.cancelled = cancelledMock;
  });

  describe('Method: onPrimaryButton ', function () {
    it('should emmit event', function () {
      component.onPrimaryButton();
      expect(modalMock.hide).toHaveBeenCalled();
      expect(confirmedMock.emit).toHaveBeenCalled();
    });
  });

  describe('Method: onCancelButton ', function () {
    it('should emmit event', function () {
      component.onSecondaryButton();
      expect(modalMock.hide).toHaveBeenCalled();
      expect(cancelledMock.emit).toHaveBeenCalled();
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
