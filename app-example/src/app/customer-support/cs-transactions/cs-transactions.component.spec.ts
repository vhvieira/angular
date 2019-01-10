import { CsTransactionsComponent } from './cs-transactions.component';
const loggerMock = {
  debug: jasmine.createSpy('debug'),
} as any;

describe('CsTransactionsComponent', function () {

  let component: CsTransactionsComponent;

  beforeEach(function () {
    component = new CsTransactionsComponent(loggerMock);
  });

  describe('Method: ngOnInit ', function () {
    it('should initialize the component', function () {
      component.ngOnInit();
      expect(loggerMock.debug).toHaveBeenCalled();
    });
  });

});
