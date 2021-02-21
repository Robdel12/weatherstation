const { averages, highs, lows } = require('./queries');

async function collectData({ by, from, to, db, collection }) {
  try {
    // app shim for `queries` (which assumes the mongoDB client is on a express variable)
    let app = { locals: { db } };
    let low = await lows({ by, from, to }, { app });
    let high = await highs({ by, from, to }, { app });
    let average = await averages({ by, from, to }, { app });

    let aggregate = {
      low: low[0],
      high: high[0],
      average: average[0]
    };

    console.log('aggregate = ', aggregate);
    return db.collection(collection).insertOne(aggregate);
  } catch (err) {
    console.log('Error collecting aggregate data: ', err);
    return false;
  }
}

function registerJobs(agenda, db) {
  agenda.define('aggregate hour', { lockLifetime: 200000 }, async (job) => {
    console.log('Aggregating hour data');
    return collectData({ collection: 'hour', by: 'hour', from: '1 hour ago', to: '30 seconds ago', db });
  });

  agenda.define('aggregate day', { lockLifetime: 200000 }, async (job) => {
    console.log('Aggregating daily data');
    return collectData({ collection: 'day', by: 'day', from: 'today', to: '30 seconds ago', db });
  });
}

async function startJobs(agenda) {
  await agenda.start();
  console.log('started agenda');

  agenda.every('hour', 'aggregate hour');
  agenda.every('day', 'aggregate day');
}

module.exports = {
  registerJobs,
  startJobs
};
