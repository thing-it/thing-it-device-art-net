module.exports = {
    metadata: {
        family: "art-net",
        plugin: "artNetUniverse",
        label: "Art-Net Universe",
        manufacturer: "Various",
        actorTypes: [],
        sensorTypes: [],
        services: [],
        configuration: [{
            id: "host",
            label: "Host",
            type: {
                id: "string"
            },
            default: "255.255.255.255"
        }, {
            id: "port",
            label: "Port",
            type: {
                id: "integer"
            },
            default: 6454
        }, {
            id: "refreshInterval",
            label: "Refresh Interval (ms)",
            type: {
                id: "integer"
            },
            default: 4000
        }, {
            id: "iface",
            label: "IFace",
            type: {
                id: "string"
            }
        }]
    },
    create: function () {
        return new ArtNetUniverse();
    }
};

var q = require('q');
var artnet;

function ArtNetUniverse() {
    /**
     *
     */
    ArtNetUniverse.prototype.start = function () {
        var deferred = q.defer();

        this.operationalState = {
            status: 'PENDING',
            message: 'Waiting for initialization...'
        };
        this.publishOperationalStateChange();

        if (this.isSimulated()) {
            this.operationalState = {
                status: 'OK',
                message: 'Art-Net Universe successfully initialized'
            }
            this.publishOperationalStateChange();
            deferred.resolve();
        } else {
            if (!artnet) {
                artnet = require('artnet');
            }

            this.universe = artnet({
                host: this.configuration.host,
                port: this.configuration.port,
                refreshInterval: this.configuration.refreshInterval,
                iface: this.configuration.host
            });

            this.operationalState = {
                status: 'OK',
                message: 'Art-Net Universe successfully initialized'
            }
            this.publishOperationalStateChange();
            deferred.resolve();
        }

        return deferred.promise;
    };

    /**
     *
     */
    ArtNetUniverse.prototype.getState = function () {
        return {};
    };

    /**
     *
     */
    ArtNetUniverse.prototype.setState = function () {
    };
}
