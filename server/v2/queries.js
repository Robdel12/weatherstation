const timeframe = require('./timeframe');

// Calulate average wind direction via a MongoDB query. Sum of x & y is
// accumulated to preserve memory.
//
// x = sin(rad(dir)) * m/s
// y = cos(rad(dir)) * m/s
// avg = atan2(sum(x), sum(y))
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
          // sum(x = sin(rad(dir)) * m/s)
          x: { $sum: { $multiply: [{ $sin: '$$dir' }, '$$mps'] } },
          // sum(y = cos(rad(dir)) * m/s)
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
              // avg = atan2(sum(x), sum(y))
              avg: { $radiansToDegrees: { $atan2: ['$windDirection.x', '$windDirection.y'] } }
            },
            in: {
              // avg < 0 ? +360
              $add: ['$$avg', { $cond: [{ $lt: ['$$avg', 0] }, 360, 0] }]
            }
          }
        }, null]
      }
    }
  }
};

// Aggregate groups for each data type
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

// Group params by a time period, optionally optimized by reducing provided
// params to only those that have been requested via GraphQL.
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

// Common aggregate helper to query data by a timeframe, and sort that
// data. Queries without "many" will always return a single entry.
function aggregate(collection, stages, params) {
  let { from, to, many, sort, order, limit } = params;
  let [$gt, $lt] = timeframe.range(from, to);

  return new Promise((resolve, reject) => {
    collection.aggregate([
      { $match: { createdAt: { $gt, $lt } } },
      ...[].concat(stages),
      { $sort: { [sort || 'date']: order || -1 } },
      (!many || limit) && { $limit: limit || 1 }
    ].filter(Boolean)).toArray((err, data) => (
      err ? reject(err) : resolve(many ? data : data[0])
    ));
  });
}

// Export GraphQL schema resolvers, sometimes referred to as "rootValue"
module.exports = {
  total({ from, to }, { app }, info) {
    return aggregate(
      app.locals.db.collection('weather/v2'),
      groupBy(null, GROUP.TOTAL, info),
      { from, to }
    );
  },

  totals({ by, from, to, sort, order, limit }, { app }, info) {
    return aggregate(
      app.locals.db.collection('weather/v2'),
      groupBy(by, GROUP.TOTAL, info),
      { from, to, sort, order, limit, many: true }
    );
  },

  average({ from, to }, { app }, info) {
    return aggregate(
      app.locals.db.collection('weather/v2'),
      groupBy(null, GROUP.AVERAGE, info).concat(AVG_WIND_DIR.STAGE),
      { from, to }
    );
  },

  averages({ by, from, to, sort, order, limit }, { app }, info) {
    return aggregate(
      app.locals.db.collection('weather/v2'),
      groupBy(by, GROUP.AVERAGE, info).concat(AVG_WIND_DIR.STAGE),
      { from, to, sort, order, limit, many: true }
    );
  },

  highest({ from, to }, { app }, info) {
    return aggregate(
      app.locals.db.collection('weather/v2'),
      groupBy(null, GROUP.HIGH, info),
      { from, to }
    );
  },

  highs({ by, from, to, sort, order, limit }, { app }, info) {
    return aggregate(
      app.locals.db.collection('weather/v2'),
      groupBy(by, GROUP.HIGH, info),
      { from, to, sort, order, limit, many: true }
    );
  },

  lowest({ from, to }, { app }, info) {
    return aggregate(
      app.locals.db.collection('weather/v2'),
      groupBy(null, GROUP.LOW, info),
      { from, to }
    );
  },

  lows({ by, from, to, sort, order, limit }, { app }, info) {
    return aggregate(
      app.locals.db.collection('weather/v2'),
      groupBy(by, GROUP.LOW, info),
      { from, to, sort, order, limit, many: true }
    );
  }
};
