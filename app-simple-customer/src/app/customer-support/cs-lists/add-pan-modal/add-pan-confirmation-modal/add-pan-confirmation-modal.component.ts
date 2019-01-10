import { Component, ViewChild, Output, Input, EventEmitter } from '@angular/core';
import { ModalDirective, ModalOptions } from 'ngx-bootstrap';
import { Logger } from '@mastercard/ng-commons';

@Component({
  selector: 'cs-add-pan-confirmation-modal',
  templateUrl: './add-pan-confirmation-modal.component.html',
  styleUrls: ['./add-pan-confirmation-modal.component.scss']
})
export class AddPanConfirmationModalComponent {

  @ViewChild(ModalDirective) modal: ModalDirective;
  @Input() pan: string;
  @Input() listNames: string;
  @Input() startDate: string;
  @Input() endDate: string;
  @Output() cancelled = new EventEmitter<void>();
  @Output() confirmed = new EventEmitter<void>();

  config: ModalOptions = {
    backdrop: 'static',
    show: false,
    keyboard: false,
  };

  constructor(
    private logger: Logger
  ) { }

  show() {
    this.logger.debug('Showing confirmation modal');
    this.modal.show();
  }

  onSecondaryButton() {
    this.logger.debug('Secondary button clicked');
    this.cancelled.emit();
    this.modal.hide();
  }

  onPrimaryButton() {
    this.logger.debug('Primary button clicked');
    this.confirmed.emit();
    this.modal.hide();
  }
}
