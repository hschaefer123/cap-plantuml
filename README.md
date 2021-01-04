# Getting Started

Welcome to a small SAP CAP demo (@sap/cds).

This demo showcases the rendering of JSON diagrams with [PlantUML](https://plantuml.com/de/).

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
Since sharing credentials in git is a bad idea, please copy the template 
```cp tpl-default-env.json default-env.json```
to the used one, because this file is used by cap and ignore from git.

## Next Steps

- Open a new terminal and run `cds watch` 
- (in VS Code simply choose _**Terminal** > Run Task > cds watch_)
- open test inside browser: http://localhost:4004/plantuml/renderTest()
- open http://localhost:4004/plantuml/renderNorthwindOrder(OrderID=10248) to test northwind destination

## Visual Studio Code Demo
If you are using Microsoft Visal Studio Code and the REST Client Extension humao.rest-client,
there is a test folder with an example how to trigger render directly from extension.

## Learn More

Learn more at https://cap.cloud.sap/docs/get-started/.
