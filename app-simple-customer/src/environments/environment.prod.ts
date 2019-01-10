import { setDefaultLogLevel, LogLevel } from '@mastercard/ng-commons';

export const environment = {
  production: true
};

setDefaultLogLevel(LogLevel.WARN);
