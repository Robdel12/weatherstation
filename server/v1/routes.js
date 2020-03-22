let express = require('express');
let GithubGraphQLApi = require('node-github-graphql');
let { parseSensorData, handleAggregate, handleError } = require('./utils');

const WEATHER_COLLECTION = 'weather';

let router = express.Router();

// Start collecting the data sent from the Photon and store it in a mongoDB
router.post('/collect', function(req, res) {
  let data = parseSensorData(req.body.data);

  // Record when the server has saved this data
  data.createdAt = new Date();

  req.app.locals.db.collection(WEATHER_COLLECTION).insertOne(data, function(err, doc) {
    if (err) {
      handleError(res, err.message, 'Failed to create new weather data point.');
    } else {
      req.app.locals.wss.send('v1', doc.ops[0]);
      res.status(201).json(doc.ops[0]);
    }
  });
});

// TODO this will grow to handle the future front end dashboard params (or will it?)
router.get('/weather', function(req, res) {
  let limit = parseInt(req.query.limit, 10) || 20;

  req.app.locals.db
    .collection('weather')
    .find({})
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray(function(err, docs) {
      if (err) {
        handleError(res, err.message, 'Failed to get weather data. :/');
      } else {
        res.status(200).json(docs);
      }
    });
});

router.get('/ten-min-average', function(req, res) {
  handleAggregate(req.query, req.app.locals.db, timeAgo =>
    timeAgo.setMinutes(timeAgo.getMinutes() - 10)
  ).then(data => {
    if (data.length === 0) {
      res.status(200).json({ message: 'no records found' });
    } else {
      res.status(200).json(data[0]);
    }
  });
});

router.get('/daily-highs', function(req, res) {
  handleAggregate(req.query, req.app.locals.db, timeAgo => timeAgo.setDate(timeAgo.getDate() - 1), {
    _id: null,
    highTemp: { $max: '$temp' },
    highPressure: { $max: '$pressure' },
    highHumidity: { $max: '$humidity' },
    highWindSpeed: { $max: '$currentWindSpeed' },
    totalRain: { $sum: '$rain' }
  }).then(data => {
    if (data.length === 0) {
      res.status(200).json({ message: 'no records found' });
    } else {
      res.status(200).json(data[0]);
    }
  });
});

router.get('/weekly-highs', function(req, res) {
  handleAggregate(req.query, req.app.locals.db, timeAgo => timeAgo.setDate(timeAgo.getDate() - 7), {
    _id: null,
    highTemp: { $max: '$temp' },
    highPressure: { $max: '$pressure' },
    highHumidity: { $max: '$humidity' },
    highWindSpeed: { $max: '$currentWindSpeed' },
    totalRain: { $sum: '$rain' }
  }).then(data => {
    if (data.length === 0) {
      res.status(200).json({ message: 'no records found' });
    } else {
      res.status(200).json(data[0]);
    }
  });
});

router.get('/daily-lows', function(req, res) {
  handleAggregate(req.query, req.app.locals.db, timeAgo => timeAgo.setDate(timeAgo.getDate() - 1), {
    _id: null,
    lowTemp: { $min: '$temp' },
    lowPressure: { $min: '$pressure' },
    lowHumidity: { $min: '$humidity' }
  }).then(data => {
    if (data.length === 0) {
      res.status(200).json({ message: 'no records found' });
    } else {
      res.status(200).json(data[0]);
    }
  });
});

router.get('/weekly-lows', function(req, res) {
  handleAggregate(req.query, req.app.locals.db, timeAgo => timeAgo.setDate(timeAgo.getDate() - 7), {
    _id: null,
    lowTemp: { $min: '$temp' },
    lowPressure: { $min: '$pressure' },
    lowHumidity: { $min: '$humidity' }
  }).then(data => {
    if (data.length === 0) {
      res.status(200).json({ message: 'no records found' });
    } else {
      res.status(200).json(data[0]);
    }
  });
});

router.get('/hourly-average', function(req, res) {
  handleAggregate(req.query, req.app.locals.db, timeAgo => timeAgo.setHours(timeAgo.getHours() - 1)).then(
    data => {
      if (data.length === 0) {
        res.status(200).json({ message: 'no records found' });
      } else {
        res.status(200).json(data[0]);
      }
    }
  );
});

router.get('/daily-average', function(req, res) {
  handleAggregate(req.query, req.app.locals.db, timeAgo => timeAgo.setDate(timeAgo.getDate() - 1)).then(
    data => {
      if (data.length === 0) {
        res.status(200).json({ message: 'no records found' });
      } else {
        res.status(200).json(data[0]);
      }
    }
  );
});

router.get('/issues', function(req, expressRes) {
  let github = new GithubGraphQLApi({
    token: process.env.GITHUB_API_TOKEN
  });

  let query = `{
    viewer {
      repository(name: "weatherstation") {
        issues(last: 100, states: [OPEN]) {
          edges {
            node {
              id
              url
              number
              title
              body
              bodyHTML
              updatedAt
              labels(first: 30) {
                edges {
                  node {
                    id
                    name
                  }
                }
              }
            }
          }
        }
      }
    }
  }`;

  github.query(query, null, (res, err) => {
    if (err) {
      expressRes.status(500).json({ message: err });
    } else {
      let issues = res.data.viewer.repository.issues.edges;
      let sortedIssues = issues.sort((a, b) => new Date(b.node.updatedAt) - new Date(a.node.updatedAt));

      expressRes.status(200).json({ issues: sortedIssues });
    }
  });
});

module.exports = router;
