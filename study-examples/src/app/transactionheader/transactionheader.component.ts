import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';

// tslint:disabl:no-inferrable-types
// tslint:disable:quotemark
// tslint:disable:component-selector
@Component({
  selector: 'transaction-header',
  templateUrl: './transactionheader-form.html',
  // template -> not used because requires html code here
  styleUrls: ['./transactionheader.css']
})
export class TransactionHeaderComponent {
  // tslint:disable:no-inferrable-types
  answer: string = '';
  answerDisplay: string = '';
  showSpinner: boolean = false;
  title: string = 'Form Validation Test Component';
  todayDate: Date = new Date();
  fb: FormBuilder = new FormBuilder();
  accountDetailsForm: FormGroup = this.fb.group({
    email: new FormControl('', Validators.compose([
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
    ])),
    // more form inputs
  });


  showAnswer() {
    this.showSpinner = true;

    setTimeout(() => {
      this.answerDisplay = this.answer;
      this.showSpinner = false;
    }, 2000);
  }
}
