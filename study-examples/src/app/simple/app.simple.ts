import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-simple',
  templateUrl: './app.simple.html',
  // template -> not used because requires html code here
  styleUrls: ['./app.simple.css']
})
export class SimpleComponent implements OnInit {

  // tslint:disable-next-line:no-inferrable-types
  // tslint:disable-next-line:no-inferrable-types
  inputData: string = 'Hello';
  // tslint:disable-next-line:no-inferrable-types
  mainMessage: string = 'Blank';
  // tslint:disable-next-line:no-inferrable-types
  counter: number = 0;

  // receiving routing
  constructor(private route: ActivatedRoute, private location: Location) {}

  ngOnInit(): void {
    this.route.params.forEach((params: Params)=>{
      this.mainMessage = params['param']; //put + in front to number
    });
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
