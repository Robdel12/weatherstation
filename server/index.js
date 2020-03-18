const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const {
  NODE_ENV: ENV = 'development',
  MONGODB_URI = 'mongodb://localhost:27017/weatherstation',
  PORT = 8080
} = process.env;

const app = express();

if (ENV === 'production') {
  // Force HTTPS
  app.use((req, res, next) => {
    // The 'x-forwarded-proto' check is for Heroku.
    if (!req.secure && req.get('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.get('host')}${req.url}`);
    } else {
      next();
    }
  });
}

app.use(bodyParser.json());
app.use('/v1', require('./v1/routes'));
app.use(express.static(path.resolve('../app/dist')));

app.get(/\/[^.]*$/, (req, res) => {
  res.sendFile(path.resolve('../app/dist/index.html'));
});

// Connect to the database before starting the application server.
MongoClient.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, (err, client) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  app.locals.db = client.db();
  console.log('Database connection ready');

  // Initialize the app.
  let server = app.listen(PORT, () => {
    console.log(`App now running on http://localhost:${server.address().port}`);
  });
});
