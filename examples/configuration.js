module.exports = {
    label: "Gala Birmingham",
    id: "galaBirmingham",
    devices: [{
        label: "Art-Net Universe 1",
        id: "artNetUniverse1",
        plugin: "art-net/artNetUniverse",
        logLevel: "debug",
        configuration: {},
        actors: [{
            id: "rgbLed1",
            label: "RGB LED 1",
            type: "rgbLed",
            configuration: {
                "dmxStartAddress": 1
            }
        }, {
            id: "rgbLed2",
            label: "RGB LED 2",
            type: "rgbLed",
            configuration: {
                "dmxStartAddress": 4
            }
        }, {
            id: "simpleLight1",
            label: "Simple Light 1",
            type: "simpleLight",
            configuration: {
                "dmxStartAddress": 7
            }
        }, {
            id: "fogMachine",
            label: "Fog Machine",
            type: "fogMachine",
            configuration: {
                "dmxStartAddress": 8
            }
        },  {
            id: "movingHead",
            label: "Moving Head",
            type: "movingHead",
            configuration: {
                "dmxStartAddress": 9
            }
        }], sensors: []
    }],
    groups: [],
    services: [{
        id: "blackout",
        label: "Blackout",
        type: "script",
        content: {
            script: ""
        }
    },
        {
            id: "scene1",
            label: "Scene 1",
            type: "script",
            content: {
                script: ""
            }
        },
        {
            id: "scene2",
            label: "Scene 2",
            type: "script",
            content: {
                script: ""
            }
        }],
    eventProcessors: [],
    data: []
};
