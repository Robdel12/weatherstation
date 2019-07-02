import React from "react";
import { click } from "interactor.js";
import { mount } from "testing-hooks/react-dom";
import App from "../src/client/app.js";
import AppInteractor from "./interactors/app";
import Pretender from "pretender";

// The apps functionality is so small I can cover it in one file
describe("Acceptance - App", () => {
  let app = new AppInteractor();
  let server;

  before(() => {
    server = new Pretender(function() {
      let contentType = { "content-type": "application/javascript" };
      let averages = {
        totalRain: 0.23,
        avgTemp: 23.23232,
        avgWindSpeed: 2.32,
        avgHumidity: 23.376038,
        avgPressure: 945.804993,
        avgBarometerTemp: 23.23232
      };
      let lows = {
        lowTemp: 23.23232,
        lowHumidity: 23.376038,
        lowPressure: 945.804993
      };
      let highs = {
        highTemp: 109.080574,
        highPressure: 985.804993,
        highHumidity: 115.376038,
        highWindSpeed: 16.412001,
        totalRain: 0.21999999999999997
      };

      this.get("/v1/daily-highs", request => [200, contentType, JSON.stringify(highs)], 100);
      this.get("/v1/weekly-highs", request => [200, contentType, JSON.stringify(highs)], 100);
      this.get("/v1/ten-min-average", response => [200, contentType, JSON.stringify(averages)], 100);
      this.get("/v1/daily-average", request => [200, contentType, JSON.stringify(averages)], 100);
      this.get("/v1/hourly-average", request => [200, contentType, JSON.stringify(averages)], 100);
      this.get("/v1/daily-lows", response => [200, contentType, JSON.stringify(lows)], 100);
      this.get("/v1/weekly-lows", response => [200, contentType, JSON.stringify(lows)], 100);
      this.get("http://localhost:5338/percy/healthcheck", this.passthrough);
      this.post("http://localhost:5338/percy/snapshot", this.passthrough);
    });
  });

  after(() => {
    server.shutdown();
  });

  describe("Home page", () => {
    beforeEach(async () => {
      await mount(<App />);
      //prettier-ignore
      await app
        .navBar.hamburgerMenu.click()
        .navBar.links(0).click();
    });

    it("renders the page", async () => {
      // prettier-ignore
      await app
        .assert.scoped('h1').text("Current weather")
        .assert.tenMinAvg.exists();
    });

    it("renders the 10 min average component", async () => {
      // prettier-ignore
      await app
        .assert.tenMinAvg.temp.text("Temp: 23.23 F")
        .assert.tenMinAvg.baroTemp.text("Barometer Temp: 23.23 F")
        .assert.tenMinAvg.pressure.text("Pressure: 945.80 hPa")
        .assert.tenMinAvg.humidity.text("Humidity: 23.38 %")
        .assert.tenMinAvg.rain.text("Rain total: 0.23 in")
        .assert.tenMinAvg.wind.text("Wind Speed: 2.32 mph")
        .snapshot('Home page')
    });
  });

  describe("Lows page", () => {
    beforeEach(async () => {
      await mount(<App />);
      //prettier-ignore
      await app
        .navBar.hamburgerMenu.click()
        .navBar.links(4).click();
    });

    it("renders the daily lows", async () => {
      // prettier-ignore
      await app
        .assert.lows(0).heading.text('Daily Low')
        .assert.lows(0).temp.text('Temp: 23.23 F')
        .assert.lows(0).pressure.text('Pressure: 945.80 hPa')
        .assert.lows(0).humidity.text('Humidity: 23.38 %')
        .snapshot('Lows page')
    });

    it("renders the weekly lows", async () => {
      // prettier-ignore
      await app
        .assert.lows(1).heading.text('Weekly Low')
        .assert.lows(1).temp.text('Temp: 23.23 F')
        .assert.lows(1).pressure.text('Pressure: 945.80 hPa')
        .assert.lows(1).humidity.text('Humidity: 23.38 %')
    });
  });

  describe("Highs page", () => {
    beforeEach(async () => {
      await mount(<App />);
      //prettier-ignore
      await app
        .navBar.hamburgerMenu.click()
        .navBar.links(3).click();
    });

    it("renders the daily highs", async () => {
      // prettier-ignore
      await app
        .assert.highs(0).heading.text('Daily High')
        .assert.highs(0).temp.text('Temp: 109.08 F')
        .assert.highs(0).pressure.text('Pressure: 985.80 hPa')
        .assert.highs(0).humidity.text('Humidity: 115.38 %')
        .snapshot('Highs page');
    });

    it("renders the weekly highs", async () => {
      // prettier-ignore
      await app
        .assert.highs(1).heading.text('Weekly High')
        .assert.highs(1).temp.text('Temp: 109.08 F')
        .assert.highs(1).pressure.text('Pressure: 985.80 hPa')
        .assert.highs(1).humidity.text('Humidity: 115.38 %');
    });
  });

  describe("Averages page", () => {
    beforeEach(async () => {
      await mount(<App />);
      //prettier-ignore
      await app
        .navBar.hamburgerMenu.click()
        .navBar.links(2).click();
    });

    it("renders the ten min average", async () => {
      // prettier-ignore
      await app
        .assert.averages(0).heading.text('Ten-min Averages')
        .assert.averages(0).temp.text('Temp: 23.23 F')
        .assert.averages(0).pressure.text('Pressure: 945.80 hPa')
        .assert.averages(0).humidity.text('Humidity: 23.38 %')
        .snapshot('Averages page');
    });

    it("renders the hourly average", async () => {
      // prettier-ignore
      await app
        .assert.averages(1).heading.text('Hourly Averages')
        .assert.averages(1).temp.text('Temp: 23.23 F')
        .assert.averages(1).pressure.text('Pressure: 945.80 hPa')
        .assert.averages(1).humidity.text('Humidity: 23.38 %');
    });

    it("renders the daily average", async () => {
      // prettier-ignore
      await app
        .assert.averages(2).heading.text('Daily Averages')
        .assert.averages(2).temp.text('Temp: 23.23 F')
        .assert.averages(2).pressure.text('Pressure: 945.80 hPa')
        .assert.averages(2).humidity.text('Humidity: 23.38 %');
    });
  });
});
