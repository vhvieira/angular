import { FormControl } from '@angular/forms';
// tslint:disable:quotemark
export class ValidationMessages {
  static getMessages() {
    return (
      {
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
      }
    );
  }
}
