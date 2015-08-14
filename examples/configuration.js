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
            id: "simpleLight",
            label: "Simple Light",
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
        }, {
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
            script: "artNetUniverse1.rgbLed1.off(); artNetUniverse1.rgbLed2.off();artNetUniverse1.simpleLight.off();" +
            "artNetUniverse1.fogMachine.off();artNetUniverse1.movingHead.off();"
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
        }, {
            id: "storyboard1",
            label: "Storyboard 1",
            description: "",
            type: "storyboard",
            content: {
                easingInterval: 200,
                timeline: [{
                    timestamp: 0,
                    entries: [{
                        type: "actorStateChange",
                        device: "artNetUniverse1",
                        actor: "rgbLed1",
                        state: {
                            red: 255,
                            green: 0,
                            blue: 0,
                            intensity: 0
                        }
                    }]
                }, {
                    timestamp: 5000,
                    entries: [{
                        type: "actorStateChange",
                        device: "artNetUniverse1",
                        actor: "rgbLed1",
                        state: {
                            red: 255,
                            green: 0,
                            blue: 255,
                            intensity: 100
                        },
                        easing: "linear"
                    }]

                }, {
                    timestamp: 6000,
                    entries: [{
                        type: "actorStateChange",
                        device: "artNetUniverse1",
                        actor: "rgbLed2",
                        state: {
                            red: 255,
                            green: 0,
                            blue: 0,
                            intensity: 100
                        }
                    }]
                }, {
                    timestamp: 8000,
                    entries: [{
                        type: "actorStateChange",
                        device: "artNetUniverse1",
                        actor: "rgbLed1",
                        state: {
                            red: 255,
                            green: 0,
                            blue: 255,
                            intensity: -100
                        },
                        easing: "linear"
                    }]

                }, {
                    timestamp: 9000,
                    entries: [{
                        type: "actorStateChange",
                        device: "artNetUniverse1",
                        actor: "rgbLed1",
                        state: {
                            red: 0,
                            green: 255,
                            blue: 0,
                            intensity: 0
                        },
                        easing: "linear"
                    }, {
                        type: "actorStateChange",
                        device: "artNetUniverse1",
                        actor: "rgbLed2",
                        state: {
                            red: 0,
                            green: 0,
                            blue: 255,
                            intensity: 0
                        },
                        easing: "linear"
                    }]
                }, {
                    timestamp: 11000,
                    entries: [{
                        type: "actorStateChange",
                        device: "artNetUniverse1",
                        actor: "simpleLight",
                        state: {
                            intensity: 100
                        },
                        easing: "linear"
                    }, {
                        type: "actorStateChange",
                        device: "artNetUniverse1",
                        actor: "fogMachine",
                        state: {
                            intensity: 0
                        },
                        easing: "linear"
                    }]
                }, {
                    timestamp: 13000,
                    entries: [{
                        type: "nodeServiceCall",
                        service: "blackout"
                    }]
                }]
            }
        }],
    eventProcessors: [],
    data: []
};
