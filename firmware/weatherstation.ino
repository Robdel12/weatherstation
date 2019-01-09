/******************************************************************************
  SparkFun Photon Weather Shield basic example with weather meter readings including wind speed, wind direction and rain.
  Joel Bartlett @ SparkFun Electronics
  Original Creation Date: May 18, 2015

  Based on the Wimp Weather Station sketch by: Nathan Seidle
  https://github.com/sparkfun/Wimp_Weather_Station

  This sketch prints the temperature, humidity, barometric pressure to the Seril port.
  This sketch also incorporates the Weather Meters avaialbe from SparkFun (SEN-08942),
  which allow you to measure Wind Speed, Wind Direction, and Rainfall.

  Hardware Connections:
  This sketch was written specifically for the Photon Weather Shield,
  which connects the HTU21D and MPL3115A2 to the I2C bus by default.
  If you have an HTU21D and/or an MPL3115A2 breakout, use the following
  hardware setup:
      HTU21D ------------- Photon
      (-) ------------------- GND
      (+) ------------------- 3.3V (VCC)
       CL ------------------- D1/SCL
       DA ------------------- D0/SDA

    MPL3115A2 ------------- Photon
      GND ------------------- GND
      VCC ------------------- 3.3V (VCC)
      SCL ------------------ D1/SCL
      SDA ------------------ D0/SDA

    DS18B20 Temp Sensor ------ Photon
        VCC (Red) ------------- 3.3V (VCC)
        GND (Black) ----------- GND
        SIG (White) ----------- D4


  Development environment specifics:
    IDE: Particle Dev
    Hardware Platform: Particle Photon
                       Particle Core

  This code is beerware; if you see me (or any other SparkFun
  employee) at the local, and you've found our code helpful,
  please buy us a round!
  Distributed as-is; no warranty is given.
*******************************************************************************/
#include "SparkFun_Photon_Weather_Shield_Library.h"

int WDIR = A0;
int RAIN = D2;
int WSPEED = D3;

//Global Variables
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
long lastSecond; //The millis counter to see when a second rolls by
byte seconds; //When it hits 60, increase the current minute
byte minutes; //Keeps track of where we are in various arrays of data

//We need to keep track of the following variables:
//Wind speed/dir each update (no storage)
//Rain over the past hour (store 1 per minute)
//Total rain over date (store one per day)

volatile float rainHour[60]; //60 floating numbers to keep track of 60 minutes of rain

//These are all the weather values that our API expects
int winddir = 0; // [0-360 instantaneous wind direction]
float windspeedmph = 0; // [mph instantaneous wind speed]
float rainin = 0; // [rain inches over the past hour)] -- the accumulated rainfall in the past 60 min
volatile float dailyrainin = 0; // [rain inches so far today in local time]
float humidity = 0;
float tempf = 0;
float pascals = 0;
float altf = 0;
float baroTemp = 0;


// volatiles are subject to modification by IRQs
int count = 0;
int altCount = 0;
long lastWindCheck = 0;
volatile long lastWindIRQ = 0;
volatile byte windClicks = 0;
volatile unsigned long raintime, rainlast, raininterval, rain;

//Create Instance of HTU21D or SI7021 temp and humidity sensor and MPL3115A2 barrometric sensor
Weather sensor;

//Interrupt routines (these are called by the hardware interrupts, not by the main code)
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Count rain gauge bucket tips as they occur
// Activated by the magnet and reed switch in the rain gauge, attached to input D2
void rainIRQ() {
  raintime = millis(); // grab current time
  raininterval = raintime - rainlast; // calculate interval between this and last event

  // ignore switch-bounce glitches less than 10mS after initial edge
  if (raininterval > 10) {
    dailyrainin += 0.011; //Each dump is 0.011" of water
    rainHour[minutes] += 0.011; //Increase this minute's amount of rain
    rainlast = raintime; // set up for next event
  }
}

// Activated by the magnet in the anemometer (2 ticks per rotation), attached to input D3
void wspeedIRQ() {
  // Ignore switch-bounce glitches less than 10ms (142MPH max reading) after the reed switch closes
  if (millis() - lastWindIRQ > 10)  {
    lastWindIRQ = millis(); //Grab the current time
    windClicks++; //There is 1.492MPH for each click per second.
  }
}

//---------------------------------------------------------------
void setup() {
    pinMode(WSPEED, INPUT_PULLUP); // input from wind meters windspeed sensor
    pinMode(RAIN, INPUT_PULLUP); // input from wind meters rain gauge sensor

    Serial.begin(9600); // open serial over USB

    // This line pauses the Serial port until a key is pressed
    // Serial.println("Press any key to begin");
    // while(!Serial.available()) Spark.process();

    //Initialize the I2C sensors and ping them
    sensor.begin();

    /* You can only receive acurate barrometric readings or acurate altitiude
    readings at a given time, not both at the same time. The following two lines
    tell the sensor what mode to use. You could easily write a function that
    takes a reading in one made and then switches to the other mode to grab that
    reading, resulting in data that contains both acurate altitude and barrometric
    readings. For this example, we will only be using the barometer mode. Be sure
    to only uncomment one line at a time. */

    sensor.setModeBarometer();

    //These are additional MPL3115A2 functions the MUST be called for the sensor to work.
    sensor.setOversampleRate(7); // Set Oversample rate
    //Call with a rate from 0 to 7. See page 33 for table of ratios.
    //Sets the over sample rate. Datasheet calls for 128 but you can set it
    //from 1 to 128 samples. The higher the oversample rate the greater
    //the time between data samples.

    sensor.enableEventFlags(); //Necessary register calls to enble temp, baro ansd alt

    seconds = 0;
    lastSecond = millis();

    // attach external interrupt pins to IRQ functions
    attachInterrupt(RAIN, rainIRQ, FALLING);
    attachInterrupt(WSPEED, wspeedIRQ, FALLING);

    // turn on interrupts
    interrupts();
}

//---------------------------------------------------------------
void loop() {
  //Keep track of which minute it is
  if(millis() - lastSecond >= 1000) {
    lastSecond += 1000;

    if(++seconds > 59) {
      seconds = 0;

      if(++minutes > 59) minutes = 0;

      rainHour[minutes] = 0; //Zero out this minute's rainfall amount
    }

    //Get readings from all sensors
    getWeather();

    //Rather than use a delay, keeping track of a counter allows the photon to
    //still take readings and do work in between printing out data.
    count++;

    // Every two seconds
    if(count == 2) {
       printInfo();
       // These key names are shrunk to fit within 63 bytes that `Particle.publish` limits to.
       // The keys are transformed into human readable names where the POST is handled in the API.
       Particle.publish("weather",
         "{ \"temp\": \""
         + String(tempf)
         + "\", \"cWindS\": \""
         + String(windspeedmph)
         + "\", \"cWindD\": \""
         + String(winddir)
         + "\", \"windG\": \""
         + "\", \"dRain\": \""
         + String(dailyrainin)
         + "\", \"hRain\": \""
         + String(rainin)
         + "\", \"humidity\": \""
         + String(humidity)
         + "\", \"pressure\": \""
         + String(pascals/100)
         + "\", \"altitude\": \""
         + String(altf)
         + "\", \"baroT\": \""
         + String(baroTemp)
         + "\" }"
       );
       count = 0;
    }
  }
}

//---------------------------------------------------------------
void printInfo() {
  //This function prints the weather data out to the default Serial Port
  Serial.print(" Wind_Speed:");
  Serial.print(windspeedmph, 1);
  Serial.print("mph, ");

  Serial.print("Rain:");
  Serial.print(rainin, 2);
  Serial.print("in., ");

  Serial.print("Temp:");
  Serial.print(tempf);
  Serial.print("F, ");

  Serial.print("Humidity:");
  Serial.print(humidity);
  Serial.print("%, ");

  Serial.print("Baro_Temp:");
  Serial.print(baroTemp);
  Serial.print("F, ");

  //The MPL3115A2 outputs the pressure in Pascals. However, most weather stations
  //report pressure in hectopascals or millibars. Divide by 100 to get a reading
  //more closely resembling what online weather reports may say in pascals or mb.
  //Another common unit for pressure is Inches of Mercury (in.Hg). To convert
  //from mb to in.Hg, use the following formula. P(inHg) = 0.0295300 * P(mb)
  //More info on conversion can be found here:
  //www.srh.noaa.gov/images/epz/wxcalc/pressureConversion.pdf
  Serial.print("Pressure:");
  Serial.print(pascals/100);
  Serial.print("hPa, ");

  Serial.print("Altitude:");
  Serial.print(altf);
  Serial.println("ft.");
}

//---------------------------------------------------------------
//Read the wind direction sensor, return heading in degrees
int get_wind_direction() {
  unsigned int adc;

  adc = analogRead(WDIR); // get the current reading from the sensor

  // The following table is ADC readings for the wind direction sensor output, sorted from low to high.
  // Each threshold is the midpoint between adjacent headings. The output is degrees for that ADC reading.
  // Note that these are not in compass degree order! See Weather Meters datasheet for more information.

  //Wind Vains may vary in the values they return. To get exact wind direction,
  //it is recomended that you AnalogRead the Wind Vain to make sure the values
  //your wind vain output fall within the values listed below.
  if(adc > 2270 && adc < 2290) return (0);//North
  if(adc > 3220 && adc < 3299) return (1);//NE
  if(adc > 3890 && adc < 3999) return (2);//East
  if(adc > 3780 && adc < 3850) return (3);//SE

  if(adc > 3570 && adc < 3650) return (4);//South
  if(adc > 2790 && adc < 2850) return (5);//SW
  if(adc > 1580 && adc < 1610) return (6);//West
  if(adc > 1930 && adc < 1950) return (7);//NW

  return (-1); // error, disconnected?
}

//---------------------------------------------------------------
//Returns the instataneous wind speed
float get_wind_speed() {
  float deltaTime = millis() - lastWindCheck; //750ms

  deltaTime /= 1000.0; //Covert to seconds

  // Serial.println();
  // Serial.print("deltaTime");
  // Serial.println(deltaTime);

  float windSpeed = (float)windClicks / deltaTime; //3 / 0.750s = 4

  // Serial.println();
  // Serial.print("windSpeed:");
  // Serial.println(windSpeed);

  // Serial.println();
  // Serial.print("windClicks before reset:");
  // Serial.println(windClicks);

  windClicks = 0; //Reset and start watching for new wind
  lastWindCheck = millis();

  windSpeed *= 1.492; //4 * 1.492 = 5.968MPH

  // Serial.println();
  // Serial.print("Windspeed:");
  // Serial.println(windSpeed);

  return(windSpeed);
}

//---------------------------------------------------------------
void getWeather() {
  // Measure Relative Humidity from the HTU21D or Si7021
  humidity = sensor.getRH();

  // Measure Temperature from the HTU21D or Si7021
  // Temperature is measured every time RH is requested.
  // It is faster, therefore, to read it from previous RH
  // measurement with getTemp() instead with readTemp()
  tempf = sensor.getTempF();

  // Measure the Barometer temperature in F from the MPL3115A2
  baroTemp = sensor.readBaroTempF();

  // Measure Pressure from the MPL3115A2 in
  pascals = sensor.readPressure();

  // TODO, this needs to be toggled on, read, and stored properly
  // Measure the Altimeter in feet from the MPL3115A2
  // altf = sensor.readAltitudeFt();

  //Calc winddir
  winddir = get_wind_direction();

  //Calc windspeed
  windspeedmph = get_wind_speed();

  //Total rainfall for the day is calculated within the interrupt
  //Calculate amount of rainfall for the last 60 minutes
  rainin = 0;
  for(int i = 0 ; i < 60 ; i++)
    rainin += rainHour[i];
}
