// The sensor data we send from the Photon needs to be condesned
// to fit inside of 64 bytes. This makes those keys readable before
// storing into the DB.
function parseSensorData(rawData) {
  let data = JSON.parse(rawData);
  let temp = parseFloat(data.temp, 10);
  let pressure = parseFloat(data.pressure, 10);
  let humidity = parseFloat(data.humidity, 10);
  let altitude = parseFloat(data.altitude, 10);

  return {
    temp,
    pressure,
    altitude,
    humidity,
    currentWindSpeed: parseFloat(data.cWindS, 10),
    currentWindDirection: parseWindDirection(data.cWindD),
    dailyRain: parseFloat(data.dRain, 10),
    hourlyRain: parseFloat(data.hRain, 10),
    barometerTemp: parseFloat(data.baroT, 10)
  };
}

function parseWindDirection(winddir) {
  switch (parseInt(winddir, 10)) {
  case 0:
    return "North";
  case 1:
    return "North East";
  case 2:
    return "East";
  case 3:
    return "South East";
  case 4:
    return "South";
  case 5:
    return "South West";
  case 6:
    return "West";
  case 7:
    return "North West";
  default:
    // if nothing else matches, do the
    // default (which is optional)
    return "None";
  }
}

module.exports = {
  parseSensorData,
  parseWindDirection
};
