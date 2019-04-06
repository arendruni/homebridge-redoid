var Redoid = require('redoid');
var Color = require('color');

var Service, Characteristic;
const TRANSITION_DURATION = 200;

module.exports = function (homebridge) {
	Service = homebridge.hap.Service;
	Characteristic = homebridge.hap.Characteristic;

	homebridge.registerAccessory("homebridge-redoid", "RedoidLed", redoidLed);
};

function redoidLed(log, config) {
	this.log = log;

	this.hue = 0;
	this.saturation = 0;
	this.brightness = 0;
	this.status = false;

	this.redoid = Redoid();
}

redoidLed.prototype.getServices = function () {
	var informationService = new Service.AccessoryInformation();
	informationService
		.setCharacteristic(Characteristic.Manufacturer, "My LED strip manufacturer")
		.setCharacteristic(Characteristic.Model, "My LED strip model")
		.setCharacteristic(Characteristic.SerialNumber, "123-456-789");

	var lightbulbService = new Service.Lightbulb("RedoidLed");
	lightbulbService
		.getCharacteristic(Characteristic.On)
		.on('get', this.getStatus.bind(this))
		.on('set', this.setStatus.bind(this));

	lightbulbService.getCharacteristic(Characteristic.Brightness)
		.on('get', this.getBrightness.bind(this))
		.on('set', this.setBrightness.bind(this));

	lightbulbService.getCharacteristic(Characteristic.Hue)
		.on('get', this.getHue.bind(this))
		.on('set', this.setHue.bind(this));

	lightbulbService.getCharacteristic(Characteristic.Saturation)
		.on('get', this.getSaturation.bind(this))
		.on('set', this.setSaturation.bind(this));

	this.informationService = informationService;
	this.lightbulbService = lightbulbService;
	return [informationService, lightbulbService];
}

// GETTERS
redoidLed.prototype.getStatus = function (callback) {
	callback(null, this.status);
}

redoidLed.prototype.getBrightness = function (callback) {
	callback(null, this.brightness);
}

redoidLed.prototype.getHue = function (callback) {
	callback(null, this.hue);
}

redoidLed.prototype.getSaturation = function (callback) {
	callback(null, this.saturation);
}

// SETTERS
redoidLed.prototype.setBrightness = function (newVal, callback) {
	this.brightness = newVal / 2;
	this._changeColor();

	callback();
}

redoidLed.prototype.setHue = function (newVal, callback) {
	this.hue = newVal;
	this._changeColor();

	callback();
}

redoidLed.prototype.setSaturation = function (newVal, callback) {
	this.saturation = newVal;
	this._changeColor();

	callback();
}

redoidLed.prototype.setStatus = function (on, callback) {
	this.status = on;

	if (this.status) {
		this._changeColor();
	} else {
		this.redoid.turnOff(TRANSITION_DURATION);
	}

	callback();
};

// HELPERS
redoidLed.prototype._changeColor = function () {
	var hexColor = Color({
		h: this.hue,
		s: this.saturation,
		l: this.brightness
	}).hex();

	this.log("new color: " + hexColor);

	this.redoid.transition(hexColor, TRANSITION_DURATION);
}