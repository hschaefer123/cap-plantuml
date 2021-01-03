const cds = require('@sap/cds')
const plantuml = require('./lib/plantuml');

module.exports = async function () {

    const apiProductSrv = await cds.connect.to('API_PRODUCT_SRV');

    // http://localhost:4004/plantuml/renderTest()
    this.on('renderTest', async (req) => {
        const jsonObject = {
            "fruit": "Apple",
            "size": "Large",
            "color": "Red"
        }

        // render SVG using plantuml (current release needs update of plantuml.jar for new JSON diagrams!)
        const svg = await plantuml("@startjson\r\n" + JSON.stringify(jsonObject) + "\r\n@endjson");

        // return custom content type by overriding CAP response handling
        req._.res.set('Content-Type', 'image/svg+xml');
        req._.res.end(svg);
    })

    /* call product function
     * http://localhost:4004/plantuml/renderProduct(Product='200000001')
    */
    this.on('renderProduct', async (req) => {
        const { Product } = req.data

        const path = "/A_Product('" + Product + "')?$format=json" +
            "&$select=Product,ProductType,IsMarkedForDeletion,GrossWeight,WeightUnit,NetWeight,ProductGroup,BaseUnit,ProductIsConfigurable," +
            "to_Plant/Plant,to_Plant/PurchasingGroup,to_Plant/CountryOfOrigin," +
            "to_Description/ProductDescription,to_Description/Language," +
            "to_ProductUnitsOfMeasure/AlternativeUnit,to_ProductUnitsOfMeasure/QuantityNumerator,to_ProductUnitsOfMeasure/QuantityDenominator," +
            "to_SalesDelivery/ProductSalesOrg,to_SalesDelivery/ProductDistributionChnl,to_SalesDelivery/MinimumOrderQuantity,to_SalesDelivery/SupplyingPlant,to_SalesDelivery/DeliveryNoteProcMinDelivQty,to_SalesDelivery/DeliveryQuantity,to_SalesDelivery/IsMarkedForDeletion," +
            "to_SalesDelivery/to_SalesText/Language,to_SalesDelivery/to_SalesText/LongText" +
            "&$expand=to_Description,to_Plant,to_ProductBasicText,to_ProductSales,to_ProductUnitsOfMeasure,to_ProductUnitsOfMeasure/to_InternationalArticleNumber,to_SalesDelivery,to_SalesDelivery/to_SalesText"

        // call API_PRODUCT_SRV using CAP external service consumption using url string input
        let response = await apiProductSrv.tx(req).get(path)

        // remove unnecessary stuff
        deletePropFromObj(response, '__metadata')

        // render SVG using plantuml (current release needs update of plantuml.jar for new JSON diagrams!)
        const svg = await plantuml("@startjson\r\n" + JSON.stringify(response) + "\r\n@endjson");

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
