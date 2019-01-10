import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  Logger,
  LOCALE,
  MessageService,
} from '@mastercard/ng-commons';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PermissionsService, Action, PreventNavigationService } from '@mc-fraud-center/commons';
import { NAVIGATE_MSG_KEY, SELECT_TAB_MSG_KEY } from '../app/constants';
import * as _ from 'lodash';

import { takeWhile, filter, mergeMap, take, map } from 'rxjs/operators';

/*
 * Top Level Component
 */
@Component({
  selector: 'cs-app',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  alive = true;

  constructor(
    private translate: TranslateService,
    private auth: PermissionsService,
    private logger: Logger,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private preventNavigation: PreventNavigationService,
  ) {
    // empty
  }

  ngOnInit() {
    this.logger.debug('AppComponent ngOnInit.');
    this.addPermissionsListener();
    this.addLocaleListener();
    this.addMessageListener();
    this.addQueryListener();
    this.preventNavigation.start();
  }

  ngOnDestroy() {
    this.alive = false;
  }

  addPermissionsListener() {
    this.auth.init();
    this.auth.availableActions.pipe(
      takeWhile(() => this.alive),
    ).subscribe(
      (actions: Action[]) => this.logger.debug('available actions', actions),
      (err: any) => this.logger.error(err),
    );
  }

  addLocaleListener() {
    this.translate.setDefaultLang(LOCALE.DEFAULT);
  }

  addMessageListener() {
    let action: any;
    this.messageService.get().pipe(
      takeWhile(() => this.alive),
      filter(incoming => incoming.data.message === NAVIGATE_MSG_KEY),
      mergeMap(incoming => {
        let fragment: string = incoming.data.content.action.targetArgs[0];
        fragment = fragment.replace('apps/customer-support', '');
        const destination = this.router.parseUrl('/' + fragment);
        return this.route.queryParams.pipe(
          take(1),
          filter(from => ! _.isEqual(from, destination.queryParams)),
          map(from => {
            this.logger.debug('Navigation message received. From:', from, 'to:', destination.queryParams);
            action = incoming.data.content.action;
            return destination;
          }),
        );
      }),
    ).subscribe(url => {
      this.router.navigateByUrl(url).then(
        ok => {
          if (ok) {
            const message = { action, message: SELECT_TAB_MSG_KEY };
            this.logger.debug('Asking shell to select tab', action.code);
            this.messageService.post(message);
          }
        }
      );
    });
  }

  addQueryListener() {
    this.route.queryParams.pipe(
      filter(params => params.tab),
      takeWhile(() => this.alive),
    ).subscribe(params => {
      this.logger.debug('AppComponent addQueryListener subscribe', params);
      const commands = ['./', params.tab];
      this.logger.debug('initial navigation');
      this.router.navigate(commands);
    });
  }

}
