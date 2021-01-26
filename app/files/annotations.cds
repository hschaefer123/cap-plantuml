using DemoService as my from '../../srv/demo-service';

// enable draft support to be able to use managed CRUD
annotate my.Files with @odata.draft.enabled;

// auto generate uuid for files to skip enter ID prompt
annotate cuid with {
    ID @(
        title : '{i18n>ID}',
        UI.HiddenFilter,
        Core.Computed
    );
}

// https://github.com/SAP/odata-vocabularies/blob/master/vocabularies/Common.md
// https://github.com/SAP/odata-vocabularies/blob/master/vocabularies/UI.md

////////////////////////////////////////////////////////////////////////////
//
//	Files ListReport
//
annotate my.Files with @(
    // The listed properties form the semantic key, i.e. they are unique modulo IsActiveEntity
    Common.SemanticKey : [title],
    UI                 : {
        // Collection of fields identifying the object
        Identification      : [{Value : title}],
        // Properties that might be relevant for filtering a collection of entities of this type
        SelectionFields     : [
        title,
        type_code
        ],
        // Defines how the result of a queried collection of entities is shaped and how this result is displayed
        PresentationVariant : {
            // List of sort criteria
            SortOrder      : [{
                $Type      : 'Common.SortOrderType',
                Property   : title,
                Descending : false
            }],
            // Lists available visualization types. Currently supported types are:
            // UI.LineItem, UI.Chart, and UI.DataPoint
            Visualizations : ['@UI.LineItem']
        },
        // Collection of data fields for representation in a table or list
        LineItem            : [
        {Value : imageUrl},
        {Value : title},
        {Value : type_code}
        ]
    }
);

// force update of dependent props during draft roundtrip
annotate my.Files with @Common : {SideEffects #content : {
    SourceProperties : ['content'],
    TargetProperties : ['imageUri']
}};

////////////////////////////////////////////////////////////////////////////
//
//	Files ObjectPage
//
annotate my.Files with @(UI : {
    // Information for the header area of an entity representation.
    // HeaderInfo is mandatory for main entity types of the model
    HeaderInfo                     : {
        TypeName       : '{i18n>File}',
        TypeNamePlural : '{i18n>Files}',
        ImageUrl       : imageUrl,
        Title          : {Value : title},
        Description    : {Value : descr}
    },
    // Facets for additional object header information
    HeaderFacets                   : [
    {
        $Type  : 'UI.ReferenceFacet',
        Label  : '{i18n>GeneralInformation}',
        Target : '@UI.FieldGroup#GeneralInformation'

    },
    {
        $Type  : 'UI.ReferenceFacet',
        Label  : '{i18n>Created}',
        Target : '@UI.FieldGroup#Created'
    },
    {
        $Type  : 'UI.ReferenceFacet',
        Label  : '{i18n>Changed}',
        Target : '@UI.FieldGroup#Changed'
    }
    ],
    // Collection of facets
    Facets                         : [{
        $Type  : 'UI.ReferenceFacet',
        Label  : '{i18n>Content}',
        Target : '@UI.FieldGroup#Content',
        ID     : 'ContentFacet'
    }],
    /*
    Facets                         : [{
        $Type  : 'UI.CollectionFacet',
        Label  : '{i18n>Diagram}',
        ID     : 'DiagramFacet',
        Facets : [],
        ![@UI.Hidden] : isDraft
    }],
    */
    // Group of fields with an optional label
    FieldGroup #GeneralInformation : {Data : [{Value : type_code}]},
    FieldGroup #Content            : {Data : [{Value : content}]},
    FieldGroup #Created            : {Data : [
    {Value : createdBy},
    {Value : createdAt}
    ]},
    FieldGroup #Changed            : {Data : [
    {Value : modifiedBy},
    {Value : modifiedAt}
    ]}
});

////////////////////////////////////////////////////////////////////////////
//
//	Files Elements
//
annotate my.Files with {
    ID        @title : '{i18n>ID}'  @UI.HiddenFilter  @Core.Computed;
    title     @title : '{i18n>title}';
    descr     @title : '{i18n>descr}'  @UI.MultiLineText;
    type      @title : '{i18n>type}'  @Common : {
        Text                     : type.name,
        TextArrangement          : #TextOnly, //TextFirst
        ValueListWithFixedValues : true
    };
    content   @title : '{i18n>content}'  @UI.HiddenFilter;
    // IsImageURL -> Properties and terms annotated with this term MUST contain
    // a valid URL referencing an resource with a MIME type image
    imageUrl  @title : '{i18n>imageUrl}'  @UI.IsImageURL  @UI.HiddenFilter;
    imageType @title : '{i18n>imageType}'  @UI.HiddenFilter;
}

/*
// Add Value Help for Locales
annotate my.Books_texts {
 locale @ValueList:{entity:'Languages',type:#fixed}
}

// In addition we need to expose Languages through AdminService
using { sap } from '@sap/cds/common';
extend service AdminService {
 entity Languages as projection on sap.common.Languages;
}
*/
