const AVG_GROUP = {
  _id: null,
  avgTemp: { $avg: '$temp' },
  avgBarometerTemp: { $avg: '$barometerTemp' },
  avgPressure: { $avg: '$pressure' },
  avgHumidity: { $avg: '$humidity' },
  avgWindSpeed: { $avg: '$currentWindSpeed' },
  totalRain: { $sum: '$rain' }
};

// The sensor data we send from the Photon needs to be condesned
// to fit inside of 64 bytes. This makes those keys readable before
// storing into the DB.
function parseSensorData(rawData) {
  let data = JSON.parse(rawData);
  let temp = parseFloat(data.temp, 10);
  let rain = parseFloat(data.rain, 10);
  let pressure = parseFloat(data.pressure, 10);
  let humidity = parseFloat(data.humidity, 10);
  let altitude = parseFloat(data.altitude, 10);

  return {
    temp,
    rain,
    pressure,
    altitude,
    humidity,
    currentWindSpeed: parseFloat(data.cWindS, 10),
    currentWindDirection: parseWindDirection(data.cWindD),
    barometerTemp: parseFloat(data.baroT, 10)
  };
}

function parseWindDirection(winddir) {
  switch (parseInt(winddir, 10)) {
    case 0:
      return 'North';
    case 1:
      return 'North East';
    case 2:
      return 'East';
    case 3:
      return 'South East';
    case 4:
      return 'South';
    case 5:
      return 'South West';
    case 6:
      return 'West';
    case 7:
      return 'North West';
    default:
    // if nothing else matches, do the
    // default (which is optional)
      return 'None';
  }
}

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log('ERROR: ' + reason);
  res.status(code || 500).json({ error: message });
}

function handleAggregate({ startDate }, db, timeTransform, groupType = AVG_GROUP) {
  let lt = startDate ? new Date(startDate) : new Date();
  let gt = new Date(lt.getTime());

  timeTransform(gt);

  return new Promise((resolve, reject) => {
    db
      .collection('weather')
      .aggregate([
        {
          $match: {
            createdAt: {
              $gt: gt,
              $lt: lt
            }
          }
        },
        {
          $group: groupType
        }
      ])
      .toArray((err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
  });
}

function forceHTTPS(req, res, next) {
  // The 'x-forwarded-proto' check is for Heroku
  if (!req.secure && req.get('x-forwarded-proto') !== 'https' && process.env.NODE_ENV !== 'development') {
    return res.redirect('https://' + req.get('host') + req.url);
  }
  next();
}

module.exports = {
  forceHTTPS,
  handleError,
  handleAggregate,
  parseSensorData,
  parseWindDirection
};
