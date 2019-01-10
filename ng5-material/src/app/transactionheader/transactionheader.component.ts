import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
// tslint:disabl:no-inferrable-types
// tslint:disable:quotemark
// tslint:disable:component-selector
@Component({
  selector: 'transaction-header',
  templateUrl: './transactionheader-form.html',
  styleUrls: ['./transactionheader.css']
})
export class TransactionHeaderComponent {
  // tslint:disable:no-inferrable-types
  title: string = 'Form Validation Test Component';
  todayDate: Date = new Date();
  fb: FormBuilder = new FormBuilder();
  username: string = '';

  validation_messages =  {
    'callerUserId': [
      { type: 'required', message: 'Value is required' },
      { type: 'maxlength', message: 'Value cannot exceed 7 characters' },
      { type: 'pattern', message: 'Value must be alphanumeric' }
    ],
    'callerFirstName': [
      { type: 'required', message: 'Value is required' },
      { type: 'maxlength', message: 'Value cannot exceed 25 characters' },
      { type: 'pattern', message: 'Value must be alphabetic' }
    ],
    'callerLastName': [
      { type: 'required', message: 'Value is required' },
      { type: 'maxlength', message: 'Value cannot exceed 25 characters' },
      { type: 'pattern', message: 'Value must be alphabetic' }
    ],
    'ticketNumber': [
      { type: 'required', message: 'Value is required' },
      { type: 'maxlength', message: 'Value cannot exceed 50 characters' },
      { type: 'pattern', message: 'Value must be alphanumeric' }
    ],
    'comments': [
      { type: 'required', message: 'Value is required' },
      { type: 'maxlength', message: 'Value cannot exceed 200 characters' }
    ],
    'search': [
      { type: 'required', message: 'Value is required' },
      { type: 'maxlength', message: 'Value cannot exceed 19 characters' }
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
    search: new FormControl('',
    Validators.compose([
      Validators.required,
      Validators.maxLength(19)
    ]))
  });

  onSubmitForm(form: FormGroup) {
    alert('To be implemented!');
  }

  onResetButton(form: FormGroup) {
    alert('To be implemented!');
  }
}
