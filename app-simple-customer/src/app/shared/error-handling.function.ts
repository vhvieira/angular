import { HttpError } from '@mc-fraud-center/commons';
import { Logger } from '@mastercard/ng-commons';
import { Router } from '@angular/router';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { _throw } from 'rxjs/observable/throw';

/** Navigates the user to /error when an HTTP request unexpectedly fails. */
export function goToErrorPage(httpError: HttpError, logger: Logger, router: Router): ErrorObservable<never> {
  logger.error(httpError);
  const queryParams = { code: httpError.status, description: httpError.displayMessage };
  router.navigate(['/error'], { queryParams });
  return _throw(httpError);
}
