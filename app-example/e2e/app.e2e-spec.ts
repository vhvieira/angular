import { AppPage } from './app.po';

describe('Customer Support App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should pass sanity test', () => {
    page.navigateTo();
    expect(true).toBe(true);
  });
});
