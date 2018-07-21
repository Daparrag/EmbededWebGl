var SerialPort = require('serialport');
var port = new SerialPort('/dev/ttyACM0', {
  baudRate: 57600
});