// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  clearMocks: true,
  setupFiles: ["<rootDir>/jest.setup.js"],
  transformIgnorePatterns: ["<rootDir>/node_modules/(?!testing-hooks)"],
  coverageDirectory: "coverage",
  testEnvironment: "jsdom"
};
