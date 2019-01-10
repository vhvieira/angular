import { AppModule } from './app.module';

describe('App Module', function () {

  let mod: AppModule;

  beforeEach(function () {
    mod = new AppModule();
  });

  it('should create the module', function () {
    expect(mod).toBeDefined();
  });

});
