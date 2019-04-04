var Redoid = require('redoid');
var color = require('color');

var Service, Characteristic;

module.exports = function (homebridge) {
	Service = homebridge.hap.Service;
	Characteristic = homebridge.hap.Characteristic;

	homebridge.registerAccessory("homebridge-redoid", "MySwitch", mySwitch);
};

function mySwitch(log, config) {
	this.log = log;
	this.saturation = 0, this.hue = 0, this.brightness = 0;

	this.redoid = Redoid({
		color: "#000000"
	});
}

mySwitch.prototype.getServices = function () {
	var informationService = new Service.AccessoryInformation();
	informationService
		.setCharacteristic(Characteristic.Manufacturer, "My switch manufacturer")
		.setCharacteristic(Characteristic.Model, "My switch model")
		.setCharacteristic(Characteristic.SerialNumber, "123-456-789");

	var switchService = new Service.Lightbulb("My switch");
	switchService
		.getCharacteristic(Characteristic.On)
		.on('get', (next) => { return next(); })
		.on('set', this.setSwitchOnCharacteristic.bind(this));

	switchService.getCharacteristic(Characteristic.Brightness)
		.on('get', (next) => { return next(); })
		.on('set', this.brightnessSet.bind(this));

	switchService.getCharacteristic(Characteristic.Hue)
		.on('get', (next) => { return next(); })
		.on('set', this.hueSet.bind(this));

	switchService.getCharacteristic(Characteristic.Saturation)
		.on('get', (next) => { return next(); })
		.on('set', this.saturationSet.bind(this));

	this.informationService = informationService;
	this.switchService = switchService;
	return [informationService, switchService];
}


mySwitch.prototype.hueSet = function (on, next) {
	this.hue = on;
	this.redoid.transition(color({ h: this.hue, s: this.saturation, l: this.brightness }).hex(), 200);
	this.log("hue: " + on);
	return next();
}

mySwitch.prototype.saturationSet = function (on, next) {
	this.saturation = on;

	this.redoid.transition(color({ h: this.hue, s: this.saturation, l: this.brightness }).hex(), 200);
	this.log("saturation: " + on);
	return next();
}

mySwitch.prototype.brightnessSet = function (on, next) {
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