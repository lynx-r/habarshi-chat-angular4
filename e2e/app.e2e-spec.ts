import { HabarshiWebPage } from './app.po';

describe('habarshi-web App', () => {
  let page: HabarshiWebPage;

  beforeEach(() => {
    page = new HabarshiWebPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
