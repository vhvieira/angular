import { Component, OnInit, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import { ModalOptions, ModalDirective } from 'ngx-bootstrap';
import { Logger } from '@mastercard/ng-commons';
import { ListResponseCode,
        UdtList,  } from '../data/list-request-body';
import { CSListService } from '../cs-lists.service';
import * as CONFIG from '../../../constants';
import { ToastrService } from '@mc-fraud-center/commons';

@Component({
  selector: 'cs-rem-pan-modal',
  templateUrl: './rem-pan-modal.component.html',
  styleUrls: ['./rem-pan-modal.component.scss']
})
export class RemovePanModalComponent implements OnInit {

  @ViewChild(ModalDirective) modal: ModalDirective;
  @Output() panRemoved = new EventEmitter<UdtList[]>();

  @Input() lists: UdtList[] = [];
  @Input() pan: string;

  config: ModalOptions = {
    backdrop: 'static',
    show: false,
    keyboard: false,
  };

  constructor(private logger: Logger, private listService: CSListService, private toastr: ToastrService) {
    this.logger.debug('Remove pan component initialized');
  }

  ngOnInit() {
    this.logger.debug('Opened modal for removing pan ' + this.pan + ' from lists: ' + this.lists);
  }

  show(): void {
    this.logger.debug('Showing Add Pan Modal');
    this.modal.show();
  }

  onCancelButton(): void {
    this.modal.hide();
  }

  onConfirmButton(): void {
    this.modal.hide();
    this.logger.debug('PAN has been removed from the list(s)');
    this.removePanFromSelectedList();
  }

  private removePanFromSelectedList(): void {
    this.logger.debug('callRemPanService with lists: ' + this.lists);
    this.callRemPanService();
    this.modal.hide();
  }

  private callRemPanService(): void {
    this.logger.debug('callRemPanService');
    this.listService.removeItemMultipleLists(this.lists,
        this.pan, new Date(), CONFIG.DEFAULT_END_DATE).subscribe( response => {
      const ids = this.lists.map(list => list.UserDefinedTableResponse.id);
      this.listService.auditPost(ids, 3).subscribe(res => {
        this.logger.debug('res auditPost', res);
      });

      if (response.code === ListResponseCode.SUCCESS)
        this.toastr.success('MODAL.REMOVE.SUCCESS');
      if (response.code === ListResponseCode.PARTIAL_ERROR)
        this.toastr.warning('MODAL.REMOVE.PARTIAL');
      if (response.code === ListResponseCode.FULL_ERROR)
        this.toastr.error('MODAL.REMOVE.ERROR');
      this.panRemoved.emit(this.lists);
    });
  }
}
