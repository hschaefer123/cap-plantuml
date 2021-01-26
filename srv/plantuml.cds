using {Northwind as northwindSrv} from './external/Northwind';
//using {API_PRODUCT_SRV as productSrv} from './external/API_PRODUCT_SRV';

service PlantUMLService @(path : '/plantuml') {

    function renderTest() returns String;    
    function renderYaml() returns String;    
    function renderNorthwindOrder(OrderID : northwindSrv.Orders.OrderID) returns String;
    function renderBookshopSchema() returns String;
    //function renderProduct(Product : productSrv.A_Product.Product) returns String;

    // callback service action for VSC forwarded content
    action renderV2(json : String) returns String;
}
