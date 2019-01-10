import { of } from 'rxjs/observable/of';
import { CsTransactionsService } from './cs-transactions.service';
import { Headers } from '@angular/http';

describe('Service: CsTransactionsService ', () => {
  let httpServiceMock: any;
  let loggerMock;
  let service: CsTransactionsService;
  beforeEach(() => {
    httpServiceMock = {
      defaultHeaders: new Headers(),
      get: jasmine.createSpy('get').and.callFake(() => of(true)),
      post: jasmine.createSpy('post').and.callFake(() => of(true)),
    } as any;

    loggerMock = jasmine.createSpyObj('logger', ['debug', 'info', 'warn', 'error']);
    service = new CsTransactionsService(httpServiceMock, loggerMock);
  });
  describe('method: researchOwner', () => {
    it('should perform http.post with provided query', () => {
      const mockQuery = { a: 'b' } as any;
      service.researchOwner(mockQuery);
      expect(httpServiceMock.post).toHaveBeenCalled();
    });
  });

  describe('method: researchDeclinedTransactions', () => {
    it('should perform httpPost for searchType 2', () => {
      const mockAuditInformation = { searchType: '2', pan: 'shouldBeGone', a: 'b', custId: '123' } as any;
      service.researchDeclinedTransactions(mockAuditInformation);

      expect(httpServiceMock.post).toHaveBeenCalled();
    });
    it('should perform httpPost for searchType 1', () => {
      const mockAuditInformation = { searchType: '1', pan: 'shouldBeGone', a: 'b', custId: '123' } as any;
      service.researchDeclinedTransactions(mockAuditInformation);

      expect(httpServiceMock.post).toHaveBeenCalled();
    });
  });

  describe('method: declinesForProcessedTransactionId', () => {
    it('Should perform http.post for searchType 1', () => {
      const mockAuditInformation = { searchType: '1', pan: 'shouldBeGone', a: 'b', custId: '123' } as any;
      service.declinesForProcessedTransactionId(mockAuditInformation);

      expect(httpServiceMock.post).toHaveBeenCalled();
    });

    it('Should perform http.post for searchType 2', () => {
      const mockAuditInformation = { searchType: '2', pan: 'shouldBeGone', a: 'b', custId: '123' } as any;
      service.declinesForProcessedTransactionId(mockAuditInformation);

      expect(httpServiceMock.post).toHaveBeenCalled();
    });

  });
  describe('method: allTransactionsForPan', () => {
    it('Should perform http.post for searchType 1', () => {
      const mockAuditInformation = { searchType: '1', pan: 'shouldBeGone', a: 'b', custId: '123' } as any;
      service.allTransactionsForPan(mockAuditInformation);

      expect(httpServiceMock.post).toHaveBeenCalled();
    });

    it('Should perform http.post for searchType 2', () => {
      const mockAuditInformation = { searchType: '2', pan: 'shouldBeGone', a: 'b', custId: '123' } as any;
      service.allTransactionsForPan(mockAuditInformation);

      expect(httpServiceMock.post).toHaveBeenCalled();
    });
  });
      // .
});
