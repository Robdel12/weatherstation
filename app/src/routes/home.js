import { useQuery } from 'urql';
import React, { useState } from 'react';
import {
  LineChart as ReLineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const HighsAndLowsQuery = `
  query($from: String!, $by: WeatherGroup!) {
    rain:totals(from: $from, by: $by) {
      date
      rain
    }
    humidityHighs:highs(from: $from, by: $by) {
      date
      high:humidity
    }
    humidityLows:lows(from: $from, by: $by) {
      date
      low:humidity
    }
    pressureHighs:highs(from: $from, by: $by) {
      date
      high:pressure
    }
    pressureLows:lows(from: $from, by: $by) {
      date
      low:pressure
    }
    temperatureHighs:highs(from: $from, by: $by) {
      date
      high:temperature
    }
    temperatureLows:lows(from: $from, by: $by) {
      date
      low:temperature
    }
    wind:highs(from: $from, by: $by) {
      date
      windSpeed
    }
  }
`;

// wtf is this name robert
function LineChart({ data, domain, dataKey, render = () => {} }) {
  return (
    <ResponsiveContainer minWidth={325} height={300}>
      <ReLineChart
        data={data}
        margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
        syncId="highsAndLows"
      >
        <Line type="monotone" dataKey={dataKey} stroke="#8884d8" />
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <XAxis dataKey="date" />
        <YAxis domain={domain} />
        <Tooltip />
        {render()}
      </ReLineChart>
    </ResponsiveContainer>
  );
}

let zipper = (high, low) =>
  high.map((obj, index) => ({ ...obj, low: low[index].low }));

function Home() {
  let [from, setFrom] = useState('last week');
  let [by, setBy] = useState('day');

  let [result] = useQuery({
    query: HighsAndLowsQuery,
    variables: { from, by }
  });

  let { data, fetching, error } = result;
  if (error) return <p>{error?.message}</p>;

  return (
    <>
      <h1 className="text-5xl font-semibold mb-5">Weather</h1>
      <h3 className="text-3xl mb-5">Highs & lows</h3>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label htmlFor="fromSelect">From last:</label>
          <select
            value={from}
            onChange={(event) => setFrom(event.target.value)}
            id="fromSelect"
          >
            <option value="last hour">Hour</option>
            <option value="last day">Day</option>
            <option value="last week">Week</option>
            <option value="last month">Month</option>
            <option value="last year">Year</option>
          </select>
        </div>

        <div>
          <label htmlFor="bySelect">By:</label>
          <select
            value={by}
            onChange={(event) => setBy(event.target.value)}
            id="bySelect"
          >
            <option value="minute">Minute</option>
            <option value="hour">Hour</option>
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
            <option value="year">Year</option>
          </select>
        </div>
      </div>

      {fetching && <p className="my-6">Loading...</p>}
      {data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <h3 className="text-xl mb-4">Rain</h3>
            <LineChart data={data.rain.reverse()} dataKey="rain" />
          </div>
          <div>
            <h3 className="text-xl mb-4">Pressure</h3>
            <LineChart
              data={zipper(data.pressureHighs, data.pressureLows).reverse()}
              dataKey="high"
              domain={[800, 1200]}
              render={() => (
                <Line type="monotone" dataKey="low" stroke="#8884d8" />
              )}
            />
          </div>
          <div>
            <h3 className="text-xl mb-4">Temperature</h3>
            <LineChart
              data={zipper(
                data.temperatureHighs,
                data.temperatureLows
              ).reverse()}
              dataKey="high"
              render={() => (
                <Line type="monotone" dataKey="low" stroke="#8884d8" />
              )}
            />
          </div>
          <div>
            <h3 className="text-xl mb-4">Humidity</h3>
            <LineChart
              data={zipper(data.humidityHighs, data.humidityLows).reverse()}
              dataKey="high"
              render={() => (
                <Line type="monotone" dataKey="low" stroke="#8884d8" />
              )}
            />
          </div>
          <div>
            <h3 className="text-xl mb-4">Wind</h3>
            <LineChart data={data.wind.reverse()} dataKey="windSpeed" />
          </div>
        </div>
      )}
    </>
  );
}

export default Home;
