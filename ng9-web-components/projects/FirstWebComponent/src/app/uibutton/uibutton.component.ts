import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ui-button',
  templateUrl: './uibutton.component.html',
  styleUrls: ['./uibutton.component.css']
})
export class UIButtonComponent {
  
  @Input() 
  shouldCountClicks:boolean = false;
}
