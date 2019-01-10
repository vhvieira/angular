import { CsTransactionsComponent } from './cs-transactions.component';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';
import { Router } from '@angular/router';
import { Logger } from '@mastercard/ng-commons';
import { CsTransactionsService } from './cs-transactions.service';
import * as CONFIG from '../../constants';
import { CsTransactionsFormService } from '../form/cs-transactions-form.service';

describe('CsTransactionsComponent', function () {
  let loggerMock: Logger;
  let routerMock: Router;
  let dataSample: any;
  let responseMock: any;
  let transactionServiceMock: CsTransactionsService;
  let component: CsTransactionsComponent;
  let transactionsFormServiceMock: CsTransactionsFormService;

  beforeEach(function () {
    transactionsFormServiceMock = {
      auditInformation: null,
      setAuditInformation: jasmine.createSpy('setAuditInformation'),
      reset: jasmine.createSpy('reset'),
      setChosenPan: jasmine.createSpy('setChosenPan'),
      setTransactions: jasmine.createSpy('setTransactions'),
      getTransactions: jasmine.createSpy('getTransactions'),
      getHistoryVisible: jasmine.createSpy('getHistoryVisible')
    } as any;

    loggerMock = {
      debug: jasmine.createSpy('debug'),
      info: jasmine.createSpy('info'),
      error: jasmine.createSpy('error')
    } as any;
    routerMock = {
      navigate: jasmine.createSpy('navigate'),
      navigateByUrl: jasmine.createSpy('navigateByUrl')
    } as any;
    dataSample = {
      a: 'a',
      b: 'b'
    };
    responseMock = of({
      response: {
        headers: new Map().set('X-Total-Count', 10),
        json: () => dataSample
      },
    });
    transactionServiceMock = {
      researchOwner: jasmine
        .createSpy('researchOwner')
        .and.returnValue(responseMock),
      researchDeclinedTransactions: jasmine
        .createSpy('researchDeclinedTransactions')
        .and.returnValue(responseMock),
      declinesForProcessedTransactionId: jasmine
        .createSpy('declinesForProcessedTransactionId')
        .and.returnValue(responseMock),
      allTransactionsForPan: jasmine
        .createSpy('allTransactionsForPan')
        .and.returnValue(responseMock),
    } as any;

    component = new CsTransactionsComponent(
      loggerMock,
      routerMock,
      transactionServiceMock,
      transactionsFormServiceMock
    );
  });

  describe('Getter: enableHistory', () => {
    it('should return true if auditInformation.searchType === PAN ', () => {
      component.auditInformation = { searchType: CONFIG.SEARCH_TYPE.PAN } as any;
      expect(component.enableHistory).toBeTruthy();
    });

    it('should return true if there are transactions available ', () => {
      component.transactions = [{ example: '1' }] as any;
      expect(component.enableHistory).toBeTruthy();
    });
  });

  describe('Method: onRefresh() ', () => {
    it('should refresh transactions ', () => {
      // TODO: update test, because not refresh implemented yet
      component.onRefresh();
      expect(loggerMock.info).toHaveBeenCalled();
    });
  });

  describe('Method: onShowDialog ', () => {
    it('should set dialog text ', () => {
      component.dialog = { show: jasmine.createSpy('show') } as any;
      const desiredMessage = 'Test Message';
      component.onShowDialog(desiredMessage);
      expect(component.dialogText).toBe(desiredMessage);
    });

    it('should show the dialog ', () => {
      component.dialog = { show: jasmine.createSpy('show') } as any;
      const desiredMessage = 'Test Message';
      component.onShowDialog(desiredMessage);
      expect(component.dialog.show).toHaveBeenCalled();
    });
  });

  describe('Method: onSearch ', () => {
    let searchEventMock = {} as any;
    beforeEach( () => {
      searchEventMock = {
        controls: {
          userId: { value: '123' },
          searchType: { value: '1' },
          firstName: { value: 'Test' },
          lastName: { value: 'Tester' },
          comments: { value: 'This is a test' },
          ticketNumber: { value: '123' },
          searchField: { value: 'my search' }
        } as any
      };
      component.onSearchByPan = jasmine.createSpy('onSearchByPan');
      component.onSearchByTransactionId = jasmine.createSpy('onSearchByPan');
    });

    it('should call onSearchByPan if searchType == PAN', () => {
      transactionsFormServiceMock.auditInformation = { searchType: CONFIG.SEARCH_TYPE.PAN } as any;
      component.onSearchByPan = jasmine.createSpy('onSearchByPan');

      component.onSearch(searchEventMock as any);
      expect(component.onSearchByPan).toHaveBeenCalled();
    });

    it('should call onSearchByTransactionId if searchType == TRANSACTION_ID', () => {
      transactionsFormServiceMock.auditInformation = { searchType: CONFIG.SEARCH_TYPE.TRANSACTION_ID } as any;
      component.onSearchByTransactionId = jasmine.createSpy('onSearchByTransactionId');

      component.onSearch(searchEventMock as any);
      expect(component.onSearchByTransactionId).toHaveBeenCalled();
    });
  });

  describe('Method: onToggleHistory', () => {
    beforeEach(() => {
      component.auditInformation = {
        custId: '123',
        searchType: '1',
        customerSupportUserId: '123',
        requestorUserId: '123',
        requestorFirstName: 'Test',
        requestorLastName: 'Tester',
        comments: 'bla bla bla',
        ticketNumber: '123',
        customerSupportActionType: 'RESEARCH'
      } as any;
    });
    it('should revert historyVisible flag and call onSearchHistory if its true', () => {
      component.historyVisible = false;
      component.onSearchHistory = jasmine.createSpy('onSearchHistory');
      component.onSearchByPan = jasmine.createSpy('onSearchByPan');
      component.onSearchByTransactionId = jasmine.createSpy('onSearchByTransactionId');
      component.onToggleHistory();
      expect(component.historyVisible).toEqual(true);
      expect(component.onSearchHistory).toHaveBeenCalled();
    });
    it('should call onSearchByPan as per searchType == PAN if history flag becomes false', () => {
      component.historyVisible = true;
      component.onSearchHistory = jasmine.createSpy('onSearchHistory');
      component.onSearchByPan = jasmine.createSpy('onSearchByPan');
      component.onSearchByTransactionId = jasmine.createSpy('onSearchByTransactionId');
      component.onToggleHistory();
      expect(component.historyVisible).toEqual(false);
      expect(component.onSearchByPan).toHaveBeenCalled();
    });
    it('should call onSearchByPan as per searchType == TRANSACTION_ID if history flag becomes false', () => {
      component.historyVisible = true;
      component.auditInformation!.searchType = CONFIG.SEARCH_TYPE.TRANSACTION_ID;
      component.onSearchHistory = jasmine.createSpy('onSearchHistory');
      component.onSearchByPan = jasmine.createSpy('onSearchByPan');
      component.onSearchByTransactionId = jasmine.createSpy('onSearchByTransactionId');
      component.onToggleHistory();
      expect(component.historyVisible).toEqual(false);
      expect(component.onSearchByTransactionId).toHaveBeenCalled();
    });
  });
  describe('Method: onSearchHistory', () => {
    it('should call service\'s allTransactionsForPan and aferwards onTransactionsReceived', () => {
      component.onTransactionsReceived = jasmine.createSpy('onTransactionsReceived');
      component.onSearchHistory();
      expect(transactionServiceMock.allTransactionsForPan).toHaveBeenCalled();
      expect(component.onTransactionsReceived).toHaveBeenCalled();
    });
    it('should call onRequestError in case service\'s allTransactionsForPan returns an error', () => {
      transactionServiceMock.allTransactionsForPan = jasmine.createSpy('allTransactionsForPan')
        .and.returnValue(_throw('ops'));
      component.onRequestError = jasmine.createSpy('onRequestError');
      component.onSearchHistory();
      expect(component.onRequestError).toHaveBeenCalled();
    });
  });

  describe('Method: onTransactionsReceived  ', () => {
    beforeEach(() => {
      const mockViewer = {
        setPage: jasmine.createSpy('setPage')
      };
      component.viewer = mockViewer as any;
    });

    it('should call noRowsToShow if body.length === 0', () => {
      component.noRowsToShow = jasmine.createSpy('noRowsToShow');
      component.onTransactionsReceived([]);
      expect(component.noRowsToShow).toHaveBeenCalled();
    });

    it('should populate auditInfo acctRgId and .pan if body has contents', () => {
      const mockBody = [{
        acctRngId: '1233',
        de2PrimaryAccountNumber: '1234'
      }] as any;
      component.auditInformation = {
        searchType: '2'
      } as any;
      component.onTransactionsReceived(mockBody);
      expect(component.auditInformation!.acctRngId).toEqual(mockBody[0].acctRngId);
      expect(component.auditInformation!.pan).toEqual(mockBody[0].de2PrimaryAccountNumber);
    });
  });

  describe('Method: onSearchByPan ', () => {
    it('Should call service\'s researchOwner and afterwards handleresearchOwner', () => {
      component.handleresearchOwner = jasmine.createSpy('handleresearchOwner');
      component.onSearchByPan();
      expect(component.handleresearchOwner).toHaveBeenCalled();
    });
    it('Should call onRequestError if service\'s researchOwner returns an error', () => {
      transactionServiceMock.researchOwner = jasmine.createSpy('researchOwner')
        .and.returnValue(_throw('ops'));
      component.onRequestError = jasmine.createSpy('onRequestError');

      component.onSearchByPan();
      expect(component.onRequestError).toHaveBeenCalled();
    });
  });

  describe('Method: onSearchByTransactionId ', () => {
    it('Should call service.declinesForProcessedTransactionId and handleDesclinesForProcessedTransactionId', () => {
      component.handleDeclinesForProcessedTransactionId = jasmine.createSpy('handleDeclinesForProcessedTransactionid');
      component.onSearchByTransactionId();
      expect(component.handleDeclinesForProcessedTransactionId).toHaveBeenCalled();
    });

    it('Should call service.declinesForProcessedTransactionId and onRequestError if errors', () => {
      transactionServiceMock.declinesForProcessedTransactionId = jasmine.createSpy('declinesForProcessedTransactionId')
        .and.returnValue(_throw('ops'));

      component.onRequestError = jasmine.createSpy('onRequestError');
      component.onSearchByTransactionId();
      expect(component.onRequestError).toHaveBeenCalled();
    });
  });

  describe('Method: onRequestError', () => {
    it('should log the error and call onShowDialog ', () => {
      component.onShowDialog = jasmine.createSpy('onShowDialog');
      component.onRequestError('error' as any);
      expect(loggerMock.error).toHaveBeenCalled();
      expect(component.onShowDialog).toHaveBeenCalled();
    });
  });

  describe('Method: handleresearchOwner ', () => {
    const mockBody = {} as any;
    beforeEach(() => {
      mockBody.memberId = 321;
      mockBody.custId = 123;
      mockBody.legalName = 'LegalName';
    });
    it('should set auditInformation.ica, custid and custName from mockBody values', () => {
      component.auditInformation = {} as any;
      component.onTransactionsReceived = jasmine.createSpy('onTransactionReceived');
      component.handleresearchOwner(mockBody);
      expect(component.auditInformation!.ica).toEqual(mockBody.memberId);
      expect(component.auditInformation!.custId).toEqual(mockBody.custId);
      expect(component.auditInformation!.custName).toEqual(mockBody.legalName);
    });
    it('should set currentIca and currentInstitution name from body values', () => {
      component.auditInformation = {} as any;
      component.onTransactionsReceived = jasmine.createSpy('onTransactionReceived');
      component.handleresearchOwner(mockBody);
      expect(component.currentIca).toEqual(`${mockBody.memberId}`);
      expect(component.currentInstitutionName).toEqual(mockBody.legalName);
    });
    it('should call onRequestError in case the request has an error ', () => {
      transactionServiceMock.researchDeclinedTransactions = jasmine.createSpy('researchDeclinedTransactions')
        .and.returnValue(_throw('Ops'));

      component.auditInformation = {} as any;
      component.onRequestError = jasmine.createSpy('onRequestError');
      component.handleresearchOwner(mockBody);
      expect(component.onRequestError).toHaveBeenCalled();
    });
  });

  describe('Method: noRowsToShow ', () => {
    it('should set notFoundMessage for PAN if searchType is 1', () => {
      const desiredMessage = 'CUSTOMER_SUPPORT.MESSAGES.NOT_FOUND.PAN';
      component.auditInformation = { searchType: '1' } as any;

      component.noRowsToShow();
      expect(component.notFoundMessage).toEqual(desiredMessage);
    });
    it('should set notFoundMessage for Transaction_ID if searchType is 2', () => {
      const desiredMessage = 'CUSTOMER_SUPPORT.MESSAGES.NOT_FOUND.TRANSACTION_ID';
      component.auditInformation = { searchType: '2' } as any;

      component.noRowsToShow();
      expect(component.notFoundMessage).toEqual(desiredMessage);
    });

    it('should set notFoundMessage for Transaction_ID if searchType is invalid', () => {
      const desiredMessage = 'Invalid Search Type';
      component.auditInformation = { searchType: '3' } as any;
      try {
        component.noRowsToShow();
        fail('Should throw an exception');
      } catch (e) {
        expect(e).toEqual( new Error(desiredMessage) );
      }
    });

  });

  describe('Method: handleDeclinesForProcessedTransactionId ', () => {
    it('should call noRowsToShow and return if body.length === 0', () => {
      component.noRowsToShow = jasmine.createSpy('noRowsToShow');
      component.handleDeclinesForProcessedTransactionId([] as any);
      expect(component.noRowsToShow).toHaveBeenCalled();
    });

    it('should set auditInformation if body.length > 0', () => {
      const mockBody = [{
        de2PrimaryAccountNumber: '20',
      },
      {
        de2PrimaryAccountNumber: '20',
      }] as any;
      transactionServiceMock.researchOwner = jasmine.createSpy('researchOwner')
        .and.returnValue(of({
          response: {
            json: jasmine.createSpy('json')
          }
        }));
      component.onRequestError = jasmine.createSpy('onRequestError');
      component.auditInformation = { searchType: '1', pan: null} as any;
      component.handleDeclinesForProcessedTransactionId(mockBody);
      expect(component.auditInformation!.pan)
        .toEqual(mockBody[0].de2PrimaryAccountNumber);
    });
  });

  describe('method: recordSelected', () => {
    it('should set selectedTransactions ', () => {
      component.recordSelected({ transactions: 'record'} as any);
      expect(component.selectedTransactions).toEqual('record' as any);
    });
  });

  describe('method: onRowSelected ', () => {
    it('should select the row ', () => {
      const component2 = new CsTransactionsComponent(
        loggerMock,
        routerMock,
        transactionServiceMock,
      transactionsFormServiceMock
    );
      component2.onRowDoubleClick({ transaction: { transactionId: 11}} as any);
    });
  });
  describe('Method: onChangeSettings', () => {
    it('should do nothing if no sortOrder or sortField are provided', () => {
      const mockTvSaveSettingsEvent = {
        settings: {
          maxNoOfDays: '180',
          maxRecords: '500',
          maxRecordsPerPage: 25
        }
      } as any;
      component.onChangeSettings(mockTvSaveSettingsEvent);
    });
  });

  describe('Method: onNewInquiry', () => {
    it('Should reset the screen state', () => {
      component.onNewInquiry();
      expect(component.transactions).toEqual([]);
      expect(component.auditInformation).toEqual(null);
      expect(component.historyVisible).toEqual(false);
      expect(component.notFoundMessage).toEqual('');
      expect(component.currentIca).toEqual(null);
      expect(component.currentInstitutionName).toEqual(null);
    });
  });

});
