using {API_PRODUCT_SRV as product} from './external/API_PRODUCT_SRV';

service PlantUMLService @(path : '/plantuml') {

    function renderTest() returns String;
    function renderProduct(Product : String) returns String;

}
