import { TranslateService } from '@ngx-translate/core';
import { AppComponent } from './app.component';
import { PermissionsService } from '@mc-fraud-center/commons';
import { Logger, MessageService } from '@mastercard/ng-commons';
import { Router, ActivatedRoute } from '@angular/router';

import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';

describe('App Component', function () {

  let component: AppComponent;

  let translate: TranslateService;
  let auth: PermissionsService;
  let logger: Logger;
  let router: Router;
  let route: ActivatedRoute;
  let message: MessageService;

  function mockRoute(vip: 'true' | 'false'): ActivatedRoute {
    return {
      queryParams: of({ vip }),
    } as any;
  }

  function mockMessageService(vip: 'true' | 'false'): MessageService {
    return { get: () => of({
      data: {
        message: 'navigation',
        content: { action: { targetArgs: [ 'apps/customer-support?vip=' + vip ] } },
      },
    }) } as any;
  }
  let preventNavigation: {
    isSafeToQuit: boolean;
    start: jasmine.Spy;
    showConfirmationDialog: jasmine.Spy;
    confirmationDialogClosed: jasmine.Spy;
  };

  beforeEach(function () {
    auth = {
      init: jasmine.createSpy('init'),
      availableActions: of('pt-BR'),
    } as any;
    logger = jasmine.createSpyObj('logger', ['debug', 'info', 'warn', 'error']);
    translate = jasmine.createSpyObj('translate', [
      'addLangs', 'setDefaultLang'
    ]);
    router = jasmine.createSpyObj('router', ['parseUrl', 'navigateByUrl', 'navigate']);
    preventNavigation = {
      isSafeToQuit: true,
      start: jasmine.createSpy('start'),
      showConfirmationDialog: jasmine.createSpy('showConfirmationDialog'),
      confirmationDialogClosed: jasmine.createSpy('confirmationDialogClosed'),
    };

    const vip = 'true';
    route = mockRoute(vip);
    message = mockMessageService(vip);

  });
  describe('Lifecycle methods ', () => {
    beforeEach(() => {
      component = new AppComponent(translate, auth, logger, router, route, message, preventNavigation as any);
    });
    it('should setup default lang on init', function () {
      component.ngOnInit();
      expect(translate.setDefaultLang).toHaveBeenCalled();
      expect(auth.init).toHaveBeenCalled();
    });

    it('should destroy the component', function () {
      component.ngOnDestroy();
      expect(component.alive).toBeFalsy();
    });
  });

  describe('Login Error scenario ', () => {
    it('should log if any errors on auth.availableActions ', function () {
      const badAuth = {
        init: jasmine.createSpy('init'),
        availableActions: _throw('my Error')
      } as any;
      const errorComponent = new AppComponent(translate, badAuth, logger, router, route, message,
        preventNavigation as any);
      errorComponent.ngOnInit();
      expect(logger.error).toHaveBeenCalledWith('my Error');
    });
  });

  describe('Method: addMessageListener', () => {
    let myRouter: any;
    let testMessageServiceAction: any;
    let testMessage: any;
    beforeEach(() => {

      function testMessageService(vip: 'true' | 'false'): MessageService {
        testMessageServiceAction = {
          targetArgs: [ 'apps/customer-support?vip=' + vip ]
        };

        return {
          get: () => of({
            data: {
              message: 'navigate',
              content: {
                action: testMessageServiceAction
              },
            },
        }),
          post: (msg: any) => {
            return msg;
          }
      } as any;
      }
      myRouter = (isTrue: boolean) => {
          return {
            parseUrl: () => {
              return { destination: { queryParams: 'oi' } };
            },
            navigateByUrl: (_: string) => {
              return {
                then: (cb: any) => {
                  // do nothing
                  return cb(isTrue);
                }
              };
            },
            navigate: (obj: any) => {
              return obj;
            }
          } as any as Router;
      };

      testMessage = testMessageService('true');
      // component.alive = true;
      component = new AppComponent(
        translate,
        auth,
        logger,
        myRouter(true),
        route,
        testMessage,
        preventNavigation as any
      );
    });

    it('should post if navigateByURL is ok', () => {
      const spyNavigateByUrl = spyOn(myRouter(), 'navigateByUrl');
      const spyMsgPost = jasmine.createSpy(testMessage.post);
      component.addMessageListener();
      setTimeout(1000, () => {
        expect(spyNavigateByUrl).toHaveBeenCalled();

        const messageExample = { testMessageServiceAction, message: 'SELECT_TAB' };
        expect(spyMsgPost).toHaveBeenCalledWith(messageExample);
      });
    });

    it('should NOT post if navigateByURL is NOT ok', () => {
      const routerErrorComponent = new AppComponent(
        translate,
        auth,
        logger,
        myRouter(false),
        route,
        testMessage,
        preventNavigation as any
      );

      const spyNavigateByUrl = spyOn(myRouter(), 'navigateByUrl');
      routerErrorComponent.addMessageListener();
      setTimeout(1000, () => {
        expect(spyNavigateByUrl).not.toHaveBeenCalled();
      });
    });

  });

  describe('Method: addQueryListener', function () {
    let queryChangingRoute: any;
    beforeEach(() => {

      queryChangingRoute = (params?: any): ActivatedRoute => {
        return {
          queryParams: { pipe: () => of(params) },
        } as any;
      };

      // component.alive = true;
      component = new AppComponent(
        translate,
        auth,
        logger,
        router,
        queryChangingRoute({tab: 'transactions'}),
        message,
        preventNavigation as any
      );
    });
    it('should call router.navigate to the received tab IF app is alive', () => {
      component.addQueryListener();
      expect(router.navigate).toHaveBeenCalled();
    });
    it('should call router.navigate with skipLocationChange if tab is transactions', () => {
      const commands = ['./', 'transactions'];
      component.addQueryListener();
      expect(router.navigate).toHaveBeenCalledWith(commands, { skipLocationChange: true });
    });
    it('should call router.navigate with skipLocationChange FALSE if tab is NOT transactions', () => {
      const commands = ['./', 'lists'];
      const componentWithLists = new AppComponent(
        translate,
        auth,
        logger,
        router,
        queryChangingRoute({tab: 'lists'}),
        message,
        preventNavigation as any
      );
      componentWithLists.addQueryListener();
      expect(router.navigate).toHaveBeenCalledWith(commands, { skipLocationChange: false });
    });

  });
});
