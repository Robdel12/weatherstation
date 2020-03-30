const timeframe = require('./timeframe');

const PROJECT_V1_TO_V2 = {
  temperature: { $avg: ['$temp', '$barometerTemp'] },
  windSpeed: '$currentWindSpeed',
  windDirection: {
    $switch: {
      default: null,
      branches: [
        ['South', 0],
        ['South West', 45],
        ['West', 90],
        ['North West', 135],
        ['North', 180],
        ['North East', 225],
        ['East', 270],
        ['South East', 315]
      ].map(([dir, deg]) => ({
        case: { $eq: ['$currentWindDirection', dir] },
        then: deg
      }))
    }
  },
  pressure: 1,
  humidity: 1,
  rain: 1,
  createdAt: 1
};

// calulate avg wind direction
// x = sin(rad(dir)) * m/s
// y = cos(rad(dir)) * m/s
// avg = atan2(sum(x),sum(y))
// avg < 0 ? +360
const AVG_WIND_DIR = {
  GROUP: {
    $mergeObjects: {
      $let: {
        vars: {
          dir: { $degreesToRadians: '$windDirection' },
          mps: { $divide: ['$windSpeed', 2.237] }
        },
        in: {
          x: { $sum: { $multiply: [{ $sin: '$$dir' }, '$$mps'] } },
          y: { $sum: { $multiply: [{ $cos: '$$dir' }, '$$mps'] } }
        }
      }
    }
  },
  STAGE: {
    $addFields: {
      windDirection: {
        $cond: [{ $ne: ['$windDirection', null] }, {
          $let: {
            vars: {
              dir: { $radiansToDegrees: { $atan2: ['$windDirection.x', '$windDirection.y'] } }
            },
            in: {
              $add: ['$$dir', { $cond: [{ $lt: ['$$dir', 0] }, 360, 0] }]
            }
          }
        }, null]
      }
    }
  }
};

const GROUP = {
  TOTAL: {
    rain: { $sum: '$rain' }
  },
  AVERAGE: {
    temperature: { $avg: '$temperature' },
    pressure: { $avg: '$pressure' },
    humidity: { $avg: '$humidity' },
    windSpeed: { $avg: '$windSpeed' },
    windDirection: AVG_WIND_DIR.GROUP
  },
  HIGH: {
    temperature: { $max: '$temperature' },
    pressure: { $max: '$pressure' },
    humidity: { $max: '$humidity' },
    windSpeed: { $max: '$windSpeed' },
    rain: { $max: '$rain' }
  },
  LOW: {
    temperature: { $min: '$temperature' },
    pressure: { $min: '$pressure' },
    humidity: { $min: '$humidity' },
    windSpeed: { $min: '$windSpeed' },
    rain: { $min: '$rain' }
  }
};

function groupBy(by, params, optimize) {
  let expression = by && { $dateToString: { date: '$createdAt' } };

  if (by === 'second') {
    expression.$dateToString.format = '%Y-%m-%dT%H:%M:%S';
  } else if (by === 'minute') {
    expression.$dateToString.format = '%Y-%m-%dT%H:%M';
  } else if (by === 'hour') {
    expression.$dateToString.format = '%Y-%m-%dT%H';
  } else if (by === 'day') {
    expression.$dateToString.format = '%Y-%m-%d';
  } else if (by === 'week') {
    expression.$dateToString.format = '%YW%V';
  } else if (by === 'month') {
    expression.$dateToString.format = '%Y-%m';
  } else if (by === 'year') {
    expression.$dateToString.format = '%Y';
  }

  if (optimize) {
    params = optimize.fieldNodes[0].selectionSet.selections
      .reduce((q, { name: { value: property } }) => !params[property] ? q : (
        Object.assign(q, { [property]: params[property] })
      ), {});
  }

  return [
    { $group: { _id: expression || null, ...params } },
    { $addFields: { date: '$_id' } }
  ];
}

function aggregate(collection, stages, params) {
  let { from, to, many, sort, order, limit } = params;
  let [$gt, $lt] = timeframe.range(from, to);

  return new Promise((resolve, reject) => {
    collection.aggregate([
      { $match: { createdAt: { $gt, $lt } } },
      { $project: PROJECT_V1_TO_V2 },
      ...[].concat(stages),
      { $sort: { [sort || 'date']: order || -1 } },
      (!many || limit) && { $limit: limit || 1 }
    ].filter(Boolean)).toArray((err, data) => (
      err ? reject(err) : resolve(many ? data : data[0])
    ));
  });
}

module.exports = {
  total({ from, to }, { app }, info) {
    return aggregate(
      app.locals.db.collection('weather'),
      groupBy(null, GROUP.TOTAL, info),
      { from, to }
    );
  },

  totals({ by, from, to, sort, order, limit }, { app }, info) {
    return aggregate(
      app.locals.db.collection('weather'),
      groupBy(by, GROUP.TOTAL, info),
      { from, to, sort, order, limit, many: true }
    );
  },

  average({ from, to }, { app }, info) {
    return aggregate(
      app.locals.db.collection('weather'),
      groupBy(null, GROUP.AVERAGE, info).concat(AVG_WIND_DIR.STAGE),
      { from, to }
    );
  },

  averages({ by, from, to, sort, order, limit }, { app }, info) {
    return aggregate(
      app.locals.db.collection('weather'),
      groupBy(by, GROUP.AVERAGE, info).concat(AVG_WIND_DIR.STAGE),
      { from, to, sort, order, limit, many: true }
    );
  },

  highest({ from, to }, { app }, info) {
    return aggregate(
      app.locals.db.collection('weather'),
      groupBy(null, GROUP.HIGH, info),
      { from, to }
    );
  },

  highs({ by, from, to, sort, order, limit }, { app }, info) {
    return aggregate(
      app.locals.db.collection('weather'),
      groupBy(by, GROUP.HIGH, info),
      { from, to, sort, order, limit, many: true }
    );
  },

  lowest({ from, to }, { app }, info) {
    return aggregate(
      app.locals.db.collection('weather'),
      groupBy(null, GROUP.LOW, info),
      { from, to }
    );
  },

  lows({ by, from, to, sort, order, limit }, { app }, info) {
    return aggregate(
      app.locals.db.collection('weather'),
      groupBy(by, GROUP.LOW, info),
      { from, to, sort, order, limit, many: true }
    );
  }
};
