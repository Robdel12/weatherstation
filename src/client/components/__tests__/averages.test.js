import React from "react";
import { mount } from "testing-hooks/react-dom";
import Averages from "../average";
import DataCardInteractor from "./data-card.interactor.js";
import Pretender from "pretender";

describe("Averages Component", () => {
  let card = new DataCardInteractor();
  let server;

  beforeEach(() => {
    server = new Pretender(function() {
      let contentType = { "content-type": "application/javascript" };
      let mockedResponse = {
        avgTemp: 109.080574,
        avgPressure: 985.804993,
        avgHumidity: 115.376038,
        avgWindSpeed: 16.412001,
        totalRain: 0.21999999999999997
      };

      this.get("/v1/daily-average", request => [200, contentType, JSON.stringify(mockedResponse)], 100);
      this.get("/v1/weekly-average", request => [200, contentType, JSON.stringify(mockedResponse)], 100);
      this.get("/v1/hourly-average", request => [200, contentType, JSON.stringify(mockedResponse)], 100);

      this.get("http://localhost:5338/percy/healthcheck", this.passthrough);
      this.post("http://localhost:5338/percy/snapshot", this.passthrough);
    });
  });

  afterEach(() => {
    server.shutdown();
    server = null;
  });

  it("renders", async () => {
    await mount(<Averages avgType="daily" />);

    await card.assert.heading.exists();
  });

  it("renders with mock data", async () => {
    await mount(<Averages avgType="daily" />);

    // prettier-ignore
    await card
      .assert.temp.text("Temp: 109.08 F")
      .assert.wind.text("Wind Speed: 16.41 mph")
      .assert.rain.text("Rain total: 0.22 in")
      .assert.humidity.text("Humidity: 115.38 %")
      .assert.pressure.text("Pressure: 985.80 hPa")
      .snapshot("Averages - daily")
  });

  it("changes the heading based on type", async () => {
    await mount(<Averages avgType="weekly" />);

    await card.assert.heading.text("Weekly Averages").snapshot("Averages - weekly");
  });

  it("shows the loading spinner", async () => {
    server.get(
      "/v1/weekly-average",
      request => [200, { "content-type": "application/javascript" }, JSON.stringify({})],
      1000
    );

    await mount(<Averages avgType="weekly" />);

    // prettier-ignore
    await card
      .assert.loading.exists()
      .snapshot("Averages - loading")
  });

  it("shows an error for network errors", async () => {
    server.get("/v1/weekly-average", request => [500, { "content-type": "application/javascript" }, "{}"]);

    await mount(<Averages avgType="weekly" />);

    await card.assert.error
      .text("Robert needs to fix this: Internal Server Error (500)")
      .snapshot("Averages - error");
  });

  it("fires the hasLoaded event", async () => {
    let didLoad = false;

    await mount(<Averages avgType="daily" hasLoaded={() => (didLoad = true)} />);

    // prettier-ignore
    await card.assert.heading.exists()
      .assert(() => didLoad === true);
  });
});
