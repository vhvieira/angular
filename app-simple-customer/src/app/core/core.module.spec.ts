import { CoreModule, customTranslateLoader, getAppBaseHref } from './core.module';

describe('Core Module', function () {

  it('should load CoreModule only once', function () {
    let core, coreWithParent, exception;

    try {
      core = new CoreModule();
      coreWithParent = new CoreModule(core);
    } catch (e) {
      exception = e;
    } finally {
      expect(core).toBeTruthy();
      expect(coreWithParent).toBeUndefined();
      expect(exception).toBeTruthy();
    }
  });

  it('should get a loader', function() {
    const loader: any = customTranslateLoader({} as any);
    expect(loader).toBeDefined();
  });

  describe('getAppBaseHref()', () => {
    it('should return the pathname if the window exists', () => {
      const gabh = getAppBaseHref();
      expect(gabh).toBeDefined();
    });
  });

});
