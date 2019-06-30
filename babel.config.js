module.exports = function(api) {
  api.cache(true);
  let presets = ["@babel/env", "@babel/preset-react"];
  let plugins = [
    "@babel/plugin-transform-regenerator",
    "@babel/plugin-proposal-class-properties"
  ];

  return {
    presets,
    plugins
  };
};
