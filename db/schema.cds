namespace cap.demo;

using {
    cuid,
    Currency,
    managed,
    sap
} from '@sap/cds/common';

entity Files : cuid, managed {
    //key ID        : String(40);
    title     : String(40)                    @mandatory;
    descr     : String;
    type      : Association to TypeCodes      @mandatory;
    //type_code : TypeCodes : code default 'JSON';
    content   : String;
    imageUrl  : String;
    imageUri  : LargeString;
    // the following throws errors on create!
    //imageUrl : String                        @Core.IsURL  @Core.MediaType : 'image/svg+xml';
    //imageUrl  : String    @Core.IsURL  @Core.MediaType : imageType;
    imageType : String default 'image/svg+xml'@Core.IsMediaType;
}

annotate Files with {
    // imageType @cds.on.insert : 'image/svg+xml';
}

entity TypeCodes : sap.common.CodeList {
    key code : String(14);
}

entity Books : managed {
    key ID       : Integer;
        title    : localized String(111);
        descr    : localized String(1111);
        author   : Association to Authors;
        genre    : Association to Genres;
        stock    : Integer;
        price    : Decimal;
        currency : Currency;
        image    : LargeBinary @Core.MediaType : 'image/png';
}

entity Authors : managed {
    key ID           : Integer;
        name         : String(111);
        dateOfBirth  : Date;
        dateOfDeath  : Date;
        placeOfBirth : String;
        placeOfDeath : String;
        books        : Association to many Books
                           on books.author = $self;
}

/**
 * Hierarchically organized Code List for Genres
 */
entity Genres : sap.common.CodeList {
    key ID       : Integer;
        parent   : Association to Genres;
        children : Composition of many Genres
                       on children.parent = $self;
}
