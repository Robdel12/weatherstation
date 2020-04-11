#include <SparkFun_Photon_Weather_Shield_Library.h>
//#include "Sparkfun_APDS9301_Library.h"

// interrupt pins
const int WDIR_PIN = A0;
const int WSPEED_PIN = D3;
const int RAIN_PIN = D2;
// i2c address
//const uint8_t LUX_ADDR = 0x39;

// local data
float humidity = 0;
float temp = 0;
float pascals = 0;
float windD = 0;
float windS = 0;
float rain = 0;
//float lux = 0;

// tracks update interval
long lastUpdate = 0;

// weather sheild sensor
Weather weather;
// ambient light sensor
//APDS9301 light;

// updates local weather data
void updateWeatherData() {
  // relative humidity
  humidity = weather.getRH();
  // tempurature (getRH makes this faster than readTemp)
  temp = weather.getTempF();
  // barometer
  pascals = weather.readPressure();
  // average temp between both sensors
  temp = (temp + weather.readBaroTempF()) / 2;
  // wind
  windS = getWindSpeed();
  windD = getWindDirection();
  // rain
  rain = getRainInches();
  // light
  //lux = light.readLuxLevel();
}

// rain functions
volatile long lastRainIRQ = 0;
volatile byte rainClicks = 0;

void rainIRQ() {
  // ignore switch-bounce glitches
  if (millis() - lastRainIRQ > 10) {
    lastRainIRQ = millis();
    rainClicks++;
  }
}

float getRainInches() {
  // calculate inches of rain from clicks
  float rainIn = rainClicks * 0.011;
  // reset rain clicks
  rainClicks = 0;
  return rainIn;
}

// wind functions
volatile long lastWindIRQ = 0;
volatile byte windClicks = 0;

void windIRQ() {
  // ignore switch-bounce glitches
  if (millis() - lastWindIRQ > 10) {
    lastWindIRQ = millis();
    windClicks++;
  }
}

long lastWindCheck = 0;

float getWindSpeed() {
  // calculate clicks per second
  float deltaTime = (millis() - lastWindCheck) / 1000.0;
  float windSpeed = (float) windClicks / deltaTime;
  // reset wind clicks
  lastWindCheck = millis();
  windClicks = 0;
  // multiply clicks per second by mph per click
  windSpeed *= 1.492;
  return windSpeed;
}

float getWindDirection() {
  // get the current reading from the sensor
  int adc = analogRead(WDIR);

  // adc -> dir

  // manual testing results:
  // ~1485 -> 112.5
  // ~1556 -> 67.5
  // ~1592 -> 90
  // ~1716 -> 157.5
  // ~1928 -> 135
  // ~2135 -> 202.5
  // ~2276 -> 180
  // ~2646 -> 22.5
  // ~2808 -> 45
  // ~3170 -> 247.5
  // ~3248 -> 225
  // ~3421 -> 337.5
  // ~3610 -> 0
  // ~3702 -> 292.5
  // ~3828 -> 315
  // ~3944 -> 270

  // rounded values account for fluctuation
  if (adc < 1500) return 112.5;
  if (adc < 1570) return 67.5;
  if (adc < 1600) return 90;
  if (adc < 1800) return 157.5;
  if (adc < 2000) return 135;
  if (adc < 2200) return 202.5;
  if (adc < 2400) return 180;
  if (adc < 2700) return 22.5;
  if (adc < 3000) return 45;
  if (adc < 3200) return 247.5;
  if (adc < 3300) return 225;
  if (adc < 3500) return 337.5;
  if (adc < 3650) return 0;
  if (adc < 3750) return 292.5;
  if (adc < 3850) return 315;
  if (adc < 4000) return 270;

  return -1; // error, disconnected?
}

//----------------------------------------------

void setup() {
  // open serial over USB at 9600 baud
  Serial.begin(9600);
  // initialize the weather sensors
  weather.begin();
  weather.setModeBarometer();
  weather.setOversampleRate(7);
  weather.enableEventFlags();
  // set windspeed and rain pin modes
  pinMode(WSPEED_PIN, INPUT_PULLUP);
  pinMode(RAIN_PIN, INPUT_PULLUP);
  // attach external interrupt pins to IRQ functions
  attachInterrupt(WSPEED_PIN, windIRQ, FALLING);
  attachInterrupt(RAIN_PIN, rainIRQ, FALLING);
  // turn on interrupts
  interrupts();
  // initialize i2c bus for light sensor
  //Wire.begin();
  // light sensor setup
  //light.begin(LUX_ADDR);
}

void loop() {
  // every 2 seconds
  if (millis() - lastUpdate >= 2000) {
    lastUpdate = millis();
    // update local data from all sensors
    updateWeatherData();
    // and publish local data
    publishWeatherData();
  }
}

//----------------------------------------------

// publish to server
TCPClient client;
const char* domain = "weather.deluca.house";
const char* path = "/v2/collect";
const int port = 443;

void publishWeatherData() {
  String data = getWeatherData();

  if (client.connect(domain, port)) {
    client.printlnf("POST %s HTTP/1.1", path);
    client.printlnf("Host: %s", address);
    client.printlnf("Content-Length: %d", data.length());
    client.println("Content-Type: application/json");
    client.println();
    client.println(data);
    client.flush();
  } else {
    Serial.printlnf("CONNECTION FAILED: %s:%d", address, port);
  }

  // always publish to serial
  Serial.println(data);
}

// returns weather data as a JSON string
String getWeatherData() {
  return (
    "{ \"temperature\": " +
    String(temp, 3) +
    ", \"humidity\": " +
    String(humidity, 3) +
    ", \"pressure\": " +
    String(pascals / 100, 3) +
    ", \"windDirection\": " +
    String(windD, 1) +
    ", \"windSpeed\": " +
    String(windS, 3) +
    ", \"rain\": " +
    String(rain, 3) +
    //", \"lux\": " +
    //String(lux, 3) +
    " }"
  );
}
