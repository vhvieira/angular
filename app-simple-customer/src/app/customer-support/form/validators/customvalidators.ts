import { AbstractControl, ValidationErrors, Validators, FormControl } from '@angular/forms';

export class CsCustomValidator  {

  static required(control: AbstractControl): ValidationErrors | null {
    if (control != null && control.value != null && control.value !== '') {
        return CsCustomValidator.trimSpace(control);
    } else {
      return Validators.required(control);
    }
  }

  static trimSpace(control: AbstractControl) {
    // temp obj to not erase form field while typing
    const temp = new FormControl('temp');
    const valueTrimmed = control.value.replace(/^\s+|\s+$/g, '');
    temp.setValue(valueTrimmed);
    return Validators.required(temp);
  }

}
