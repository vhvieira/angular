import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

// tslint:disabl:no-inferrable-types
// tslint:disable:quotemark
// tslint:disable:component-selector
@Component({
  selector: 'transaction-header',
  templateUrl: './transactionheader-form.html',
  // template -> not used because requires html code here
  styleUrls: ['./transactionheader.css']
})
export class TransactionHeaderComponent implements OnInit {

  // receiving routing
  constructor(private route: ActivatedRoute, private location: Location) {}
  
  // getting parameter
  ngOnInit(): void {
    this.route.params.forEach((params: Params)=>{
      this.answer = params['pan']; //put + in front to number
    }); 
  }

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

  back() {
    this.location.back();
  }

  showAnswer() {
    this.showSpinner = true;

    setTimeout(() => {
      this.answerDisplay = this.answer;
      this.showSpinner = false;
    }, 2000);
  }
}
