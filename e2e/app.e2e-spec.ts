import { Praxticol8Page } from './app.po';

describe('praxticol8 App', function() {
  let page: Praxticol8Page;

  beforeEach(() => {
    page = new Praxticol8Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
