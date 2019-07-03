import React from "react";
import { mount } from "testing-hooks/react-dom";
import Highs from "../highs";
import DataCardInteractor from "./data-card.interactor.js";
import Pretender from "pretender";

describe("Highs Component", () => {
  let card = new DataCardInteractor();
  let server;

  beforeEach(() => {
    server = new Pretender(function() {
      let contentType = { "content-type": "application/javascript" };
      let mockedResponse = {
        highTemp: 109.080574,
        highPressure: 985.804993,
        highHumidity: 115.376038,
        highWindSpeed: 16.412001,
        totalRain: 0.21999999999999997
      };

      this.get("/v1/daily-highs", request => [200, contentType, JSON.stringify(mockedResponse)], 100);
      this.get("/v1/weekly-highs", request => [200, contentType, JSON.stringify(mockedResponse)], 100);

      this.get("http://localhost:5338/percy/healthcheck", this.passthrough);
      this.post("http://localhost:5338/percy/snapshot", this.passthrough);
    });
  });

  afterEach(() => {
    server.shutdown();
  });

  it("renders", async () => {
    await mount(<Highs highType="daily" />);

    await card.assert.heading.exists();
  });

  it("renders with mock data", async () => {
    await mount(<Highs highType="daily" />);

    // prettier-ignore
    await card
      .assert.temp.text("Temp: 109.08 F")
      .assert.wind.text("Wind Speed: 16.41 mph")
      .assert.rain.text("Total Rain: 0.22 in")
      .assert.humidity.text("Humidity: 115.38 %")
      .assert.pressure.text("Pressure: 985.80 hPa")
      .snapshot('Daily')
  });

  it("changes the heading based on type", async () => {
    await mount(<Highs highType="weekly" />);

    await card.assert.heading.text("Weekly High").snapshot("Weekly");
  });

  it("shows the loading spinner", async () => {
    server.get(
      "/v1/weekly-highs",
      request => [200, { "content-type": "application/javascript" }, "{}"],
      1000
    );

    await mount(<Highs highType="weekly" />);

    await card.assert.loading.exists().snapshot("loading");
  });

  it("shows an error for network errors", async () => {
    server.get("/v1/weekly-highs", request => [500, { "content-type": "application/javascript" }, "{}"]);

    await mount(<Highs highType="weekly" />);

    await card.assert.error.text("Robert needs to fix this: Internal Server Error (500)").snapshot("error");
  });

  it("fires the hasLoaded event", async () => {
    let didLoad = false;

    await mount(<Highs highType="daily" hasLoaded={() => (didLoad = true)} />);

    // prettier-ignore
    await card.assert.heading.exists()
      .assert(() => didLoad === true);
  });
});
