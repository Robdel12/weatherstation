let path = require('path');
let express = require("express");
let bodyParser = require("body-parser");
let mongodb = require("mongodb");
let GithubGraphQLApi = require('node-github-graphql')
let { parseSensorData, handleAggregate, handleError, forceHTTPS } = require('./utils');

const WEATHER_COLLECTION = 'weather';
const WEBHOOK_COLLECTION = 'webhookData';
const LOCAL_DB = 'mongodb://localhost:27017/weatherstation';
const DB_ADDRESS = process.env.MONGODB_URI || LOCAL_DB;
const CLIENT_FILE_PATH = `${__dirname}/../../app/dist`;

let db;
let app = express();
let { ObjectID } = mongodb. ObjectID;

app.use(forceHTTPS);
app.use(bodyParser.json());
app.use(express.static(path.join(CLIENT_FILE_PATH)));

// Connect to the database before starting the application server.
mongodb.MongoClient.connect(DB_ADDRESS, { useNewUrlParser: true }, function (err, client) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = client.db();
  console.log("Database connection ready");

  // Initialize the app.
  let server = app.listen(process.env.PORT || 8080, function () {
    let port = server.address().port;
    console.log(`App now running on http://localhost:${port}`);
  });
});

// Start collecting the data sent from the Photon and store it in a mongoDB
app.post("/v1/collect", function(req, res) {
  let data = parseSensorData(req.body.data);

  // Record when the server has saved this data
  data.createdAt = new Date();

  db.collection(WEATHER_COLLECTION).insertOne(data, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to create new weather data point.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
});

// TODO this will grow to handle the future front end dashboard params (or will it?)
app.get("/v1/weather", function(req, res) {
  let limit = parseInt(req.query.limit, 10) || 20;

  db.collection('weather').find({}).sort({ createdAt: -1 }).limit(limit).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get weather data. :/");
    } else {
      res.status(200).json(docs);
    }
  });
});

app.get("/v1/ten-min-average", function(req, res) {
  handleAggregate(req.query, db, (timeAgo) => timeAgo.setMinutes(timeAgo.getMinutes() - 10)).then(data => {
    if(data.length === 0) {
      res.status(200).json({ message: 'no records found' });
    } else {
      res.status(200).json(data[0]);
    }
  });
});

app.get("/v1/daily-highs", function(req, res) {
  handleAggregate(req.query, db, (timeAgo) => timeAgo.setDate(timeAgo.getDate() - 1), {
  "_id": null,
  "highTemp": { "$max": "$temp" },
  "highPressure": { "$max": "$pressure" },
  "highHumidity": { "$max": "$humidity" },
  "highWindSpeed": { "$max": "$currentWindSpeed" },
  "totalRain": { "$sum": "$rain" }
}).then(data => {
    if(data.length === 0) {
      res.status(200).json({ message: 'no records found' });
    } else {
      res.status(200).json(data[0]);
    }
  });
});

app.get("/v1/weekly-highs", function(req, res) {
  handleAggregate(req.query, db, (timeAgo) => timeAgo.setDate(timeAgo.getDate() - 7), {
  "_id": null,
  "highTemp": { "$max": "$temp" },
  "highPressure": { "$max": "$pressure" },
  "highHumidity": { "$max": "$humidity" },
  "highWindSpeed": { "$max": "$currentWindSpeed" },
  "totalRain": { "$sum": "$rain" }
}).then(data => {
    if(data.length === 0) {
      res.status(200).json({ message: 'no records found' });
    } else {
      res.status(200).json(data[0]);
    }
  });
});

app.get("/v1/daily-lows", function(req, res) {
  handleAggregate(req.query, db, (timeAgo) => timeAgo.setDate(timeAgo.getDate() - 1), {
  "_id": null,
  "lowTemp": { "$min": "$temp" },
  "lowPressure": { "$min": "$pressure" },
  "lowHumidity": { "$min": "$humidity" },
}).then(data => {
    if(data.length === 0) {
      res.status(200).json({ message: 'no records found' });
    } else {
      res.status(200).json(data[0]);
    }
  });
});

app.get("/v1/weekly-lows", function(req, res) {
  handleAggregate(req.query, db, (timeAgo) => timeAgo.setDate(timeAgo.getDate() - 7), {
  "_id": null,
  "lowTemp": { "$min": "$temp" },
  "lowPressure": { "$min": "$pressure" },
  "lowHumidity": { "$min": "$humidity" },
}).then(data => {
    if(data.length === 0) {
      res.status(200).json({ message: 'no records found' });
    } else {
      res.status(200).json(data[0]);
    }
  });
});

app.get("/v1/hourly-average", function(req, res) {
  handleAggregate(req.query, db, (timeAgo) => timeAgo.setHours(timeAgo.getHours() - 1)).then(data => {
    if(data.length === 0) {
      res.status(200).json({ message: 'no records found' });
    } else {
      res.status(200).json(data[0]);
    }
  });
});

app.get("/v1/daily-average", function(req, res) {
  handleAggregate(req.query, db, (timeAgo) => timeAgo.setDate(timeAgo.getDate() - 1)).then(data => {
    if(data.length === 0) {
      res.status(200).json({ message: 'no records found' });
    } else {
      res.status(200).json(data[0]);
    }
  });
});

app.get("/v1/issues", function(req, expressRes) {
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
    if(err) {
      expressRes.status(500).json({ message: err });
    } else {
      let issues = res.data.viewer.repository.issues.edges;
      let sortedIssues = issues.sort((a, b) => new Date(b.node.updatedAt) - new Date(a.node.updatedAt))

      expressRes.status(200).json({ issues: sortedIssues });
    }
  })
});


// This must be last i n the file. Is this fragile? Probably
app.get("/**", function(req, res) {
  res.sendFile(path.resolve(`${CLIENT_FILE_PATH}/index.html`));
});
