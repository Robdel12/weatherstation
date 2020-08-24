import React from 'react';
import { mount } from 'testing-hooks/react-dom';
import App from '../src/app.js';
import KnownIssuesInteractor from './interactors/known-issues';
import { setupServer } from './utils/server';

describe('Acceptance - Known Issues route', () => {
  let page = new KnownIssuesInteractor();
  let server;

  beforeEach(() => {
    server = setupServer();
  });

  afterEach(() => {
    server.shutdown();
  });

  beforeEach(async () => {
    await mount(<App />);
    await page.navBar.link(2).click();
  });

  it('renders an issue in the list', async () => {
    // prettier-ignore
    await page
      .assert.heading.exists()
      .assert.issues(0).title.text('Improve how wind direction is captured (#36)')
      .assert.issues(0).body.text('This is the content of the issue')
      .snapshot();
  });

  it('renders a chore issue', async () => {
    // prettier-ignore
    await page
      .assert.issues(1).title.text('Fix tests (#31)')
      .assert.issues(1).body.text('This is the content of the issue');
  });

  it('renders an issue', async () => {
    // prettier-ignore
    await page
      .assert.issues(2).title.text('Create feature (#32)')
      .assert.issues(2).body.text('This is the content of the issue');
  });
});
