import { CsTransactionsFormComponent } from './cs-transactions-form.component';
import { FormBuilder } from '@angular/forms';
import { Logger, LogLevel } from '@mastercard/ng-commons';
import { Renderer } from '@angular/core';
import { CsTransactionsFormService } from './cs-transactions-form.service';
import * as CONFIG from '../../constants';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs/observable/of';

let comp: CsTransactionsFormComponent;
let logger: Logger;
let formBuilder: FormBuilder;
let renderer: Renderer;
let transactionsFormServiceMock: CsTransactionsFormService;
let routeMock: ActivatedRoute;

describe('CsTransactionsComponent', function () {
  beforeEach(async() => {
    logger = new Logger(LogLevel.DEBUG);
    formBuilder = new FormBuilder();
    renderer = jasmine.createSpyObj('renderer',
        ['selectRootElement',
        'invokeElementMethod']);
    transactionsFormServiceMock = {
      auditInformation: null,
      setAuditInformation: jasmine.createSpy('setAuditInformation'),
      reset: jasmine.createSpy('reset')
    } as any;
    routeMock = {
      url: of([{path: 'transactions'}])
    } as any;
    comp = new CsTransactionsFormComponent(formBuilder, logger, renderer, transactionsFormServiceMock, routeMock);
    comp.ngOnInit();
  });
  describe('Component: CsTransactionsComponent LOCAL enviroment test', () => {
    it('should set the url  as lists ', () => {
      const localRouteMock = {
        url: of([])
      } as any;
      const localComp = new CsTransactionsFormComponent(
        formBuilder, logger, renderer, transactionsFormServiceMock, localRouteMock
      );
      expect(localComp.url).toEqual('lists');
    });
  });
  describe('Component: CsTransactionsComponent ', () => {
    it('should be invalid when empty', () => {
      expect(comp.transactionForm.valid).toBeFalsy();
    });

    it('should have an invalid firstName if it is empty', () => {
     const firstName = comp.transactionForm.controls['firstName'];
     expect(firstName.valid).toBeFalsy();
    });

    it('should have an invalid lastName if it is empty', () => {
      const lastName = comp.transactionForm.controls['lastName'];
      expect(lastName.valid).toBeFalsy();
    });

    it('should have an invalid userId if it is empty', () => {
      const userId = comp.transactionForm.controls['userId'];
      expect(userId.valid).toBeFalsy();
    });

    it('should have an invalid ticketNumber if it is empty', () => {
      const ticketNumber = comp.transactionForm.controls['ticketNumber'];
      expect(ticketNumber.valid).toBeFalsy();
    });

    it('should have an invalid comments if it is empty', () => {
      const comments = comp.transactionForm.controls['comments'];
      expect(comments.valid).toBeFalsy();
    });
  });

  describe('method: ngOnInit() ', () => {
    it('should initialize the form to empty values', () => {
      comp.ngOnInit();
      expect(comp.transactionForm).not.toBeNull();
    });
    it('should call populateForm if requestorFirstName is defined', () => {
      const expectedIca = 1234;
      const expectedInstitutionName = 'Test';
      transactionsFormServiceMock.auditInformation = {
        searchType: '1',
        ica: expectedIca,
        custName: expectedInstitutionName,
        requestorFirstName: 'test'
      } as any;
      const comp2 = new CsTransactionsFormComponent(
        formBuilder, logger, renderer, transactionsFormServiceMock, routeMock
      );
      comp2.populateForm = jasmine.createSpy('populateForm');
      comp2.disableFields = jasmine.createSpy('disableFields');
      comp2.ngOnInit();
      expect(comp2.populateForm).toHaveBeenCalled();
    });
  });

  describe('method: populateForm() ', () => {
    it('should populate the form if searchType is provided', () => {
      transactionsFormServiceMock.auditInformation = {
        searchType: 1,
      } as any;
      const comp2 = new CsTransactionsFormComponent(
        formBuilder, logger, renderer, transactionsFormServiceMock, routeMock
      );
      comp2.disableFields = jasmine.createSpy('disableFields');
      comp2.ngOnInit();
      comp2.populateForm();
      expect(comp2.disableFields).toHaveBeenCalled();
    });

    it('should populate the ICA and Institution name if provided', () => {
      const expectedIca = 1234;
      const expectedInstitutionName = 'Test';
      transactionsFormServiceMock.auditInformation = {
        searchType: '1',
        ica: expectedIca,
        custName: expectedInstitutionName
      } as any;
      const comp2 = new CsTransactionsFormComponent(
        formBuilder, logger, renderer, transactionsFormServiceMock, routeMock
      );
      comp2.disableFields = jasmine.createSpy('disableFields');
      comp2.ngOnInit();
      comp2.populateForm();
      expect(comp2.ica).toEqual(expectedIca);
      expect(comp2.institutionName).toEqual(expectedInstitutionName);
    });

    it('should populate the searchfield with PAN if searchType is 1', () => {
      const expectedPan = '1234';
      transactionsFormServiceMock.auditInformation = {
        searchType: '1',
        ica: 1234,
        pan: expectedPan,
        custName: 'test'
      } as any;
      const comp2 = new CsTransactionsFormComponent(
        formBuilder, logger, renderer, transactionsFormServiceMock, routeMock
      );
      comp2.disableFields = jasmine.createSpy('disableFields');
      comp2.ngOnInit();
      comp2.populateForm();
      expect(comp2.transactionForm.controls['searchField'].value).toEqual(expectedPan);
    });
    it('should populate the searchfield with TRANSACTION ID if searchType is 2', () => {
      const expectedTranId = '1234';
      const expectedInstitutionName = 'Test';
      transactionsFormServiceMock.auditInformation = {
        searchType: '2',
        ica: 1234,
        custName: expectedInstitutionName,
        processedTranId: expectedTranId
      } as any;
      const comp2 = new CsTransactionsFormComponent(
        formBuilder, logger, renderer, transactionsFormServiceMock, routeMock
      );
      comp2.disableFields = jasmine.createSpy('disableFields');
      comp2.ngOnInit();
      comp2.populateForm();
      expect(comp2.transactionForm.controls['searchField'].value).toEqual(expectedTranId);
    });
  });

  describe('method: onNewInquiry() ', () => {
    it('should reset the form', () => {
      comp.onNewInquiry();
      expect(comp.searchingFlag).toBeFalsy();
      expect(comp.transactionForm.valid).toBeFalsy();
      expect(renderer.selectRootElement).toHaveBeenCalled();
      expect(renderer.invokeElementMethod).toHaveBeenCalled();
    });
  });

  describe('method: onSubmit() ', () => {
    it('should rebuild the form', () => {
      comp.onSubmitForm();
      expect(comp.searchingFlag).toBeFalsy();
    });
  });

  describe('method: canPerformSearch() ', () => {
    it('should be able to perform the search if the form is valid', () => {
      comp.searchingFlag = false;
      comp.transactionForm.controls['firstName'].setValue('fakefirst');
      comp.transactionForm.controls['lastName'].setValue('fakelast');
      comp.transactionForm.controls['userId'].setValue('1234569');
      comp.transactionForm.controls['ticketNumber'].setValue('000000');
      comp.transactionForm.controls['comments'].setValue('fake comment');
      comp.transactionForm.controls['searchField'].setValue('123');
      expect(comp.canPerformSearch()).toBeNull();
    });

    it('should not be able to perform the search if the form is invalid', () => {
      comp.transactionForm.controls['firstName'].setValue('invalid%$%');
      comp.transactionForm.controls['lastName'].setValue('fakelast$#');
      comp.transactionForm.controls['userId'].setValue('1234569!#');
      comp.transactionForm.controls['ticketNumber'].setValue('000000#');
      comp.transactionForm.controls['comments'].setValue('fake comment@$%');
      comp.transactionForm.controls['searchField'].setValue('123&*');
      expect(comp.canPerformSearch()).toEqual('disabled');
    });

    it('should not be able to perform the search flag is true', () => {
      comp.searchingFlag = false;
      expect(comp.canPerformSearch()).toEqual('disabled');
      comp.searchingFlag = true;
      comp.transactionForm.controls['firstName'].setValue('fakefirst');
      comp.transactionForm.controls['lastName'].setValue('fakelast');
      comp.transactionForm.controls['userId'].setValue('1234569');
      comp.transactionForm.controls['ticketNumber'].setValue('000000');
      comp.transactionForm.controls['comments'].setValue('fake comment');
      comp.transactionForm.controls['searchField'].setValue('123');
      expect(comp.canPerformSearch()).toEqual('disabled');
    });
  });

  describe('method: canReset() ', () => {
    it('should not enable reset if search is true', () => {
      comp.searchingFlag = true;
      expect(comp.canReset()).toBeNull();
    });

    it('should disable the reset if search is false', () => {
      comp.searchingFlag = false;
      expect(comp.canReset()).toEqual('disabled');
    });
  });

  describe('method: onResetButton() ', () => {
    it('should reset the form', () => {
      comp.onNewInquiry();
      expect(comp.searchingFlag).toBeFalsy();
      expect(comp.transactionForm.valid).toBeFalsy();
      expect(renderer.selectRootElement).toHaveBeenCalled();
      expect(renderer.invokeElementMethod).toHaveBeenCalled();
    });
  });
  describe('method: fieldsToAuditInformation()', () => {
    it('should setup the auditInformation using the searchObject ', () => {
      const  searchEventMock = {
        controls: {
          userId: { value: '123' },
          searchType: { value: CONFIG.SEARCH_TYPE.PAN },
          firstName: { value: 'Test' },
          lastName: { value: 'Tester' },
          comments: { value: 'This is a test' },
          ticketNumber: { value: '123' },
          searchField: { value: 'my search' }
        } as any
      } as any;
      const desiredResult = {
        searchType: searchEventMock.controls.searchType.value,
        requestorUserId: searchEventMock.controls.userId.value,
        requestorFirstName: searchEventMock.controls.firstName.value,
        requestorLastName: searchEventMock.controls.lastName.value,
        comments: searchEventMock.controls.comments.value,
        ticketNumber: searchEventMock.controls.ticketNumber.value,
        customerSupportActionType: 'RESEARCH',
      };

      const result = comp.fieldsToAuditInformation(searchEventMock);
      expect(result).toEqual(desiredResult);
    });
  });
  describe('method: onSubmitForm() ', () => {
    it('should be disable fields and search flag', () => {
      // prepare form (valid)
      comp.transactionForm.controls['firstName'].setValue('fakefirst');
      comp.transactionForm.controls['lastName'].setValue('fakelast');
      comp.transactionForm.controls['userId'].setValue('1234569');
      comp.transactionForm.controls['ticketNumber'].setValue('000000');
      comp.transactionForm.controls['comments'].setValue('fake comment');
      comp.transactionForm.controls['searchType'].setValue(CONFIG.SEARCH_TYPE.PAN);
      comp.transactionForm.controls['searchField'].setValue('123');
      // call method
      comp.onSubmitForm();
      // assertion
      expect( comp.transactionForm.controls['userId'].disabled);
      expect( comp.transactionForm.controls['firstName'].disabled);
      expect( comp.transactionForm.controls['lastName'].disabled);
      expect( comp.transactionForm.controls['searchField'].disabled);
      expect(comp.searchingFlag);
    });
    it('invalid form should be disable fields and search flag', () => {
      // prepare form (valid)
      comp.transactionForm.controls['firstName'].setValue('invalidfirst%%');
      comp.transactionForm.controls['lastName'].setValue('invalidlast##');
      comp.transactionForm.controls['userId'].setValue('1234569');
      comp.transactionForm.controls['ticketNumber'].setValue('000000');
      comp.transactionForm.controls['comments'].setValue('fake comment');
      comp.transactionForm.controls['searchType'].setValue(CONFIG.SEARCH_TYPE.PAN);
      comp.transactionForm.controls['searchField'].setValue('123');
      // call method
      comp.onSubmitForm();
      // assertion
      expect( comp.transactionForm.controls['userId'].disabled).toBeFalsy();
      expect( comp.transactionForm.controls['firstName'].disabled).toBeFalsy();
      expect( comp.transactionForm.controls['lastName'].disabled).toBeFalsy();
      expect( comp.transactionForm.controls['searchField'].disabled).toBeFalsy();
      expect(comp.searchingFlag).toBeFalsy();
    });
    it('should be disable fields and re-enable after resetting', () => {
      // prepare form (valid)
      comp.transactionForm.controls['firstName'].setValue('fakefirst');
      comp.transactionForm.controls['lastName'].setValue('fakelast');
      comp.transactionForm.controls['userId'].setValue('1234569');
      comp.transactionForm.controls['ticketNumber'].setValue('000000');
      comp.transactionForm.controls['comments'].setValue('fake comment');
      comp.transactionForm.controls['searchType'].setValue(CONFIG.SEARCH_TYPE.PAN);
      comp.transactionForm.controls['searchField'].setValue('124');
      // call method
      comp.onSubmitForm();
      comp.onNewInquiry();
      // assertion
      expect( comp.transactionForm.controls['userId'].disabled).toBeFalsy();
      expect( comp.transactionForm.controls['firstName'].disabled).toBeFalsy();
      expect( comp.transactionForm.controls['lastName'].disabled).toBeFalsy();
      expect( comp.transactionForm.controls['searchField'].disabled).toBeFalsy();
      expect(comp.searchingFlag).toBeFalsy();
    });
  });

  describe('method: trackByFn ', () => {
    it('should return the index ', () => {
      const result = comp.trackByFn(1, {});
      expect(result).toBe(1);
    });
  });

  describe('method: showError ', () => {
    it('should return true if errors are found', () => {
      comp.transactionForm = {
        get: jasmine.createSpy('get').and.callFake(() => {
          return {
            invalid: true,
            touched: true,
            dirty: true,
            hasError: () => true
          };
        })
      } as any;
      const result = comp.showError('name', {} as any);
      expect(result).toBeTruthy();
    });

    it('should return true if errors (branch coverage)', () => {
      comp.transactionForm = {
        get: jasmine.createSpy('get').and.callFake(() => {
          return {
            invalid: true,
            touched: true,
            dirty: false,
            hasError: () => true
          };
        })
      } as any;
      const result = comp.showError('name', {} as any);
      expect(result).toBeTruthy();
    });
  });

  describe('Method: hasError ', () => {
    it('should return true if errors', () => {
      comp.transactionForm = {
        get: jasmine.createSpy('get').and.callFake(() => {
          return {
            invalid: true,
            touched: true,
            dirty: false,
          };
        })
      } as any;

      const result = comp.hasError('name');
      expect(result).toBe(true);
    });
  });

  describe('Method: isUrl', () => {
    it('should return true if on LISTS', () => {
      comp.url = 'lists';
      const result = comp.isUrl('lists');
      expect(result).toBe(true);
    });

    it('should NOT true if not LISTS', () => {
      // TODO: fix this when isUrl is fully implemented
      comp.url = 'lists';
      const result = comp.isUrl('not lists');
      expect(result).toBe(false);
    });
  });

  describe('Method: trim', () => {
    it('should remove spaces', () => {
      comp.transactionForm.controls['firstName'].setValue('fakefirst    ');

      comp.trim('firstName');
      const result = comp.transactionForm.controls['firstName'].value;

      expect(result).toEqual('fakefirst');
    });

    it('should not remove spaces', () => {
      comp.transactionForm.controls['firstName'].setValue('fakefirst    1');

      comp.trim('firstName');
      const result = comp.transactionForm.controls['firstName'].value;

      expect(result).toEqual('fakefirst    1');
    });
  });
  describe('Method: PopulateForm() ', () => {
    it('should log an error if no searchType or values is provided', () => {
      logger.error = jasmine.createSpy('error');
      comp.populateForm();
      expect(logger.error).toHaveBeenCalled();
    });
  });
  describe('Method: isPopulated() ', () => {
    it('should return false if NO auditInformation pan is populated ', () => {
        const result = comp.isPopulated('test');
        expect(result).toBeFalsy();
    });
  });

  describe('method: openAddModal', () => {
    it('should emit addButtonEmiter', () => {
      comp.addButtonEmitter.emit = jasmine.createSpy('addButtonEmitter');
      comp.openAddModal();
      expect(comp.addButtonEmitter.emit).toHaveBeenCalled();
    });
  });

  describe('method: openRemModal', () => {
    it('should emit remButtonEmitter', () => {
      comp.remButtonEmitter.emit = jasmine.createSpy('remButtonEmitter');
      comp.openRemModal();
      expect(comp.remButtonEmitter.emit).toHaveBeenCalled();
    });
  });

  describe('method: refreshLists', () => {
    it('should emit refreshListsEmitter', () => {
      comp.refreshListsEmitter.emit = jasmine.createSpy('refreshListsEmitter');
      comp.refreshLists();
      expect(comp.refreshListsEmitter.emit).toHaveBeenCalled();
    });
  });
});
