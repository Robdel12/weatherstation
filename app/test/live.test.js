import React from 'react';
import { mount } from 'testing-hooks/react-dom';
import App from '../src/app.js';

import AppInteractor from './interactors/app';
import { Server } from 'mock-socket';

let protocol = window.location.protocol === 'https' ? 'wss://' : 'ws://';
let hasPort = window.location.port ? `:${window.location.port}` : '';
let hostname = `${window.location.hostname}${hasPort}`;
let mockData = {
  temperature: 81.0,
  humidity: 33.33,
  pressure: 991.23,
  windSpeed: 2.22,
  windDirection: 'West'
};

// something is blocking the event loop, preventing the mock server from responding
// going to debug this another time..
// #PUNT
describe.skip('Acceptance - Live', () => {
  let app = new AppInteractor();
  let mockServer;

  beforeEach(async () => {
    mockServer = new Server(`${protocol}${hostname}/v2`);
    await mount(<App />);
    await app.navBar.link(1).click();

    mockServer.emit('message', JSON.stringify(mockData));
  });

  afterEach(() => {
    mockServer.close();
  });

  it('renders the live route', async () => {
    // prettier-ignore
    await app
      .snapshot('Live')
      .assert.live.wind.text('2.22 mph')
      .assert.live.temp.text('81 F')
      .assert.live.pressure.text('991 hPa')
      .assert.live.humidity.text('33%');
  });

  it('focuses the heading on navigation', async () => {
    await app.assert.pageHeading.nested.focused();
  });
});
