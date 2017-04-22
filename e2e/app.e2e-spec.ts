import { HabarshiwebPage } from './app.po';

describe('habarshiweb App', () => {
  let page: HabarshiwebPage;

  beforeEach(() => {
    page = new HabarshiwebPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
