sap.ui.define(['sap/fe/core/AppComponent'], function (AppComponent) {
    'use strict';

    if (location.hostname === 'localhost') {
        // disable ui5 cache for reuse components while developing
        sap.ui.getCore().getConfiguration().setUI5CacheOn(false);
    }

    return AppComponent.extend("cap.demo.files.Component", {
        metadata: {
            manifest: "json"
        }
    });
});
