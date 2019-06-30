const path = require("path");

module.exports = function(config) {
  config.set({
    frameworks: ["mocha"],
    reporters: ["mocha"],

    browsers: ["Firefox"],

    files: [{ pattern: "test/index.js", watched: false }],

    preprocessors: {
      "test/index.js": ["webpack"]
    },

    webpack: require("./webpack.config"),

    webpackMiddleware: {
      stats: "errors-only"
    },

    plugins: ["karma-firefox-launcher", "karma-mocha", "karma-mocha-reporter", "karma-webpack"]
  });
};
