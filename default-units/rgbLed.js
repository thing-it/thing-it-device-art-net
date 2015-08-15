module.exports = {
    metadata: {
        plugin: "rgbLed",
        label: "LED (RGB)",
        role: "actor",
        family: "coloredLight",
        deviceTypes: ["art-net/artNetUniverse"],
        services: [{
            id: "on",
            label: "On"
        }, {
            id: "off",
            label: "Off"
        }, {
            id: "setIntensity",
            label: "Set Intensity"
        }, {
            id: "color",
            label: "Color",
            parameters: [{
                label: "RGB-Color (hex.)",
                id: "rgbColorHex",
                type: {
                    id: "string"
                }
            }]
        }, {
            id: "setRedValue",
            label: "Set Red Value",
            parameters: [{
                label: "Red Value",
                id: "value",
                type: {
                    id: "integer"
                }
            }]
        }, {
            id: "setGreenValue",
            label: "Set Green Value",
            parameters: [{
                label: "Green Value",
                id: "value",
                type: {
                    id: "integer"
                }
            }]
        }, {
            id: "setBlueValue",
            label: "Set Blue Value",
            parameters: [{
                label: "Blue Value",
                id: "value",
                type: {
                    id: "integer"
                }
            }]
        }],
        state: [{
            id: "red",
            label: "Red",
            type: {
                id: "integer"
            }
        }, {
            id: "green",
            label: "Green",
            type: {
                id: "integer"
            }
        }, {
            id: "blue",
            label: "Blue",
            type: {
                id: "integer"
            }
        }, {
            id: "intensity",
            label: "Intensity",
            type: {
                id: "integer"
            }
        }, {
            id: "hex",
            label: "Hex",
            type: {
                id: "string"
            }
        }, {
            id: "effectiveHex",
            label: "effectiveHex",
            type: {
                id: "string"
            }
        }],
        configuration: [{
            label: "DMX Start Address",
            id: "dmxStartAddress",
            type: {
                id: "integer"
            },
            defaultValue: "1"
        }]
    },
    create: function () {
        return new RgbLed();
    }
};

var q = require('q');

/**
 *
 */
function RgbLed() {
    /**
     *
     */
    RgbLed.prototype.start = function () {
        var deferred = q.defer();

        this.state = {
            red: 0,
            green: 0,
            blue: 0,
            intensity: 0,
            hex: "#000000",
            effectiveHex: 0
        };

        if (!this.isSimulated()) {
            try {
                //this.logInfo("Device", this.device.artnet);
            } catch (error) {
                console.trace(error);

                this.device.node
                    .publishMessage("Cannot initialize "
                    + this.device.id + "/" + this.id
                    + ":" + error);
            }
        }

        deferred.resolve();

        return deferred.promise;
    };

    /**
     *
     */
    RgbLed.prototype.getState = function () {
        return this.state;
    };

    /**
     *
     */
    RgbLed.prototype.setState = function (state) {
        this.state = state;
        this.state.hex = rgbToHex(this.state.red, this.state.green,
            this.state.blue);
        this.effectiveHex = shadeColor(this.state.hex, this.state.intensity);

        this.pushDmxState();
        this.publishStateChange();
    };

    /**
     *
     */
    RgbLed.prototype.pushDmxState = function () {
        if (!this.isSimulated()) {
            this.device.universe.set(this.configuration.dmxStartAddress, [this.state.red, this.state.green,
                this.state.blue]);
        }
    };

    /**
     *
     */
    RgbLed.prototype.on = function () {
        this.state = {
            red: 255,
            green: 255,
            blue: 255,
            intensity: 100,
            hex: "#FFFFFF",
            effectiveHex: "#FFFFFF"
        };

        this.pushDmxState();
        this.publishStateChange();
    };

    /**
     *
     */
    RgbLed.prototype.off = function () {
        this.setState({
            red: 0,
            green: 0,
            blue: 0,
            intensity: -100
        });
    };

    /**
     *
     */
    RgbLed.prototype.setIntensity = function (parameter) {
        this.state.intensity = parameter.instensity;

        this.setState(this.state);
    };

    /**
     *
     */
    RgbLed.prototype.color = function (parameters) {
        var rgb = hexToRgb(parameters.rgbColorHex);
        this.setState({
            red: rgb.r,
            green: rgb.g,
            blue: rgb.b,
            intensity: this.state.intensity
        });
    };

    /**
     *
     */
    RgbLed.prototype.setRedValue = function (parameters) {
        this.setState({
            red: Math.max(0, Math.min(parameters.value, 255)),
            green: this.state.green,
            blue: this.state.blue,
            intensity: this.state.intensity
        });
    };

    /**
     *
     */
    RgbLed.prototype.setGreenValue = function (parameters) {
        this.setState({
            red: this.state.red,
            green: Math.max(0, Math.min(parameters.value, 255)),
            blue: this.state.blue,
            intensity: this.state.intensity
        });
    };

    /**
     *
     */
    RgbLed.prototype.setBlueValue = function (parameters) {
        this.setState({
            red: this.state.red,
            green: this.state.green,
            blue: Math.max(0, Math.min(parameters.value, 255)),
            intensity: this.state.intensity
        });
    };
};

/**
 *
 * @param hex
 * @returns
 */
function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")

    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;

    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

/**
 *
 * @param r
 * @param g
 * @param b
 * @returns {String}
 */
function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function shadeColor(color, percent) {
    var f = parseInt(color.slice(1), 16), t = percent < 0 ? 0 : 255, p = percent < 0 ? percent * -1 : percent, R = f >> 16, G = f >> 8 & 0x00FF, B = f & 0x0000FF;
    return "#" + (0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 + (Math.round((t - G) * p) + G) * 0x100 + (Math.round((t - B) * p) + B)).toString(16).slice(1);
}

