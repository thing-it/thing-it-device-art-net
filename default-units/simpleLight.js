module.exports = {
    metadata: {
        plugin: "simpleLight",
        label: "Simple Light",
        role: "actor",
        family: "simpleLight",
        deviceTypes: ["art-net/artNetUniverse"],
        services: [{
            id: "on",
            label: "On"
        }, {
            id: "off",
            label: "Off"
        }, {
            id: "blink",
            label: "Blink"
        }, {
            id: "setIntensity",
            label: "Set Intensity"
        }],
        state: [{
            id: "blink",
            label: "Blink",
            type: {
                id: "boolean"
            }
        }, {
            id: "intensity",
            label: "Intensity",
            type: {
                id: "integer"
            }
        }],
        configuration: [{
            label: "DMX Address",
            id: "dmxAddress",
            type: {
                id: "integer"
            },
            defaultValue: "1"
        }]
    },
    create: function () {
        return new SimpleLight();
    }
};

var q = require('q');

/**
 *
 */
function SimpleLight() {
    /**
     *
     */
    SimpleLight.prototype.start = function () {
        var deferred = q.defer();

        this.state = {
            blink: false,
            intensity: 0
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
    SimpleLight.prototype.getState = function () {
        return this.state;
    };

    /**
     *
     */
    SimpleLight.prototype.setState = function (state) {
        this.state = state;

        this.pushDmxState();
        this.publishStateChange();
    };

    /**
     *
     */
    SimpleLight.prototype.pushDmxState = function () {
        if (!this.isSimulated()) {
            this.device.universe.set(this.configuration.dmxAddress, [this.state.intensity]);
        }
    };

    /**
     *
     */
    SimpleLight.prototype.on = function () {
        this.state.intensity = 255;

        this.pushDmxState();
        this.publishStateChange();
    };

    /**
     *
     */
    SimpleLight.prototype.off = function () {
        this.state.intensity = 0;

        this.pushDmxState();
        this.publishStateChange();
    };

    /**
     *
     */
    SimpleLight.prototype.setIntensity = function (parameters) {
        this.state.intensity = parameters.intensity;

        this.pushDmxState();
        this.publishStateChange();
    };

    /**
     *
     */
    SimpleLight.prototype.blink = function () {
        this.state.blink = true;

        this.pushDmxState();
        this.publishStateChange();
    };
};
