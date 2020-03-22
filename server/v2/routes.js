const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema');
const rootValue = require('./queries');

const router = express.Router();

router.use('/graphql', graphqlHTTP({
  graphiql: process.env.NODE_ENV !== 'production',
  rootValue,
  schema
}));

module.exports = router;
