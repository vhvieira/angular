import { goToErrorPage } from '.';

import { HttpError } from '@mc-fraud-center/commons';
import { Logger } from '@mastercard/ng-commons';
import { Router } from '@angular/router';

describe('goToErrorPage function', function() {

  let httpError: HttpError;
  let logger: Logger;
  let router: Router;

  beforeEach(function() {
    httpError = { status: 400, displayMessage: 'Bad Request' } as any;
    logger = jasmine.createSpyObj('logger', [ 'error' ]);
    router = jasmine.createSpyObj('router', [ 'navigate' ]);
  });

  it('should browse to the error page', function() {
    goToErrorPage(httpError, logger, router);
    expect(logger.error).toHaveBeenCalledWith(httpError);
    expect(router.navigate).toHaveBeenCalled();
  });

});
