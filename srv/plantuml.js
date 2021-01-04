const cds = require('@sap/cds')
const plantuml = require('./lib/plantuml');

module.exports = async function () {

    const northwindSrv = await cds.connect.to('Northwind');
    //const apiProductSrv = await cds.connect.to('API_PRODUCT_SRV');    

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
        const path = `/Orders(${OrderID})?$expand=Customer,Order_Details`

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

}

// recursively delete a key from anywhere in the object
// will mutate the obj - no need to return it
const deletePropFromObj = (obj, deleteThisKey) => {
    if (Array.isArray(obj)) {
        obj.forEach(element => deletePropFromObj(element, deleteThisKey))
    } else if (typeof obj === 'object') {
        for (const key in obj) {
            const value = obj[key]
            if (key === deleteThisKey) delete obj[key]
            else deletePropFromObj(value, deleteThisKey)
        }
    }
}

function v2ToJSON(odata) {
    // remove unnecessary stuff
    deletePropFromObj(odata, '__metadata')
    deletePropFromObj(odata, '__deferred')

    return JSON.stringify(odata)
}