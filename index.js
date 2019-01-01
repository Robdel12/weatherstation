let express = require("express");
let bodyParser = require("body-parser");
let mongodb = require("mongodb");

let db;
let app = express();
let { ObjectID } = mongodb.ObjectID;
app.use(bodyParser.json());
// super temp
app.set('view engine', 'ejs');

const WEATHER_COLLECTION = 'weather';
const WEBHOOK_COLLECTION = 'webhookData';

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

app.get("/", function(req, res) {
  res.send("I'm 💯");
});

app.get("/v1/", function(req, res) {
  res.status(200).json({ hi: "there" });
});

// Start collecting the data sent from the Photon and store it in a mongoDB
app.post("/v1/collect", function(req, res) {
  let data = JSON.parse(req.body.data);

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
  db.collection('weather').find({}).sort({ createdAt: -1 }).limit(50).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get weather data. :/");
    } else {
      res.status(200).json(docs);
    }
  });
});

app.get("/temp", function(req, res) {
  res.render('weather.ejs');
});
