module.exports = {
    metadata: {
        plugin: "fogMachine",
        label: "Fog Machine",
        role: "actor",
        family: "fogMachine",
        deviceTypes: ["art-net/artNetUniverse"],
        services: [{
            id: "setIntensity",
            label: "Set Intensity"
        }],
        state: [{
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
        return new FogMachine();
    }
};

var q = require('q');

/**
 *
 */
function FogMachine() {
    /**
     *
     */
    FogMachine.prototype.start = function () {
        var deferred = q.defer();

        this.state = {
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
    FogMachine.prototype.getState = function () {
        return this.state;
    };

    /**
     *
     */
    FogMachine.prototype.setState = function (state) {
        this.state = state;

        this.pushDmxState();
        this.publishStateChange();
    };

    /**
     *
     */
    FogMachine.prototype.pushDmxState = function () {
        if (!this.simulated) {
            this.device.universe.set(this.configuration.dmxAddress, [this.state.intensity]);
        }
    };

    /**
     *
     */
    FogMachine.prototype.setIntensity = function (parameters) {
        this.state.intensity = parameters.intensity;

        this.pushDmxState();
        this.publishStateChange();
    };

    /**
     *
     */
    FogMachine.prototype.setBlueValue = function (parameters) {
        this.state = {
            red: this.state.red,
            green: this.state.green,
            blue: Math.min(parameters.value, 255),
            hex: rgbToHex(this.state.red, this.state.green, Math.min(
                parameters.value, 255))
        };

        this.publishStateChange();
        this.pushDmxState();
    };
};
