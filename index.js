var Redoid = require('redoid');
var Color = require('color');

var Service, Characteristic;
const TRANSITION_DURATION = 200;

module.exports = function (homebridge) {
	Service = homebridge.hap.Service;
	Characteristic = homebridge.hap.Characteristic;

	homebridge.registerAccessory("homebridge-redoid", "RediodLed", rediodLed);
};

function rediodLed(log, config) {
	this.log = log;
	this.redoid = Redoid();
}

rediodLed.prototype.getServices = function () {
	var informationService = new Service.AccessoryInformation();
	informationService
		.setCharacteristic(Characteristic.Manufacturer, "My LED strip manufacturer")
		.setCharacteristic(Characteristic.Model, "My LED strip model")
		.setCharacteristic(Characteristic.SerialNumber, "123-456-789");

	var lightbulbService = new Service.Lightbulb("Redoid");
	lightbulbService
		.getCharacteristic(Characteristic.On)
		.on('get', this.getCharacteristic.bind(this))
		.on('set', this.setLedOn.bind(this));

	lightbulbService.getCharacteristic(Characteristic.Brightness)
		.on('get', this.getCharacteristic.bind(this))
		.on('set', this.setBrightness.bind(this));

	lightbulbService.getCharacteristic(Characteristic.Hue)
		.on('get', this.getCharacteristic.bind(this))
		.on('set', this.setHue.bind(this));

	lightbulbService.getCharacteristic(Characteristic.Saturation)
		.on('get', this.getCharacteristic.bind(this))
		.on('set', this.setSaturation.bind(this));

	this.informationService = informationService;
	this.lightbulbService = lightbulbService;
	return [informationService, lightbulbService];
}

// GETTERS
radioled.prototype.getCharacteristic = (next) => {
	return next();
}

// SETTERS
rediodLed.prototype.setBrightness = function (newVal, next) {
	this.brightness = newVal / 2;
	this._changeColor();

	return next();
}

rediodLed.prototype.setHue = function (newVal, next) {
	this.hue = newVal;
	this._changeColor();

	return next();
}

rediodLed.prototype.setSaturation = function (newVal, next) {
	this.saturation = newVal;
	this._changeColor();

	return next();
}

rediodLed.prototype.setLedOn = function (on, next) {
	if (on) {
		this._changeColor();
	} else {
		this.redoid.turnOff(TRANSITION_DURATION);
	}

	return next();
};

// HELPERS
rediodLed.prototype._changeColor = function () {
	var hexColor = color({
		h: this.hue,
		s: this.saturation,
		l: this.lightness
	}).hex();

	this.log("new color: " + hexColor);

	this.redoid.transition(hexColor, TRANSITION_DURATION);
}