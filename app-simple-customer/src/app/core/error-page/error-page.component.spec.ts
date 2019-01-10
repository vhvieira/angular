import { MCErrorComponent } from './error-page.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs/observable/of';
import { Location } from '@angular/common';

let component: MCErrorComponent;
const activatedRouteMock = {
  queryParams: of({code: 'code', description: 'desc'})
} as any as ActivatedRoute;

const locationMock = {
  back: jasmine.createSpy('back')
} as any as Location;

describe('Component: MCErrorPage ', () => {
  beforeEach(() => {
    component = new MCErrorComponent(activatedRouteMock, locationMock);
  });

  describe('Method: ngOnInit ', () => {
    it('should get the params from current route to use as this.error ', () => {
      component.ngOnInit();
      expect(component.error).toEqual({ code: 'code', text: 'desc' });
    });
  });

  describe('Method: goBack ', () => {
    it('should call location.back() ', () => {
      component.goBack();
      expect(locationMock.back).toHaveBeenCalled();
    });
  });
});
