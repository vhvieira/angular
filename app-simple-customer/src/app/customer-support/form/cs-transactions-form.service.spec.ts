import { CsTransactionsFormService } from './cs-transactions-form.service';
import { ResearchTransactionRequest } from '../../core/interfaces/research-transaction-request';
import { MessageService } from '@mastercard/ng-commons';

describe('CsTransactionsFormService', function () {
  let auditInfo: ResearchTransactionRequest;
  let service: CsTransactionsFormService;
  let messageService: MessageService;

  beforeEach(function () {
    messageService = jasmine.createSpyObj(['post']);
    service = new CsTransactionsFormService(messageService);
    auditInfo = new ResearchTransactionRequest();
    auditInfo.customerSupportUserId = '000';
  });

  describe('Method: setAuditInformation ', function () {
    it('should call service and set audit info', function () {
      service.setAuditInformation(auditInfo);
      expect(service.auditInformation).not.toBeNull();
    });
  });

  describe('Method: reset ', function () {
    it('should call service and reset audit info', function () {
      service.setAuditInformation(auditInfo);
      expect(service.auditInformation).not.toBeNull();
      service.reset();
      expect(service.auditInformation).toBeNull();
    });
  });

  describe('Method: setTransactionsTab ', function () {
    it('should call setTransactionsTab and messageService', function () {
      service.setTransactionsTab();
      expect(messageService.post).toHaveBeenCalled();
    });
  });
});
