module nullstone.markup {
    export interface IMarkupParser<T> {
        on(listener: IMarkupSax): IMarkupParser<T>
        setNamespaces (defaultXmlns: string, xXmlns: string): IMarkupParser<T>;
        setExtensionParser (parser: IMarkupExtensionParser): IMarkupParser<T>;
        parse(root: T);
    }
    export var NO_PARSER: IMarkupParser<any> = {
        on (listener: IMarkupSax): IMarkupParser<any> {
            return NO_PARSER;
        },
        setNamespaces (defaultXmlns: string, xXmlns: string): IMarkupParser<any> {
            return NO_PARSER;
        },
        setExtensionParser (parser: IMarkupExtensionParser): IMarkupParser<any> {
            return NO_PARSER;
        },
        parse (root: any) {
        }
    };


    export interface IMarkupSax {
        resolveType?: events.IResolveType;
        resolveObject?: events.IResolveObject;
        object?: events.IObject;
        objectEnd?: events.IObject;
        contentObject?: events.IObject;
        contentText?: events.IText;
        name?: events.IName;
        key?: events.IKey;
        propertyStart?: events.IPropertyStart;
        propertyEnd?: events.IPropertyEnd;
        resourcesStart?: events.IResourcesStart;
        resourcesEnd?: events.IResourcesEnd;
        error?: events.IResumableError;
        end?: () => any;
    }

    export function createMarkupSax (listener: IMarkupSax): IMarkupSax {
        return {
            resolveType: listener.resolveType || ((uri, name) => Object),
            resolveObject: listener.resolveObject || ((type) => new (type)()),
            object: listener.object || ((obj) => {
            }),
            objectEnd: listener.objectEnd || ((obj) => {
            }),
            contentObject: listener.contentObject || ((obj) => {
            }),
            contentText: listener.contentText || ((text) => {
            }),
            name: listener.name || ((name) => {
            }),
            key: listener.key || ((key) => {
            }),
            propertyStart: listener.propertyStart || ((ownerType, propName) => {
            }),
            propertyEnd: listener.propertyEnd || ((ownerType, propName) => {
            }),
            resourcesStart: listener.resourcesStart || ((owner) => {
            }),
            resourcesEnd: listener.resourcesEnd || ((owner) => {
            }),
            error: listener.error || ((e) => true),
            end: listener.end || (() => {
            })
        };
    }
}