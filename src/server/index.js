let path = require('path');
let express = require("express");
let bodyParser = require("body-parser");
let mongodb = require("mongodb");
let { parseSensorData, handleAverage, handleError } = require('./utils');

const WEATHER_COLLECTION = 'weather';
const WEBHOOK_COLLECTION = 'webhookData';
const LOCAL_DB = 'mongodb://localhost:27017/weatherstation';
const DB_ADDRESS = process.env.MONGODB_URI || LOCAL_DB;
const CLIENT_FILE_PATH = `${__dirname}/../../dist`;

let db;
let app = express();
let { ObjectID } = mongodb. ObjectID;

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
  handleAverage(req.query, db, (timeAgo) => timeAgo.setMinutes(timeAgo.getMinutes() - 10)).then(data => {
    if(data.length === 0) {
      res.status(200).json({ message: 'no records found' });
    } else {
      res.status(200).json(data[0]);
    }
  });
});

app.get("/v1/hourly-average", function(req, res) {
  handleAverage(req.query, db, (timeAgo) => timeAgo.setHours(timeAgo.getHours() - 1)).then(data => {
    if(data.length === 0) {
      res.status(200).json({ message: 'no records found' });
    } else {
      res.status(200).json(data[0]);
    }
  });
});

app.get("/v1/daily-average", function(req, res) {
  handleAverage(req.query, db, (timeAgo) => timeAgo.setDate(timeAgo.getDate() - 1)).then(data => {
    if(data.length === 0) {
      res.status(200).json({ message: 'no records found' });
    } else {
      res.status(200).json(data[0]);
    }
  });
});

// This must be last i n the file. Is this fragile? Probably
app.get("/**", function(req, res) {
  res.sendFile(path.resolve(`${CLIENT_FILE_PATH}/index.html`));
});
