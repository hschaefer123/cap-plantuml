const cds = require('@sap/cds');
var express = require('express');
const { resolve } = require('path')
const { v2ToJSON } = require('./srv/lib/helper')
const plantuml = require('./srv/lib/plantuml');

cds.once('bootstrap', (app) => {
    if (app.get('env') === 'development') {
        // TODO: skip if running in watch mode (does not make sense!)
        const livereload = require('easy-livereload')

        app.use(livereload({
            // change watchDirs (default = ['public'])
            watchDirs: [
                // folders { db: 'db/', srv: 'srv/', app: 'app/' } 
                resolve(cds.env.folders.srv)
            ],
            // default checks are on (css|js)
            /*
            checkFunc: function (file) {
                return /\.(css|js|html)$/.test(file);
            },
            */
            port: process.env.LIVERELOAD_PORT || 35729
        }));
    }

    // mount static resources and common middlewares...

    // using custom app/index.html flp sandbox using /services for original index.html
    app.get('/services', function (_, res) {
        const index = require('@sap/cds/app/index.js')
        res.send(index.html)
    })

    // helper route for REST client
    app.use(express.json());
    app.post('/plantJSON', async function (req, res) {
        const { mode } = req.query
        let jsonObject = req.body

        const json = (mode === 'v2')
            ? v2ToJSON(jsonObject) : JSON.stringify(jsonObject)

        // render SVG using plantuml (current release needs update of plantuml.jar for new JSON diagrams!)
        const svg = await plantuml("@startjson\r\n" + json + "\r\n@endjson");

        // return custom content type by overriding CAP response handling
        res.set('Content-Type', 'image/svg+xml');
        res.send(svg)
    })
})

module.exports = cds.server; // > delegate to default server.js