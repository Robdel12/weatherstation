import React, { useState, useEffect } from 'react';

function avgCollection(collection) {
  let sum = collection.reduce(
    (acc, cv, i, src) => {
      acc.temperature += cv.temperature;
      acc.pressure += cv.pressure;
      acc.humidity += cv.humidity;

      return acc;
    },
    {
      temperature: 0,
      pressure: 0,
      humidity: 0
    }
  );

  return {
    temperature: sum.temperature / collection.length,
    pressure: sum.pressure / collection.length,
    humidity: sum.humidity / collection.length
  };
}

function focusRef(node) {
  // eslint-disable-next-line no-unused-expressions
  node?.focus();
}

function Live() {
  let [collection, updateCollection] = useState([]);
  let [rawData, updateRawData] = useState({
    temperature: 0,
    pressure: 0,
    humidity: 0,
    windSpeed: 0,
    windDirection: 0
  });

  function updateWeather({ data }) {
    let parsedData = JSON.parse(data);
    updateRawData(parsedData);

    // Keep 15 recods around to avg (about 30 seconds of data)
    if (collection.length > 15) {
      collection = collection.slice(0, 14);
    }

    collection = collection.concat(parsedData);
    updateCollection(collection);
  }

  useEffect(() => {
    let protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
    let hasPort = window.location.port ? `:${window.location.port}` : '';
    let hostname = `${window.location.hostname}${hasPort}`;
    // let socket = new WebSocket(`ws:weather.deluca.house/v2`);
    let socket = new WebSocket(`${protocol}${hostname}/v2`);

    socket.addEventListener('message', updateWeather);
    return () => socket.close();
  }, []);

  let data = collection.length < 3 ? rawData : avgCollection(collection);

  return (
    <div data-test-live-route>
      <h1 ref={focusRef} className="text-5xl font-semibold mb-6">
        Live weather
      </h1>
      <div className="md:flex justify-around">
        <div data-test-live-card="wind" className="bg-gray-200 m-3 p-4 flex-grow">
          <h4 data-test-wind className="text-3xl">
            {rawData.windSpeed.toFixed(2)} mph
          </h4>
          <h6 data-test-wind-direction className="text-2xl">
            {rawData.windDirection}
          </h6>
        </div>
        <div data-test-live-card="temp" className="bg-gray-200 m-3 p-4 flex-grow">
          <h4 data-test-temperature className="text-3xl">
            {parseInt(data.temperature, 10)} F
          </h4>
        </div>
        <div data-test-live-card="pressure" className="bg-gray-200 m-3 p-4 flex-grow">
          <h4 data-test-pressure className="text-3xl">
            {parseInt(data.pressure, 10)} hPa
          </h4>
        </div>
        <div data-test-live-card="humidity" className="bg-gray-200 m-3 p-4 flex-grow">
          <h4 data-test-humidity className="text-3xl">
            {parseInt(data.humidity, 10)}%
          </h4>
        </div>
      </div>
    </div>
  );
}

export default Live;
