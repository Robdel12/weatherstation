import React from "react";
import { click } from "interactor.js";
import { mount } from "testing-hooks/react-dom";
import { MemoryRouter } from "react-router";
import App from "../src/client/app.js";
import LowsPage from "./interactors/lows";
import { mockedIssues } from "./mocks";
import Pretender from "pretender";

describe("Acceptance - Lows route", () => {
  let page = new LowsPage();
  let server;

  before(() => {
    server = new Pretender(function() {
      let contentType = { "content-type": "application/javascript" };
      let mockedData = {
        lowTemp: 23.23232,
        lowPressure: 945.804993,
        lowHumidity: 23.376038
      };

      this.get("/v1/daily-lows", response => [200, contentType, JSON.stringify(mockedData)], 100);
      this.get("/v1/weekly-lows", response => [200, contentType, JSON.stringify(mockedData)], 100);
      this.get("http://localhost:5338/percy/healthcheck", this.passthrough);
      this.post("http://localhost:5338/percy/snapshot", this.passthrough);
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
      .appBar.links(4).click();
  });

  it("renders the daily lows", async () => {
    // prettier-ignore
    await page
      .assert.lows(0).heading.text('Daily Low')
      .assert.lows(0).temp.text('Temp: 23.23 F')
      .assert.lows(0).pressure.text('Pressure: 945.80 hPa')
      .assert.lows(0).humidity.text('Humidity: 23.38 %')
      .snapshot()
  });

  it("renders the weekly lows", async () => {
    // prettier-ignore
    await page
      .assert.lows(1).heading.text('Weekly Low')
      .assert.lows(1).temp.text('Temp: 23.23 F')
      .assert.lows(1).pressure.text('Pressure: 945.80 hPa')
      .assert.lows(1).humidity.text('Humidity: 23.38 %')
  });
});
