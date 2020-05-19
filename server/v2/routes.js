const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema');
const rootValue = require('./queries');

const router = express.Router();

router.post('/collect', (req, res) => {
  let data = JSON.parse(req.body.data);

  req.app.locals.db.collection('weather/v2').insertOne(
    {
      temperature: data.temperature,
      pressure: data.pressure,
      humidity: data.humidity,
      windSpeed: data.windSpeed,
      windDirection: data.windDirection,
      rain: data.rain,
      createdAt: new Date()
    },
    (err, doc) => {
      if (err) {
        res.status(500).json({
          error: 'Failed to create new weather data point.'
        });
      } else {
        req.app.locals.wss.send('v2', doc.ops[0]);
        res.status(201).json(doc.ops[0]);
      }
    });
});

router.use('/graphql', graphqlHTTP({
  // current queries are read-only, so no security concerns around enabling this
  graphiql: true,
  rootValue,
  schema
}));

module.exports = router;
