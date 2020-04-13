import React from 'react';
import { mount } from 'testing-hooks/react-dom';
import App from '../src/app.js';

import AppInteractor from './interactors/app';
import { Server } from 'mock-socket';

let protocol = window.location.protocol === 'https' ? 'wss://' : 'ws://';
let hasPort = window.location.port ? `:${window.location.port}` : '';
let hostname = `${window.location.hostname}${hasPort}`;
let mockData = {
  temp: 81.00,
  humidity: 33.33,
  pressure: 991.23,
  currentWindSpeed: 2.22,
  currentWindDirection: 'West'
};

describe('Acceptance - Live', () => {
  let app = new AppInteractor();
  let mockServer;

  beforeEach(async () => {
    mockServer = new Server(`${protocol}${hostname}/v1`);

    await mount(<App />);

    // prettier-ignore
    await app
      .navBar.hamburgerMenu.click()
      .navBar.links(1).click();

    mockServer.emit('message', JSON.stringify(mockData));
  });

  afterEach(() => {
    mockServer.close();
  });

  it('renders the live route', async () => {
    // prettier-ignore
    await app
      .assert.live(0).temp.text('81 F')
      .assert.live(0).humidity.text(' 33%')
      .assert.live(0).wind.text('2.22 mph (West)')
      .snapshot('Live');
  });

  it('focuses the heading on navigation', async () => {
    await app.assert.pageHeading.nested.focused();
  });
});
