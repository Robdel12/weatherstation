import React from "react";
import { click } from "interactor.js";
import { mount } from "testing-hooks/react-dom";
import { MemoryRouter } from "react-router";
import App from "../src/client/app.js";
import KnownIssuesInteractor from "./interactors/known-issues";
import { mockedIssues } from "./mocks";
import Pretender from "pretender";

describe("Acceptance - Known Issues route", () => {
  let page = new KnownIssuesInteractor();
  let server;

  before(() => {
    server = new Pretender(function() {
      let contentType = { "content-type": "application/javascript" };

      this.get("/v1/issues", response => [200, contentType, JSON.stringify(mockedIssues)], 100);
    });
  });

  after(() => {
    server.shutdown();
  });

  beforeEach(async () => {
    await mount(<App />);
    //prettier-ignore
    await page
      .appBar.hamburgerMenu.click()
      .appBar.links(5).click();
  });

  it("renders an issue in the list", async () => {
    // prettier-ignore
    await page
      .assert.heading.exists()
      .assert.issues(0).title.text("Improve how wind direction is captured (#36)")
      .assert.issues(0).icon.attribute("data-test-issue-icon", 'bug')
      .assert.issues(0).body.text("This is the content of the issue")
      .snapshot();
  });

  it("renders a chore issue", async () => {
    // prettier-ignore
    await page
      .assert.issues(1).title.text("Fix tests (#31)")
      .assert.issues(1).icon.attribute("data-test-issue-icon", 'chore')
      .assert.issues(1).body.text("This is the content of the issue");
  });

  it("renders an issue", async () => {
    // prettier-ignore
    await page
      .assert.issues(2).title.text("Create feature (#32)")
      .assert.issues(2).icon.attribute("data-test-issue-icon", 'enhancement')
      .assert.issues(2).body.text("This is the content of the issue");
  });
});
