import { FormControl } from '@angular/forms';
// tslint:disable:quotemark
export class AlineValidator {
  static validName(fc: FormControl) {
    if (fc.value === null || fc.value === '' ) {
      return (null);
    }
    if (fc.value.toLowerCase() === 'victor' || fc.value.toLowerCase() === 'victor hugo'
    || fc.value.toLowerCase() === 'victor hugo rodrigues'
    || fc.value.toLowerCase() === 'victor hugo vieira'
    || fc.value.toLowerCase() === 'victor hugo rodrigues vieira'  ) {
      console.log('OK');
      return (null);
    } else {
      console.log('NOK');
      return ({validName: true});
    }
  }
}
