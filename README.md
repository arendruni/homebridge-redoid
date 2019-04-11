[![npm version](https://badge.fury.io/js/homebridge-redoid.svg)](https://badge.fury.io/js/homebridge-redoid)

# Homebridge Redoid

[Redoid](https://github.com/ffraenz/redoid) plugin for Homebridge

## Requirements
-	[Homebridge](https://github.com/nfarina/homebridge) - _HomeKit support for the impatient_

## Installation
1.	Install Homebridge using `npm install -g homebridge`
2.	Install this plugin `npm install -g homebridge-redoid`
3.	Update your configuration file. See sample-config.json in this repository for a sample.

See the Redoid [installation section](https://github.com/ffraenz/redoid#install-dependencies) for more details.

## Configuration
See the sample-config.json file to see an example of working accessory config. Following, all available options are explained:

The only mandatory option is the name:
 * ```name``` Accessory name.

The other available options are:
 * ```manufacter``` Manufacter name to be displayed.
 * ```model``` Model name to be displayed.
 * ```serial``` Serial number to be displayed.
 * ```transition_duration``` If not zero, the field defines the transition duration in milliseconds for the LED to move to a new color (Default is 200ms).

## Licence

(The MIT License)

Copyright (c) 2019

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.