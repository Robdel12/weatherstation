const { buildSchema } = require('graphql');

module.exports = buildSchema(`
  type Weather {
    temperature: Float
    pressure: Float
    humidity: Float
    windSpeed: Float
    windDirection: Float
    rain: Float
    date: String
  }

  enum WeatherGroup {
    minute
    hour
    day
    week
    month
    year
  }

  enum WeatherSort {
    temperature
    pressure
    humidity
    windSpeed
    windDirection
    rain
    date
  }

  type Query {
    total(
      from: String!,
      to: String
    ): Weather

    totals(
      by: WeatherGroup!,
      from: String!,
      to: String,
      sort: WeatherSort,
      order: Int,
      limit: Int
    ): [Weather]

    average(
      from: String!,
      to: String
    ): Weather

    averages(
      by: WeatherGroup!,
      from: String!,
      to: String,
      sort: WeatherSort,
      order: Int,
      limit: Int
    ): [Weather]

    highest(
      from: String!,
      to: String
    ): Weather

    highs(
      by: WeatherGroup!,
      from: String!,
      to: String,
      sort: WeatherSort,
      order: Int,
      limit: Int
    ): [Weather]

    lowest(
      from: String!,
      to: String
    ): Weather

    lows(
      by: WeatherGroup!,
      from: String!,
      to: String,
      sort: WeatherSort,
      order: Int,
      limit: Int
    ): [Weather]
  }
`);
