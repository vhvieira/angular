import { Component, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { ModalOptions, ModalDirective } from 'ngx-bootstrap';
import { Logger } from '@mastercard/ng-commons';
import { AddPanConfirmationModalComponent } from './add-pan-confirmation-modal/add-pan-confirmation-modal.component';
import * as CONFIG from '../../../constants';
import * as momentNS from 'moment';
import { UdtList, ListResponseCode } from '../data/list-request-body';
import { CSListService } from '../cs-lists.service';
import { ToastrService } from '@mc-fraud-center/commons';

const moment = momentNS;

@Component({
  selector: 'cs-add-pan-modal',
  templateUrl: './add-pan-modal.component.html',
  styleUrls: ['./add-pan-modal.component.scss']
})
export class AddPanModalComponent {

  @ViewChild(ModalDirective) modal: ModalDirective;
  @ViewChild(AddPanConfirmationModalComponent) confirmationModal: AddPanConfirmationModalComponent;
  @Output() panAdded = new EventEmitter<UdtList[]>();

  @Input() lists: UdtList[] = [];
  @Input() pan: string;
  endTime: Date = new Date();
  startDate: Date = new Date();
  endDate: Date | string = '';

  requestStartDate: Date;
  requestEndDate: Date;

  confirmationStartDate: string;
  confirmationEndDate: string;

  DISPLAY_DATE_FORMAT = CONFIG.ADD_PAN_DISPLAY_DATE_FORMAT;

  datepickerClasses = 'form-control input-standard icon-calendar';
  endDatepickerClasses = this.datepickerClasses;

  endTimeFlag = true;

  config: ModalOptions = {
    backdrop: 'static',
    show: false,
    keyboard: false,
  };

  constructor(private logger: Logger, private listService: CSListService, private toastr: ToastrService) {
      this.logger.debug('Add pan component initialized');
  }

  show(): void {
    this.logger.debug('Showing Add Pan Modal');
    this.startDate = new Date();
    this.startDate.setSeconds(0);
    this.setDefaultValues();
    this.modal.show();
  }

  onCancelButton(): void {
    this.modal.hide();
    this.endTimeFlag = true;
  }
  getListsNames() {
    let names = '';
    const maxIndex = this.lists.length - 1;
    this.lists.forEach((list, index) => {
      const listName = list.tableName;
      if (index < maxIndex) {
        names = names + listName + ', ';
      } else {
        names = names + listName;
      }
    });
    return names;
  }
  onAddButton(): void {
    this.modal.hide();
    this.setConfirmationDates();
    this.confirmationModal.listNames = this.getListsNames();
    this.confirmationModal.show();
    this.endTimeFlag = true;
  }

  setConfirmationDates(): void {
    this.confirmationStartDate = this.formatConfirmationDate(this.startDate);
    if (this.endDate instanceof Date) {
      this.confirmationEndDate = this.formatConfirmationDate(this.endDate);
    } else {
      this.endDate = CONFIG.DEFAULT_END_DATE;
      this.confirmationEndDate = this.formatConfirmationDate(this.endDate);
    }
    this.endDate.setSeconds(59);
  }

  formatConfirmationDate(date: Date): string {
    return moment(date).format(CONFIG.ADD_PAN_DISPLAY_DATE_FORMAT);
  }

  setDefaultValues(): void {
    this.endDate = '';
  }

  isStartDateGreaterThanEndDate(): boolean {
    if (this.endDate && this.startDate > this.endDate) {
      return true;
    }
    return false;
  }

  changedData(): void {
    if (this.endDate instanceof Date && this.endTimeFlag) {
      this.endDate.setHours(23, 59, 59);
      this.endTimeFlag = false;
    }
    if (this.isStartDateGreaterThanEndDate()) {
      this.endDatepickerClasses = 'form-control input-standard icon-calendar input-error-icon';
    } else {
      this.endDatepickerClasses = this.datepickerClasses;
    }
  }

  setRequestDates(): void {
    this.requestStartDate = this.startDate;
    if (this.endDate instanceof Date) {
      this.requestEndDate = this.endDate;
    } else {
      this.requestEndDate = CONFIG.DEFAULT_END_DATE;
    }
  }

  addPanToSelectedList(): void {
    this.listService.addItemMultipleLists(
      this.lists,
      this.pan,
      this.startDate,
      this.endDate
    ).subscribe( response => {
      const ids = this.lists.map(list => list.id);
      this.listService.auditPost(ids, 1).subscribe(res => {
        this.logger.debug('res auditPost', res);
      });

      if (response.code === ListResponseCode.SUCCESS)
        this.toastr.success('MODAL.ADD.SUCCESS');
      if (response.code === ListResponseCode.PARTIAL_ERROR)
        this.toastr.warning('MODAL.ADD.PARTIAL');
      if (response.code === ListResponseCode.FULL_ERROR)
        this.toastr.error('MODAL.ADD.ERROR');
      this.panAdded.emit(this.lists);
    });
  }

}
