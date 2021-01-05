const cds = require('@sap/cds')
const plantuml = require('./lib/plantuml');
const { v2ToJSON, getName, } = require('./lib/helper')

module.exports = async function () {

    const northwindSrv = await cds.connect.to('Northwind');
    //const apiProductSrv = await cds.connect.to('API_PRODUCT_SRV');    

    // use reflection
    const csn = await cds.load('db')    // load model from source
    const m = cds.reflect(csn)          // reflected model    

    // http://localhost:4004/plantuml/renderTest()
    this.on('renderTest', async (req) => {
        const jsonObject = {
            "ID": "12345",
            "Object": {
                "String": "hello world",
                "Integer": 1,
                "Boolean": true
            },
            "Array": ["1", 1, true],
            "ArrayOfObjects": [{ "Pos": 1, "Name": "a" }, { "Pos": 2, "Name": "b" }]
        }

        // render SVG using plantuml (current release needs update of plantuml.jar for new JSON diagrams!)
        const svg = await plantuml("@startjson\r\n" + JSON.stringify(jsonObject) + "\r\n@endjson");

        // return custom content type by overriding CAP response handling
        req._.res.set('Content-Type', 'image/svg+xml');
        req._.res.end(svg);
    })

    // trying to implement callback service used by VSC rest client
    // currently waiting for my feature request https://github.com/Huachao/vscode-restclient/issues/745
    // to be able to json stringify relevant data
    this.on('renderV2', async (req) => {
        const { json } = req.data

        // render SVG using plantuml (current release needs update of plantuml.jar for new JSON diagrams!)
        const svg = await plantuml("@startjson\r\n" + v2ToJSON(response) + "\r\n@endjson");

        // return custom content type by overriding CAP response handling
        req._.res.set('Content-Type', 'image/svg+xml');
        req._.res.end(svg);
    })

    /* Render Northwind order by id
     * http://localhost:4004/plantuml/renderNorthwindOrder(OrderID=10248)
     * https://services.odata.org/V2/Northwind/Northwind.svc/Orders(10248)?$format=json&$expand=Customer,Order_Details
    */
    this.on('renderNorthwindOrder', async (req) => {
        const { OrderID } = req.data

        // do not add $format=json, because it will be auto added by framework and othervice used twice leading to error!
        const path = `/Orders(${OrderID})?$expand=Customer,Order_Details,Order_Details`

        // call API_PRODUCT_SRV using CAP external service consumption using url string input
        let response = await northwindSrv.tx(req).get(path)

        // render SVG using plantuml (current release needs update of plantuml.jar for new JSON diagrams!)
        const svg = await plantuml("@startjson\r\n" + v2ToJSON(response) + "\r\n@endjson");

        // return custom content type by overriding CAP response handling
        req._.res.set('Content-Type', 'image/svg+xml');
        req._.res.end(svg);
    })

    /* call product function
     * http://localhost:4004/plantuml/renderProduct(Product='200000001')
    */
    this.on('renderProduct', async (req) => {
        const { Product } = req.data

        const path = "/A_Product('" + Product + "')" +
            "&$select=Product,ProductType,IsMarkedForDeletion,GrossWeight,WeightUnit,NetWeight,ProductGroup,BaseUnit,ProductIsConfigurable," +
            "to_Plant/Plant,to_Plant/PurchasingGroup,to_Plant/CountryOfOrigin," +
            "to_Description/ProductDescription,to_Description/Language," +
            "to_ProductUnitsOfMeasure/AlternativeUnit,to_ProductUnitsOfMeasure/QuantityNumerator,to_ProductUnitsOfMeasure/QuantityDenominator," +
            "to_SalesDelivery/ProductSalesOrg,to_SalesDelivery/ProductDistributionChnl,to_SalesDelivery/MinimumOrderQuantity,to_SalesDelivery/SupplyingPlant,to_SalesDelivery/DeliveryNoteProcMinDelivQty,to_SalesDelivery/DeliveryQuantity,to_SalesDelivery/IsMarkedForDeletion," +
            "to_SalesDelivery/to_SalesText/Language,to_SalesDelivery/to_SalesText/LongText" +
            "&$expand=to_Description,to_Plant,to_ProductBasicText,to_ProductSales,to_ProductUnitsOfMeasure,to_ProductUnitsOfMeasure/to_InternationalArticleNumber,to_SalesDelivery,to_SalesDelivery/to_SalesText"

        // call API_PRODUCT_SRV using CAP external service consumption using url string input
        let response = await apiProductSrv.tx(req).get(path)

        // render SVG using plantuml (current release needs update of plantuml.jar for new JSON diagrams!)
        const svg = await plantuml("@startjson\r\n" + v2ToJSON(response) + "\r\n@endjson");

        // return custom content type by overriding CAP response handling
        req._.res.set('Content-Type', 'image/svg+xml');
        req._.res.end(svg);
    })

    /* Render BookshopSchema
     * http://localhost:4004/plantuml/renderBookshopSchema()
    */    
    this.on('renderBookshopSchema', async (req) => {
        let ns = 'sap.capire.bookshop', lines = [], assocs = []

        lines.push(`@startuml`)
        // start of package
        lines.push(`package ${ns} {`)

        m.forall('entity', function (e) {
            if (e.name.startsWith(ns)) {
                lines.push('entity  ' + getName(e.name) + ' {')
                // props
                Object.entries(e.elements).forEach(([name, value]) => {
                    let key = value.key ? '+' : ''
                    let localized = value.localized ? 'localized ' : ''
                    if (value.localized && !value.key) {
                        // mark localized props
                        key = '~'
                    }
                    let type = (value.type === 'cds.String' && value.length)
                        ? `String[${value.length}]` : value.type.replace('cds.', '')
                    lines.push(`${key}${name}: ${localized} ${type}`)
                });
                lines.push('}')

                // assocs
                Object.entries(e.elements).forEach(([key, value]) => {
                    if (value.target && value.target != e.name) {
                        assocs.push(getName(e.name) + ' o-- ' + getName(value.target))
                    }
                });
            }
        })

        // add assocations after entities!
        assocs.forEach(assoc => lines.push(assoc))

        // end of package
        lines.push('}')

        lines.push("@enduml")

        // render SVG using plantuml (current release needs update of plantuml.jar for new JSON diagrams!)
        const svg = await plantuml(lines.join("\r\n"));

        // return custom content type by overriding CAP response handling
        req._.res.set('Content-Type', 'image/svg+xml');
        req._.res.end(svg);
    })

}