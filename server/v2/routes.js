const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema');
const rootValue = require('./queries');

const router = express.Router();

router.post('/collect', (req, res) => {
  req.app.locals.db.collection('weather/v2')
    .insertOne({
      temperature: req.body.data.temperature,
      pressure: req.body.data.pressure,
      humidity: req.body.data.humidity,
      windSpeed: req.body.data.windSpeed,
      windDirection: req.body.data.windDirection,
      rain: req.body.data.rain,
      createdAt: new Date()
    }, (err, doc) => {
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
