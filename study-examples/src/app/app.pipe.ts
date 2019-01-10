import {Pipe, PipeTransform} from '@angular/core';

// tslint:disable:prefer-const
export class EmployeeFilterPipe implements PipeTransform {
  transform(value: any, args: string) {
    console.log('value: ' + value);
    console.log('args:: ' + args);
    let filter = args ? args.toLowerCase : null;
    console.log('filter: ' + filter);
    return filter ? value.filter( (employee) => employee.name.toLowerCase.startsWith(filter) != null ) : value;
  }
}
