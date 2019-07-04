import React from "react";
import { click } from "interactor.js";
import { mount } from "testing-hooks/react-dom";
import App from "../src/client/app.js";
import { scoped } from "interactor.js";
import AppInteractor from "./interactors/app";
import { setupServer } from "./utils/server";

describe("Acceptance - Live", () => {
  let app = new AppInteractor();
  let server;

  beforeEach(async () => {
    server = setupServer();
    await mount(<App />);

    // prettier-ignore
    await app
      .navBar.hamburgerMenu.click()
      .navBar.links(1).click();
  });

  afterEach(() => {
    server.shutdown();
  });

  it("renders the live route", async () => {
    // prettier-ignore
    await app
      .assert.live(0).temp.text("81 F")
      .assert.live(0).baroTemp.text("Barometer temp 81 F")
      .assert.live(0).wind.text("0.00 mph (West)")
      .snapshot('Live')
  });

  // This will be purposefully slow.
  it("polls", async function() {
    this.timeout(8000);

    // prettier-ignore
    await app
      .assert.live(0).temp.text("81 F")
      .assert.live(1).temp.text("81 F")
      .assert.live(2).temp.text("81 F")
      .snapshot('Live with three cards')
      .timeout(8000);
  });
});
