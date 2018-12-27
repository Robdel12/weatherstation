const express = require("express");
const bodyParser = require("body-parser");
const mongodb = require("mongodb");

let db;
let app = express();
app.use(bodyParser.json());
const { ObjectID } = mongodb.ObjectID;

// Connect to the database before starting the application server.
mongodb.MongoClient.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/weatherstation", function (err, client) {
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
    console.log("App now running on port", port);
  });
});

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

// Start collecting the data sent from the Photon and store it in a mongoDB
app.post("/v1/collect", function(req, res) {
  let data = JSON.parse(req.body.data);
  data.createdAt = new Date();

  db.collection('weather').insertOne(data, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to create new weather data point.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
});

// TODO, very temp, just to see the data in the DB
app.get("/v1/all_data", function(req, res) {
  db.collection('weather').find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get weather data. :/");
    } else {
      res.status(200).json(docs);
    }
  });
});
