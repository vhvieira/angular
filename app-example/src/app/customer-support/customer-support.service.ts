import { Injectable } from '@angular/core';
import { URLSearchParams, RequestOptions } from '@angular/http';
import { HttpService, HttpReadRequest } from '@mc-fraud-center/commons';
import { Logger, LOCALE } from '@mastercard/ng-commons';
import * as CONFIG from '../constants';

export interface SortFilter {
  key: string;
  direction?: string;
}

@Injectable()
export class CustomerSupportService {
  baseURL = CONFIG.API_URL;
  readonly options: RequestOptions;

  constructor(
    private http: HttpService,
    private logger: Logger,
  ) {
    const headers = this.http.defaultHeaders;
    headers.set('X-MC-FS-Accept-Language', LOCALE.ENGLISH);
    this.options = new RequestOptions({ headers });
  }

  list (page = 1, size = 5, sort?: SortFilter, filters?: any) {
    const params = this.setPaginationParams(page, size, sort, filters);
    const request = HttpReadRequest.create(this.baseURL + '?' + params)
      .withOptions(this.options)
      .withWaitMessage('CUSTOMER_SUPPORT.WAIT.DATA')
      .withToastMessages(false, false);
    return this.http.get(request);
  }

  setPaginationParams(page: number, size: number, sort?: SortFilter, filters?: any) {
    const params = new URLSearchParams();
    params.set('page', page.toString());
    params.set('size', size.toString());

    if (sort) {
      const key = sort.key;
      const sortFilter = `${key},${sort.direction}`;
      params.set('sort', sortFilter);
    }

    if (filters) {
      for (const key in filters) {
        if (filters[key]) {
          if (filters[key] instanceof Date) {
            params.set(key, filters[key].toISOString());
          } else {
            params.set(key, filters[key]);
          }
        }
      }
    }

    this.logger.info(`CustomerSupportService list() params are ${params}`);
    return params;
  }
}
