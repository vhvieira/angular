import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';

// tslint:disabl:no-inferrable-types
// tslint:disable:quotemark
// tslint:disable:component-selector
// tslint:disable:variable-name
// tslint:disable:no-inferrable-types

@Component({
  selector: 'transaction-header',
  templateUrl: './transactionheader-form.html',
  styleUrls: ['./transactionheader.css']
})
export class TransactionHeaderComponent {
  fb: FormBuilder = new FormBuilder();
  searchingFlag: boolean = false;

  validation_messages =  {
    callerUserId: [
      { type: 'required', message: 'Value is required' },
      { type: 'maxlength', message: 'Value cannot exceed 7 characters' },
      { type: 'pattern', message: 'Value must be alphanumeric' }
    ],
    callerFirstName: [
      { type: 'required', message: 'Value is required' },
      { type: 'maxlength', message: 'Value cannot exceed 25 characters' },
      { type: 'pattern', message: 'Value must be alphabetic' }
    ],
    callerLastName: [
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
  };

  transactionHeaderForm = this.fb.group({
    callerUserId: new FormControl('',
    Validators.compose([
      Validators.required,
      Validators.maxLength(7),
      Validators.pattern('^[a-zA-Z0-9_.+-]+$')
    ])),
    callerFirstName: new FormControl('',
    Validators.compose([
      Validators.required,
      Validators.maxLength(25),
      Validators.pattern('^[a-zA-Z_.+-]+$')
    ])),
    callerLastName: new FormControl('',
    Validators.compose([
      Validators.required,
      Validators.maxLength(25),
      Validators.pattern('^[a-zA-Z_.+-]+$')
    ])),
    ticketNumber: new FormControl('',
    Validators.compose([
      Validators.required,
      Validators.maxLength(50),
      Validators.pattern('^[a-zA-Z0-9_.+-]+$')
    ])),
    comments: new FormControl('',
    Validators.compose([
      Validators.required,
      Validators.maxLength(200)
    ])),
    searchType: new FormControl(),
  });

  onSubmitForm(form: any) {
    this.searchingFlag = true;
    this.transactionHeaderForm.controls.callerUserId.disable();
    this.transactionHeaderForm.controls.callerFirstName.disable();
    this.transactionHeaderForm.controls.callerLastName.disable();
  }

  onResetButton(form: any) {
    this.searchingFlag = false;
    this.transactionHeaderForm.controls.callerUserId.enable();
    this.transactionHeaderForm.controls.callerFirstName.enable();
    this.transactionHeaderForm.controls.callerLastName.enable();
    // clean data
    this.transactionHeaderForm.controls.callerUserId.reset();
    this.transactionHeaderForm.controls.callerFirstName.reset();
    this.transactionHeaderForm.controls.callerLastName.reset();
    this.transactionHeaderForm.controls.ticketNumber.reset();
    this.transactionHeaderForm.controls.comments.reset();
  }

  canPerformSearch() {
    if (this.transactionHeaderForm.valid && !this.searchingFlag ) {
      return (null);
    } else {
      return "disabled";
    }
  }

  canReset() {
    if ( this.searchingFlag ) {
      return (null);
    } else {
      return "disabled";
    }
  }
}
