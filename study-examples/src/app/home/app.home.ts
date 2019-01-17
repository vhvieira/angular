import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.home.html',
  // template -> not used because requires html code here
  styleUrls: ['./app.home.css']
})
export class HomeComponent {
  // tslint:disable-next-line:no-inferrable-types
  title: string = 'My FrontEnd Testing Project';

  getTitle(): String {
    return 'Angular Version 6';
  }
}
