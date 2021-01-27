(function () {
    window["sap-ushell-config"] = {
        "ushell": {
            "spaces": {
                "enabled": false
            },
            "home": {
                "featuredGroup": {
                    "enable": false
                },
                "gridContainer": true
            }
        },
        "defaultRenderer": "fiori2",
        "renderers": {
            "fiori2": {
                "componentData": {
                    "config": {
                        "enableSearch": false,
                        "rootIntent": "Shell-home",
                        "enableUserDefaultParameters": true,
                        "title": "PlantUML demos",
                        "sizeBehavior": "Responsive",
                        "applications": {
                            "Shell-home": {
                                "enableTileActionsIcon": false
                            }
                        }
                    }
                }
            }
        },
        "services": {
            "Container": {
                "adapter": {
                    "config": {
                        "image": "img/avatar/OpenUI5.svg"
                    }
                }
            },
            "NavTargetResolution": {
                "config": {
                    "runStandaloneAppFolderWhitelist": {
                        "*": true
                    },
                    "allowTestUrlComponentConfig": true,
                    "enableClientSideTargetResolution": false
                }
            }
        },
        "applications": {
            "CAP-display": {
                title: "CAP Services",
                description: "Embedded",
                applicationType: "URL",
                XadditionalInformation: "SAPUI5.Component=udina.plantuml.demo",
                url: "/services",
                navigationMode: "embedded"
            },
            "CAP-open": {
                title: "CAP Services",
                description: "New Window",
                applicationType: "URL",
                url: "/services"
            },
            "PlantUMLTest-display": {
                title: "JSON data",
                description: "Inline JSON object",
                applicationType: "URL",
                url: "/plantuml/renderTest()",
                navigationMode: "embedded"
            },
            "PlantUMLYaml-display": {
                title: "YAML data (sap4kids)",
                description: "Filesystem mta.yaml",
                applicationType: "URL",
                url: "/plantuml/renderYaml()",
                navigationMode: "embedded"
            },
            "PlantUMLDbSchema-display": {
                title: "ER Diagram cap.demo",
                description: "Reflection db schema",
                applicationType: "URL",
                url: "/plantuml/renderDBSchema()",
                navigationMode: "embedded"
            },
            "PlantUMLNorthwind-display": {
                title: "Northwind JSON data",
                description: "External OData Srv",
                applicationType: "URL",
                url: "/plantuml/renderNorthwindOrder(OrderID=10248)",
                navigationMode: "embedded"
            }
            /*
            "Demo-manage": {
                title: "Manage Demos",
                description: "CRUD Cockpit",
                additionalInformation: "SAPUI5.Component=cap.demo.files",
                applicationType : "URL",
                url: "/files/webapp",
                navigationMode: "embedded"
            },
            */            
        }
    };

    window.onInit = function () {
        sap.ushell.Container.createRenderer().placeAt("content");
    };

    document.write('<script src="https://ui5.sap.com/test-resources/sap/ushell/bootstrap/sandbox.js" xid="sap-ushell-bootstrap"><' + '/script>');
    document.write('<script src="https://ui5.sap.com/resources/sap-ui-core.js"' +
        ' id="sap-ui-bootstrap"' +
        ' data-sap-ui-theme="sap_fiori_3"' +
        ' data-sap-ui-language="en"' +
        ' data-sap-ui-libs="sap.ui.core, sap.m, sap.ushell, sap.fe.templates"' +
        ' data-sap-ui-compatVersion="edge"' +
        ' data-sap-ui-frameOptions="allow"' +
        ' data-sap-ui-flexibilityServices=\'[{"connector": "LocalStorageConnector"}]\'' +
        ' data-sap-ui-onInit="onInit"' + '<' + '/script>');
    document.write('<script src="https://ui5.sap.com/test-resources/sap/ushell/bootstrap/standalone.js"><' + '/script>');
})();