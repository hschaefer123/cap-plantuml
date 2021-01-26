const cds = require('@sap/cds')
const plantuml = require('./lib/plantuml');

const { db } = cds.services // or cds.db
const { Files } = cds.entities('cap.demo')

/**
 * Enumeration values for FieldControlType
 * @see https://github.com/SAP/odata-vocabularies/blob/master/vocabularies/Common.md#FieldControlType
 */
const FieldControl = {
    Mandatory: 7,
    Optional: 3,
    ReadOnly: 1,
    Inapplicable: 0
};

class DemoService extends cds.ApplicationService {
    async init() {
        
    //module.exports = async (srv) => {
    //const { Files } = srv.entities // get reflected definitions

    // run during editing
    this.before('PATCH', 'Files', async (req) => {
        const { ID, content } = req.data

        if (content) {
            let data = content

            //if (demo.type_code === 'JSON') {
            //data = "@startjson\r\n" + JSON.stringify(data) + "\r\n@endjson"
            data = "@startjson\r\n" + data + "\r\n@endjson"
            //}

            let svg = await plantuml(data);

            // skip leading <?xml...>
            svg = svg.substr(svg.indexOf('>') + 1)
            svg = encodeURIComponent(svg)

            // set imageUri
            req.data.imageUri = `data:image/svg+xml;utf8,${svg}`
            //req.data.imageUri = content

        }

        console.log("...................patch", req.data)
    })

    /*
    // run before create
    srv.before('CREATE', 'Files', (req) => {
        const { content } = req.data

        console.log("...................create", req.data)
        console.log("render and save SVG for: ", content)
    })

    // run before update
    srv.before('UPDATE', 'Files', (req) => {
        console.log("...................update", req.data)
    })
    */

    // run before final draft save only
    this.before('SAVE', 'Files', (req) => {
        const { content } = req.data

        console.log("...................save", req.data)
        console.log("render and save SVG for: ", content)
    })

    // Calls to bound actions/functions
    this.on('getSvgDataUri', 'Files', async (req) => {
        const { ID } = req.params[0]
        const results = await srv.get(Files).where({ ID: ID })
        const demo = results[0]

        let data = results[0].content

        if (demo.type_code === 'JSON') {
            data = "@startjson\r\n" + JSON.stringify(data) + "\r\n@endjson"
        }

        let svg = await plantuml(data);

        // skip leading <?xml...>
        svg = svg.substr(svg.indexOf('>') + 1)
        console.log("svg", svg)

        return `data:image/svg+xml;utf8,${svg}`

        // return custom content type by overriding CAP response handling
        //req._.res.set('Content-Type', 'image/svg+xml');
        //req._.res.end(svg);
    })

    return super.init()

//}
    }

}

module.exports = { DemoService }