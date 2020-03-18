require("@babel/polyfill");

mocha.timeout(3000);

const requireComponentTests = require.context("../src", true, /\.test$/);
const requireAcceptanceTests = require.context(".", true, /\.test$/);

requireComponentTests.keys().forEach(requireComponentTests);
requireAcceptanceTests.keys().forEach(requireAcceptanceTests);
