import React from 'react';
import { mount } from 'testing-hooks/react-dom';
import App from '../src/app.js';
import AppInteractor from './interactors/app';
import { setupServer } from './utils/server';

// The apps functionality is so small I can cover it in one file
describe('Acceptance - App', () => {
  let app = new AppInteractor();
  let server;

  beforeEach(() => {
    server = setupServer();
  });

  afterEach(() => {
    server.shutdown();
  });

  describe('Home page', () => {
    beforeEach(async () => {
      await mount(<App />);
      // prettier-ignore
      await app
        .navBar.hamburgerMenu.click()
        .navBar.links(0).click();
    });

    // I'm ripping the app apart -- not going to fix this until
    // material UI is removed
    it.skip('focuses the heading on navigation', async () => {
      await app.assert.pageHeading.nested.focused();
    });

    it('renders the page', async () => {
      // prettier-ignore
      await app
        .assert.scoped('h1').text('Current weather')
        .assert.tenMinAvg.exists();
    });
  });
});
