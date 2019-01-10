import { Component, OnInit, Output, Input, EventEmitter, Renderer } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ValidationErrors } from '@angular/forms';
import { Logger } from '@mastercard/ng-commons';
import { CsCustomValidator  } from './validators/customvalidators';
import { CsTransactionsFormService } from './cs-transactions-form.service';
import * as CONFIG from '../../constants';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'cs-transactions-form',
  templateUrl: './cs-transactions-form.component.html',
  styleUrls: ['./cs-transactions-form.component.scss']
})
export class CsTransactionsFormComponent implements OnInit {

  searchingFlag = false;
  transactionForm: FormGroup;
  nameChangeLog: string[] = [];
  searchTypeValues: string[] =  [
    CONFIG.SEARCH_TYPE.PAN,
    CONFIG.SEARCH_TYPE.TRANSACTION_ID
  ];

  @Output() searchEvent: EventEmitter<FormGroup> = new EventEmitter();
  @Output() addButtonEmitter = new EventEmitter<boolean>();
  @Output() remButtonEmitter = new EventEmitter<boolean>();
  @Output() newInquiryEvent = new EventEmitter();

  @Input() url: string;
  @Input() ica: number;
  @Input() institutionName: string;
  @Input() isReadonly: boolean;
  @Input() disableRemovePanButton: boolean; // TODO type it
  @Input() disableAddPanButton: boolean; // TODO type it

  validationMessages =  {
    userId: [
      { type: 'required', message: 'Value is required' },
      { type: 'maxlength', message: 'Value cannot exceed 7 characters' },
      { type: 'pattern', message: 'Value must be alphanumeric' }
    ],
    firstName: [
      { type: 'required', message: 'Value is required' },
      { type: 'maxlength', message: 'Value cannot exceed 25 characters' },
      { type: 'pattern', message: 'Value must be alphabetic' }
    ],
    lastName: [
      { type: 'required', message: 'Value is required' },
      { type: 'maxlength', message: 'Value cannot exceed 25 characters' },
      { type: 'pattern', message: 'Value must be alphabetic' }
    ],
    ticketNumber: [
      { type: 'required', message: 'Value is required' },
      { type: 'maxlength', message: 'Value cannot exceed 50 characters' },
      { type: 'pattern', message: 'Value must be alphanumeric' }
    ],
    comments: [
      { type: 'required', message: 'Value is required' },
      { type: 'maxlength', message: 'Value cannot exceed 200 characters' }
    ],
    searchField: [
      { type: 'required', message: 'Value is required' },
      { type: 'maxlength', message: 'Value cannot exceed 19 characters' },
      { type: 'pattern', message: 'Value must be numeric' }
    ],
  };

  constructor(
    private fb: FormBuilder,
    private logger: Logger,
    private renderer: Renderer,
    private formService: CsTransactionsFormService,
    private route: ActivatedRoute
  ) {
      this.transactionForm = this.fb.group({ });
      this.route.url.subscribe(urlSegment => {
        // if for testing value in local EIB
        if (urlSegment[0])
          this.url = urlSegment[0].path;
        else
          this.url = 'lists';
        });
    }

  ngOnInit() {
    this.transactionForm = this.fb.group({
      userId: new FormControl('',
      Validators.compose([
         CsCustomValidator.required,
         Validators.maxLength(7),
         Validators.pattern('^[a-zA-Z0-9]+$')
      ])),
      firstName: new FormControl('',
      Validators.compose([
        CsCustomValidator.required,
        Validators.maxLength(25),
        Validators.pattern('^[a-zA-Z\\s]+$')
      ])),
      lastName: new FormControl('',
      Validators.compose([
        CsCustomValidator.required,
        Validators.maxLength(25),
        Validators.pattern('^[a-zA-Z\\s]+$')
      ])),
      ticketNumber: new FormControl('',
      Validators.compose([
        CsCustomValidator.required,
        Validators.maxLength(50),
        Validators.pattern('^[a-zA-Z0-9]+$')
      ])),
      comments: new FormControl('',
      Validators.compose([
        CsCustomValidator.required,
        Validators.maxLength(200)
      ])),
      searchField: new FormControl('',
      Validators.compose([
        CsCustomValidator.required,
        Validators.maxLength(19),
        Validators.pattern('^[0-9]+$')
      ])),
      searchType: new FormControl('',
      Validators.compose([
        Validators.required
      ])),
    });
    // sett its to default selection (first element)
    this.transactionForm.controls.searchType.setValue(this.searchTypeValues[0]);
    if (this.formService.auditInformation && this.formService.auditInformation.requestorFirstName) {
      this.populateForm();
    }
  }

  populateForm () {
    const values = this.formService.auditInformation;
    if (values && values.searchType) {
      this.transactionForm.controls['userId'].setValue(values.requestorUserId);
      this.transactionForm.controls['firstName'].setValue(values.requestorFirstName);
      this.transactionForm.controls['lastName'].setValue(values.requestorLastName);
      this.transactionForm.controls['comments'].setValue(values.comments);
      this.transactionForm.controls['ticketNumber'].setValue(values.ticketNumber);
      this.ica = parseInt(values.ica!, 10);
      this.institutionName = values.custName!;
      if (values!.searchType === '1') {
        this.transactionForm.controls['searchType'].setValue('1');
        this.transactionForm.controls['searchField'].setValue(values.pan);
      } else if (values!.searchType === '2') {
        this.transactionForm.controls['searchType'].setValue('2');
        this.transactionForm.controls['searchField'].setValue(values.processedTranId);
      }
    } else {
      this.logger.error('AuditInformation/Form data not found by formService');
    }

  }

  showError(fieldName: string, validation: ValidationErrors) {
    return ( this.transactionForm.get(fieldName)!.hasError(validation.type) &&
     (this.transactionForm.get(fieldName)!.dirty || this.transactionForm.get(fieldName)!.touched) );
  }

  hasError (fieldName: string) {
    return this.transactionForm.get(fieldName)!.invalid &&
    this.transactionForm.get(fieldName)!.touched;
  }

  trim (fieldName: string) {
    if (this.transactionForm.controls[fieldName] != null &&
      this.transactionForm.controls[fieldName].value != null) {
        this.transactionForm.controls[fieldName].setValue( this.transactionForm.controls[fieldName].value.trim() );
    }
  }

  canPerformSearch() {
    if (this.transactionForm.valid && !this.searchingFlag ) {
      return (null);
    } else {
      return 'disabled';
    }
  }

  canReset() {
    if ( this.searchingFlag ) {
      return (null);
    } else {
      return 'disabled';
    }
  }

  onSubmitForm() {
    if (!this.transactionForm.valid) {
      return;
    }
    this.logger.debug('Performing Search');
    this.disableFields();
    this.setAuditInformation();
    this.searchEvent.emit(this.transactionForm);
  }

  setAuditInformation() {
    const auditInformation = this.fieldsToAuditInformation(this.transactionForm);
    this.formService.setAuditInformation(auditInformation);
  }

  disableFields() {
    this.searchingFlag = true;
    this.transactionForm.controls.userId.disable();
    this.transactionForm.controls.firstName.disable();
    this.transactionForm.controls.lastName.disable();
    this.transactionForm.controls.searchType.disable();
    this.transactionForm.controls.searchField.disable();
  }

  enableFields() {
    this.searchingFlag = false;
    this.transactionForm.controls.userId.enable();
    this.transactionForm.controls.firstName.enable();
    this.transactionForm.controls.lastName.enable();
    this.transactionForm.controls.searchType.enable();
    this.transactionForm.controls.searchField.enable();
  }

  fieldsToAuditInformation (searchForm: FormGroup) {
    if (!searchForm.controls.searchType.value) {
      this.logger.error('No search type informed');
      throw new Error('No search type informed');
    }
    return {
      searchType: searchForm.controls.searchType.value,
      requestorUserId: searchForm.controls.userId.value,
      requestorFirstName: searchForm.controls.firstName.value,
      requestorLastName: searchForm.controls.lastName.value,
      comments: searchForm.controls.comments.value,
      ticketNumber: searchForm.controls.ticketNumber.value,
      customerSupportActionType: 'RESEARCH'
    };
  }
  isPopulated (_: string) {
    return this.formService.auditInformation && this.formService.auditInformation.pan;
  }

  resetForm() {
    this.logger.debug('Resetting Form');
    this.transactionForm.reset();
    this.formService.reset();
    this.enableFields();
  }

  onNewInquiry() {
    this.searchingFlag = false;
    this.resetForm();
    // focus
    const element = this.renderer.selectRootElement('[autofocus]');
    this.renderer.invokeElementMethod(element, 'focus', []);
    // sett its to default selection (first element)
    this.transactionForm.controls.searchType.setValue(this.searchTypeValues[0]);
    this.newInquiryEvent.emit();
   }

  trackByFn(index: number, _: ValidationErrors) {
    return index;
  }

  isUrl(url: string) {
      if (this.url === url)
        return true;
      else
        return false;
  }

  openAddModal(): void {
    this.addButtonEmitter.emit(true);
  }

  openRemModal(): void {
    this.remButtonEmitter.emit(true);
  }

}
