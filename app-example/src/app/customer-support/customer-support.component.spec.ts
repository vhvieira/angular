import { CustomerSupportComponent } from './customer-support.component';
const loggerMock = {
  debug: jasmine.createSpy('debug'),
} as any;

describe('CustomerSupportComponent ', function () {

  let component: CustomerSupportComponent;

  beforeEach(function () {
    component = new CustomerSupportComponent(loggerMock);
  });

  describe('Method: ngOnInit ', function () {
    it('should initialize the component', function () {
      component.ngOnInit();
      expect(loggerMock.debug).toHaveBeenCalled();
    });
  });

  describe('Method: ngOnDestroy ', function () {
    it('should be claled when component is destroyed', function () {
      component.ngOnDestroy();
      expect(loggerMock.debug).toHaveBeenCalled();
    });
  });
});
