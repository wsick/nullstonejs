module nullstone.markup {
    export module extevents {
        export interface IResolveType {
            (xmlns: string, name: string): any;
        }
        export interface IResolveObject {
            (type: any): any;
        }
        export interface IError {
            (e: Error);
        }
    }

    export interface INsPrefixResolver {
        lookupNamespaceURI(prefix: string): string;
    }
    export interface IMarkupExtensionParser {
        setNamespaces (defaultXmlns: string, xXmlns: string): IMarkupExtensionParser;
        onResolveType (cb?: extevents.IResolveType): IMarkupExtensionParser;
        onResolveObject (cb?: extevents.IResolveObject): IMarkupExtensionParser;
        onError (cb?: extevents.IError): IMarkupExtensionParser;
        parse(val: string, resolver: INsPrefixResolver, os: any[]):any;
    }
}