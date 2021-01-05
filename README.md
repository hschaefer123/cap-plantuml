# Getting Started

Welcome to a small SAP CAP demo (@sap/cds).

This [repo](https://github.com/hschaefer123/cap-plantuml) showcases the rendering of JSON diagrams with [PlantUML](https://plantuml.com/de/).

The demo renders a SVG from given JSON string using plantuml.jar executed via command line.

It contains these folders and files, following our recommended project layout:

The app is created with CDS init and follows the best practise

File or Folder | Purpose
---------|----------
`app/` | content for UI frontends goes here <not used>
`db/` | your domain models and data go here <not used>
`srv/` | your service models and code go here
`package.json` | project metadata and configuration
`readme.md` | this getting started guide

## Info
PlantUML offers a diagrams-as-code approach, where images are created from a textuell representation.
There are simliar projects and you can find an intro here
https://dev.to/simonbrown/diagrams-as-code-20eo

## Prerequisites

For local testing, the destinations need to be locally available!
Since sharing credentials in a git repo is a bad idea in general, please copy the template 

```cp tpl-default-env.json default-env.json```

to the used one, because this file is used by cap and ignored from git.
The northwind example will work out-of-the-box. 
The s4hana destination is only for demonstration, how to enter auth credentials for destinations.

**default-env.json**
```json
{
    "VCAP_SERVICES": {},
    "destinations": [
        {
            "name": "northwind",
            "url": "https://services.odata.org/V2/Northwind/Northwind.svc"
        },
        {
            "name": "s4hana",
            "url": "http://s4hana.system.de:8000/sap/opu/odata/sap/API_PRODUCT_SRV",
            "path": "/sap/opu/odata/sap/API_PRODUCT_SRV",
            "username": "<username>",
            "password": "<password>"
        }
    ]
}
```

## Next Steps
- Open a new terminal and run `cds watch` 
- (in VS Code simply choose _**Terminal** > Run Task > cds watch_)

## Test Demos
The demos are available using auto starting launchpad
http://localhost:4004

The classic homepage is available using route 
http://localhost:4004/services

![svg](./doc/cap-plant-flp.gif "FLP Animation")

## Test call rendering plain object
Just render an inline object using 

http://localhost:4004/plantuml/renderTest()

![svg](./doc/Test.svg "Test Diagram")

## Northwind service call rendering orderById

http://localhost:4004/plantuml/renderNorthwindOrder(OrderID=10248)

![svg](./doc/NorthwindOrder.svg "Order Diagram")

## Booksshop Schema

http://localhost:4004/plantuml/renderBookshopSchema()

![svg](./doc/BookshopSchema.svg "Bookschop Schemaq")

## Visual Studio Code Demo
If you are using Microsoft Visal Studio Code and the great extension 
[REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) by Huachao Mao,
you will find addtional http test calls in the test folder.

To be able to externalize credentials (and maybe also host).

**.env**
```
User=xxx
Password=xxx
```

The extension substitutes POSTMAN and allows you to call REST services.

The ```Product.http``` file also showcases calling SAP API services with prefetching ```X-CSRF-Token```,
because you can depend on results of former calls.

Inside ```Northwind.http``` you can test the used call and maybe figure out, what i want too add as a nice goody ;-)

### Generate JSON Diagram directly from REST Client

![svg](./doc/cap-plant-rest-client.gif "REST client diagram generation")

## Learn More

Learn more at https://cap.cloud.sap/docs/get-started/.
