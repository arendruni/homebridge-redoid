var Redoid = require('redoid');
var color = require('color');

var Service, Characteristic;

module.exports = function (homebridge) {
	Service = homebridge.hap.Service;
	Characteristic = homebridge.hap.Characteristic;

	homebridge.registerAccessory("homebridge-redoid", "RediodLed", rediodLed);
};

function rediodLed(log, config) {
	this.log = log;
	this.saturation = 0, this.hue = 0, this.brightness = 0;
	
	this.redoid = Redoid({
		color: "#000000"
	});
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
		.on('get', (next) => { return next(); })
		.on('set', this.setSwitchOnCharacteristic.bind(this));

	lightbulbService.getCharacteristic(Characteristic.Brightness)
		.on('get', (next) => { return next(); })
		.on('set', this.brightnessSet.bind(this));

	lightbulbService.getCharacteristic(Characteristic.Hue)
		.on('get', (next) => { return next(); })
		.on('set', this.hueSet.bind(this));

	lightbulbService.getCharacteristic(Characteristic.Saturation)
		.on('get', (next) => { return next(); })
		.on('set', this.saturationSet.bind(this));

	this.informationService = informationService;
	this.lightbulbService = lightbulbService;
	return [informationService, lightbulbService];
}


rediodLed.prototype.hueSet = function (on, next) {
	this.hue = on;
	this.redoid.transition(color({ h: this.hue, s: this.saturation, l: this.brightness }).hex(), 200);
	this.log("hue: " + on);
	return next();
}

rediodLed.prototype.saturationSet = function (on, next) {
	this.saturation = on;

	this.redoid.transition(color({ h: this.hue, s: this.saturation, l: this.brightness }).hex(), 200);
	this.log("saturation: " + on);
	return next();
}

rediodLed.prototype.brightnessSet = function (on, next) {
	this.brightness = on / 2;
	this.redoid.transition(color({ h: this.hue, s: this.saturation, l: this.brightness }).hex(), 200);
	this.log("brightness: " + this.brightness);
	return next();
}


mySwitch.prototype.setSwitchOnCharacteristic = function (on, next) {
	this.log("status: " + on);

	if (on) {
		this.redoid.transition(color({ h: this.hue, s: this.saturation, l: this.brightness }).hex(), 200);
	} else {
		this.redoid.turnOff(200);
	}
	return next();
};