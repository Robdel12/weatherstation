const express = require("express");
const bodyParser = require("body-parser");
const mongodb = require("mongodb");

let db;
let app = express();
app.use(bodyParser.json());
const { ObjectID } = mongodb.ObjectID;

// Connect to the database before starting the application server.
mongodb.MongoClient.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/test", function (err, client) {
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

app.post("/v1/collect", function(req, res) {
  console.log("res = ", res);
  console.log("req = ", req);
  // let newContact = req.body;
  // newContact.createDate = new Date();

  // db.collection(CONTACTS_COLLECTION).insertOne(newContact, function(err, doc) {
  //   if (err) {
  //     handleError(res, err.message, "Failed to create new contact.");
  //   } else {
  //     res.status(201).json(doc.ops[0]);
  //   }
  // });
});
