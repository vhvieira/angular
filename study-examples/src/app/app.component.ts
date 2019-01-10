import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  // template -> not used because requires html code here
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // tslint:disable-next-line:no-inferrable-types
  title: string = 'FrontEnd para contratação de empréstimo';
  // tslint:disable-next-line:no-inferrable-types
  inputData: string = 'Hello';
  // tslint:disable-next-line:no-inferrable-types
  mainMessage: string = 'Blank';
  // tslint:disable-next-line:no-inferrable-types
  counter: number = 0;

  getTitle(): String {
    return 'AngularJS';
  }

  isHidden(): Boolean {
    return false;
  }

  incrementCounter(): void {
    this.counter++;
  }

  setInputData(newValue: string) {
    this.inputData = newValue;
  }

  setUpperCaseMessage(event: any) {
    this.mainMessage = event.toUpperCase();
  }
}
