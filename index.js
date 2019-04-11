var Redoid = require('redoid');
var Color = require('color');

var Service, Characteristic;

module.exports = function (homebridge) {
	Service = homebridge.hap.Service;
	Characteristic = homebridge.hap.Characteristic;

	homebridge.registerAccessory("homebridge-redoid", "RedoidLed", redoidLed);
};

function redoidLed(log, config) {
	this.log = log;

	this.manufacturer = config["manufacturer"] || "My manufacturer";
	this.model = config["model"] || "My model";
	this.serial = config["serial-number"] || "123-456-789";
	this.name = config["name"] || "RedoidLed";
	this.transitionDuration = config["transition_duration"] || 200;

	this.hue = 0;
	this.saturation = 0;
	this.brightness = 0;
	this.status = false;

	this.redoid = Redoid();
}

redoidLed.prototype.getServices = function () {
	var informationService = new Service.AccessoryInformation();
	informationService
		.setCharacteristic(Characteristic.Manufacturer, this.manufacturer)
		.setCharacteristic(Characteristic.Model, this.model)
		.setCharacteristic(Characteristic.SerialNumber, this.serial);

	var lightbulbService = new Service.Lightbulb(this.name);
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
redoidLed.prototype.getStatus = function (next) {
	return next(null, this.status);
}

redoidLed.prototype.getBrightness = function (next) {
	return next(null, this.brightness);
}

redoidLed.prototype.getHue = function (next) {
	return next(null, this.hue);
}

redoidLed.prototype.getSaturation = function (next) {
	return next(null, this.saturation);
}

// SETTERS
redoidLed.prototype.setBrightness = function (newVal, next) {
	this.brightness = newVal;
	this._changeColor();

	return next();
}

redoidLed.prototype.setHue = function (newVal, next) {
	this.hue = newVal;
	this._changeColor();

	return next();
}

redoidLed.prototype.setSaturation = function (newVal, next) {
	this.saturation = newVal;
	this._changeColor();

	return next();
}

redoidLed.prototype.setStatus = function (on, next) {
	this.status = on;

	if (this.status) {
		this._changeColor();
	} else {
		this.redoid.turnOff(this.transitionDuration);
	}

	return next();
};

// HELPERS
redoidLed.prototype._changeColor = function () {
	var hexColor = Color({
		h: this.hue,
		s: this.saturation,
		l: this.brightness / 2
	}).hex();

	this.log("new color: " + hexColor);

	this.redoid.transition(hexColor, this.transitionDuration);
}