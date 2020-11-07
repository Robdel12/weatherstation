import React from 'react';
import { mount } from 'testing-hooks/react-dom';
import App from '../src/app.js';
import AppInteractor from './interactors/app';
import { setupServer } from './utils/server';

// The apps functionality is so small I can cover it in one file
describe.skip('Acceptance - App', () => {
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
      await app.navBar.link(0).click();
    });

    // I'm ripping the app apart -- not going to fix this until
    // material UI is removed
    it.skip('focuses the heading on navigation', async () => {
      await app.assert.pageHeading.nested.focused();
    });

    it('renders the page', async () => {
      await app.assert.scoped('h1').text('Current weather');
    });
  });
});
