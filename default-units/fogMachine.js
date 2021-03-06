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

        this.operationalState = {
            status: 'PENDING',
            message: 'Waiting for initialization...'
        };
        this.publishOperationalStateChange();

        this.state = {
            intensity: 0
        };

        if (!this.isSimulated()) {
            try {
                //this.logInfo("Device", this.device.artnet);

                this.operationalState = {
                    status: 'OK',
                    message: 'Fog Machine successfully initialized'
                }
                this.publishOperationalStateChange();        
        
            } catch (error) {
                console.trace(error);

                this.operationalState = {
                    status: 'ERROR',
                    message: 'Fog Machine initialization error'
                }
                this.publishOperationalStateChange(); 

                this.device.node
                    .publishMessage("Cannot initialize "
                    + this.device.id + "/" + this.id
                    + ":" + error);
            }
        } else {
            this.operationalState = {
                status: 'OK',
                message: 'Fog Machine successfully initialized'
            }
            this.publishOperationalStateChange();    
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
        if (!this.isSimulated()) {
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
    FogMachine.prototype.off = function () {
        this.state.intensity = 0;

        this.pushDmxState();
        this.publishStateChange();
    };
};
