// Migrates V1 data to V2 on-the-fly. Remove once V1 data has been migrated.
const PROJECT_V1_TO_V2 = {
  // average temp and barometerTemp
  temperature: { $avg: ['$temp', '$barometerTemp'] },
  // currentWindSpeed
  windSpeed: '$currentWindSpeed',
  // map currentWindDirection to degrees
  windDirection: {
    $switch: {
      default: null,
      branches: [
        ['South', 0],
        ['South West', 45],
        ['West', 90],
        ['North West', 135],
        ['North', 180],
        ['North East', 225],
        ['East', 270],
        ['South East', 315]
      ].map(([dir, deg]) => ({
        case: { $eq: ['$currentWindDirection', dir] },
        then: deg
      }))
    }
  },
  // preserve
  pressure: 1,
  humidity: 1,
  rain: 1,
  createdAt: 1
};

module.exports = {
  PROJECT_V1_TO_V2
};
