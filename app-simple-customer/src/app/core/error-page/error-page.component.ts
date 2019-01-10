import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'cs-mc-error',
  templateUrl: 'error-page.component.html'
})

export class MCErrorComponent implements OnInit {
  error: { code: string, text: string } | undefined;
  constructor(
    private route: ActivatedRoute,
    private location: Location
  ) {
    //  .
  }

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        this.error = { code: params.code, text: params.description };
      });

  }

  goBack() {
    this.location.back();
  }
}
