import { Component } from '@angular/core';

// tslint:disabl:no-inferrable-types
// tslint:disable:quotemark
  // tslint:disable:component-selector
@Component({
  selector: 'my-emp',
  templateUrl: './employees.component.html',
  // template -> not used because requires html code here
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent {
  // tslint:disable-next-line:no-inferrable-types
  title: string = 'Employees List';
  todayDate: Date = new Date();
  employees: any[] = [
    {
      "empId": 1,
      "name" : "Jeremy",
      "birthday" : "12/30/1979",
      "location" : "STL - US"
    }
  ];

}
