import Pretender from "pretender";
import { mockedIssues } from "./mocks";

export function setupServer() {
  let server = new Pretender(function() {
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
    this.get("/v1/issues", response => [200, contentType, JSON.stringify(mockedIssues)], 100);

    this.get("http://localhost:5338/percy/healthcheck", this.passthrough);
    this.post("http://localhost:5338/percy/snapshot", this.passthrough);
  });

  return server;
}
