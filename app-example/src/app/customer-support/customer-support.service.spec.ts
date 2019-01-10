import { Headers } from '@angular/http';
import { HttpService } from '@mc-fraud-center/commons';

import { CustomerSupportService } from './customer-support.service';
import { Logger } from '@mastercard/ng-commons';
import { of } from 'rxjs/observable/of';

describe('Service: CustomerSupportService ', function() {
  let service: CustomerSupportService;

  let httpServiceMock: HttpService;
  let loggerMock: Logger;

  beforeEach(function() {
    httpServiceMock = {
      defaultHeaders: new Headers(),
      get: jasmine.createSpy('get').and.callFake(() => of(true)),
      put: jasmine.createSpy('put').and.callFake(() => of(true)),
    } as any;

    loggerMock = jasmine.createSpyObj('logger', ['debug', 'info', 'warn', 'error']);
    service = new CustomerSupportService(httpServiceMock, loggerMock);
  });

  describe('Method: setPaginationParams', function() {
    it('should return parameters', function() {
      const params = service.setPaginationParams(1, 2);
      expect(params.get('page')).toEqual('1');
      expect(params.get('size')).toEqual('2');
    });

    it('should create the sort parameter if sort object is provided ', () => {
      const mockSort = { key: 'testKey', direction: 'asc'};
      const params = service.setPaginationParams(1, 2, mockSort);
      expect(params.get('sort')).toEqual(`${mockSort.key},${mockSort.direction}`);
    });

    it('should create the filter\'s key-named parameter if filters are provided ', () => {
      const mockFilter = { mcc: 'mccFilter' };
      const params = service.setPaginationParams(1, 2, undefined, mockFilter);
      expect(params.get('mcc')).toEqual('mccFilter');
    });

    it('should create the filter\'s key-named parameter with ISOSTRING if a date filter is provided ', () => {
      const mockDate = new Date();
      const mockFilter = { 'created-on': mockDate };
      const params = service.setPaginationParams(1, 2, undefined, mockFilter);
      expect(params.get('created-on')).toEqual(mockDate.toISOString());
    });
  });

  describe('Method: list', () => {

    let url: string;
    let httpGetSpy: jasmine.Spy;

    beforeEach(() => httpGetSpy = httpServiceMock.get as any);

    describe('list()', () => {
      beforeEach(() => url = service.baseURL + '?' + service.setPaginationParams(1, 5));

      it('should perform a get request', () => {
        service.list();
        expect(httpGetSpy).toHaveBeenCalled();
        expect(httpGetSpy.calls.argsFor(0)).toEqual([jasmine.objectContaining({ url })]);
      });

      it('should perform a get request without default page and size values', () => {
        service.list(2, 6);
        expect(httpGetSpy).toHaveBeenCalled();
        expect(httpGetSpy.calls.argsFor(0)).not.toEqual([jasmine.objectContaining({ url })]);
      });
    });

  });

});
