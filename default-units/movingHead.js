module.exports = {
    metadata: {
        plugin: "movingHead",
        label: "Moving Head",
        role: "actor",
        family: "movingHead",
        deviceTypes: ["art-net/artNetUniverse"],
        services: [{
            id: "off",
            label: "Off"
        }, {
            id: "changeTilt",
            label: "Change Tilt"
        }, {
            id: "changePan",
            label: "Change Pan"
        }, {
            id: "setGobo",
            label: "Set Gobo"
        }],
        state: [{
            id: "tilt",
            label: "Tilt",
            type: {
                id: "integer"
            }
        }, {
            id: "pan",
            label: "Pan",
            type: {
                id: "integer"
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
        return new MovingHead();
    }
};

var q = require('q');

/**
 *
 */
function MovingHead() {
    /**
     *
     */
    MovingHead.prototype.start = function () {
        var deferred = q.defer();

        this.state = {
            tilt: 0,
            pan: 0
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
    MovingHead.prototype.getState = function () {
        return this.state;
    };

    /**
     *
     */
    MovingHead.prototype.setState = function (state) {
        this.state = state;

        this.publishStateChange();
    };

    /**
     *
     */
    MovingHead.prototype.off = function (parameters) {
        this.state.pan = 0;
        this.state.tilt = 0;

        this.publishStateChange();
    };

    /**
     *
     */
    MovingHead.prototype.changePan = function (parameters) {
        this.state.pan = parameters.pan;

        this.publishStateChange();
    };

    /**
     *
     */
    MovingHead.prototype.changeTilt = function (parameters) {
        this.state.tilt = parameters.tilt;

        this.publishStateChange();
    };

    /**
     *
     */
    MovingHead.prototype.setGobo = function (parameters) {
        console.log("Set Gobo: " + parameters.gobo);

        this.publishStateChange();
    };
};
