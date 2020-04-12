/****************************************************************************
 * Modified to exclude uneeded interupt code
 * https://github.com/sparkfun/SparkFun_APDS9301_Library
 *****************************************************************************/
#define CONTROL_REG        0x80
#define TIMING_REG         0x81
#define ID_REG             0x8A
#define DATA0LOW_REG       0x8C
#define DATA0HI_REG        0x8D
#define DATA1LOW_REG       0x8E
#define DATA1HI_REG        0x8F

class APDS9301 {
  public:
  // Typedefs for this class
  typedef enum {LOW_GAIN, HIGH_GAIN} gain;
  typedef enum {INT_TIME_13_7_MS, INT_TIME_101_MS, INT_TIME_402_MS} intTime;
  typedef enum {SUCCESS, I2C_FAILURE} status;
  typedef enum {POW_OFF, POW_ON} powEnable;

  // Class constructor. Does nothing- all setup is deferred to .begin()
  APDS9301();

  // SET functions. All these functions return a status type which
  //  tells you whether or not they succeeded and why.

  // begin() enables the power, sets the gain and integration time to
  //  minimum levels, disables interrupt
  status begin(uint8_t address);

  // powerEnable() enables/disables the power of the sensor. Normally
  //  this will be handled by the .begin() function, but it's possible
  //  a user may want to power the sensor off or on to save power
  //  outside of the normal begin()/end() methods.
  status powerEnable(powEnable powEn);

  // set gain and integration time functions. By default the gain is
  //  set to low and integration time to its lowest setting; this is
  //  most suitable to high brightness environments. For lower
  //  brightness areas these probably ought to be turned up.
  status setGain(gain gainLevel);
  status setIntegrationTime(intTime integrationTime);

  // GET functions. Where applicable these return their typedef.

  // getIDReg() returns the ID register value. Register will read
  //  b0101xxxx where the lower four bits change with the silicon
  //  revision of the chip.
  uint8_t getIDReg();

  // see above for more info about what these get functions do.
  gain getGain();
  intTime getIntegrationTime();

  // Sensor read functions. These are the actual values the sensor
  //  read at last conversion. Most often, this is going to be
  //  ignored in favor of the calculated Lux level.
  unsigned int readCH0Level();
  unsigned int readCH1Level();

  // Calculated Lux level. Accurate to within +/- 40%.
  float readLuxLevel();

  private:
  uint8_t address;

  uint8_t getRegister(uint8_t regAddress);
  status setRegister(uint8_t regAddress, uint8_t newVal);
  uint16_t getTwoRegisters(uint8_t regAddress);
  status setTwoRegisters(uint8_t regAddress, uint16_t newVal);
};
