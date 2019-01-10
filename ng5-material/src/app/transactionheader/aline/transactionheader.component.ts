import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AlineValidator } from './aline.validator';
import { ValidationMessages } from './validation.messages';
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
    'fullname': [
      { type: 'required', message: 'Username is required' },
      { type: 'minlength', message: 'Username must be at least 5 characters long' },
      { type: 'maxlength', message: 'Username cannot be more than 25 characters long' },
      { type: 'pattern', message: 'Your username must contain only numbers and letters' },
      { type: 'validUsername', message: 'Your username has already been taken' }
    ],
    'email': [
      { type: 'required', message: 'Name is required' },
      { type: 'pattern', message: 'Enter a valid name' },
      { type: 'validName', message: 'Wrong name entered' }
    ],
    'confirm_password': [
      { type: 'required', message: 'Confirm password is required' },
      { type: 'areEqual', message: 'Password mismatch' }
    ],
    'password': [
      { type: 'required', message: 'Password is required' },
      { type: 'minlength', message: 'Password must be at least 5 characters long' },
      { type: 'pattern', message: 'Your password must contain at least one uppercase, one lowercase, and one number' }
    ]
  };

  userDetailsForm = this.fb.group({
    email: new FormControl('',
    Validators.compose([
      Validators.required,
      AlineValidator.validName
    ])),
    // more form inputs
  });

  /*
  userDetailsForm = this.fb.group({
    email: new FormControl('',
    Validators.compose([
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
    ])),
    // more form inputs
  });
  */


  //on blur example
/*  email: FormControl = new FormControl(null, {
    validators: Validators.required,
    updateOn: 'blur'
  });
*/

  // New validations example
  /*
    this.validations_form = this.formBuilder.group({
    username: new FormControl('', Validators.compose([
      UsernameValidator.validUsername,
      Validators.maxLength(25),
      Validators.minLength(5),
      Validators.pattern('^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$'),
      Validators.required
    ])),
  })
 */
  onSubmitForm(form: FormGroup) {
    console.log('form: ' + form);
    alert('I love you too!');
  }
}
