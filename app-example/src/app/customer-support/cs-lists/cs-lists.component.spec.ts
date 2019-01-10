import { CsListsComponent } from './cs-lists.component';
const loggerMock = {
  debug: jasmine.createSpy('debug'),
} as any;

describe('CsListsComponent', function () {

  let component: CsListsComponent;

  beforeEach(function () {
    component = new CsListsComponent(loggerMock);
  });

  describe('Method: ngOnInit ', function () {
    it('should initialize the component', function () {
      component.ngOnInit();
      expect(loggerMock.debug).toHaveBeenCalled();
    });
  });

});
