using {cap.demo as my} from '../db/schema';

service DemoService {

  entity Files     as projection on my.Files actions {
    // bound actions/functions
    function getSvgDataUri() returns String;
  };

  @readonly
  entity TypeCodes as projection on my.TypeCodes;

}
