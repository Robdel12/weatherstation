module.exports = function(config) {
  config.set({
    frameworks: ['mocha'],
    reporters: ['mocha', 'coverage', config.junit && 'junit'].filter(Boolean),
    browsers: ['Firefox'],

    files: [{ pattern: 'test/index.js', watched: false }],
    coverageReporter: {
      type: config.coverage === true ? 'text-summary' : config.coverage || 'none',
      check: config.converage
        ? {
            global: {
              statements: 100,
              lines: 100,
              functions: 100,
              branches: 100
            }
          }
        : undefined,
      watermarks: {
        statements: [100, 100],
        functions: [100, 100],
        branches: [100, 100],
        lines: [100, 100]
      }
    },

    junitReporter: {
      outputDir: './junit',
      outputFile: 'test-results.xml',
      useBrowserName: false
    },

    preprocessors: {
      'test/index.js': ['webpack']
    },

    webpack: require('./webpack.config'),
    webpackMiddleware: {
      stats: 'errors-only'
    },

    plugins: [
      'karma-firefox-launcher',
      'karma-mocha',
      'karma-junit-reporter',
      'karma-mocha-reporter',
      'karma-webpack',
      'karma-coverage'
    ]
  });
};
