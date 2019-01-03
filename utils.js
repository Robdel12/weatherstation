// The sensor data we send from the Photon needs to be condesned
// to fit inside of 64 bytes. This makes those keys readable before
// storing into the DB.
function parseSensorData(rawData) {
  let data = JSON.parse(rawData);
  let { pressure, humidity, temp } = data;

  return {
    temp,
    pressure,
    humidity,
    currentWindSpeed: data.cWindS,
    currentWindDirection: parseWindDirection(data.cWindD),
    dailyRain: data.dRain,
    hourlyRain: data.hRain,
    barometerTemp: data.baroT
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
