module nullstone.markup {
    export interface IMarkupParser<T> {
        on(listener: IMarkupSax<T>): IMarkupParser<T>
        setNamespaces (defaultXmlns: string, xXmlns: string): IMarkupParser<T>;
        setExtensionParser (parser: IMarkupExtensionParser): IMarkupParser<T>;
        parse(root: T);
        skipBranch();
    }
    export var NO_PARSER: IMarkupParser<any> = {
        on (listener: IMarkupSax<any>): IMarkupParser<any> {
            return NO_PARSER;
        },
        setNamespaces (defaultXmlns: string, xXmlns: string): IMarkupParser<any> {
            return NO_PARSER;
        },
        setExtensionParser (parser: IMarkupExtensionParser): IMarkupParser<any> {
            return NO_PARSER;
        },
        parse (root: any) {
        },
        skipBranch (): any {
        }
    };


    export interface IMarkupSax<T> {
        resolveType?: events.IResolveType;
        resolveObject?: events.IResolveObject;
        resolvePrimitive?: events.IResolvePrimitive;
        resolveResources?: events.IResolveResources;
        branchSkip?: events.IBranchSkip<T>;
        object?: events.IObject;
        objectEnd?: events.IObjectEnd;
        contentText?: events.IText;
        name?: events.IName;
        key?: events.IKey;
        propertyStart?: events.IPropertyStart;
        propertyEnd?: events.IPropertyEnd;
        error?: events.IResumableError;
        end?: () => any;
    }

    var oresolve: IOutType = {
        isPrimitive: false,
        type: Object
    };

    export function createMarkupSax<T> (listener: IMarkupSax<T>): IMarkupSax<T> {
        return {
            resolveType: listener.resolveType || ((uri, name) => oresolve),
            resolveObject: listener.resolveObject || ((type) => new (type)()),
            resolvePrimitive: listener.resolvePrimitive || ((type, text) => new (type)(text)),
            resolveResources: listener.resolveResources || ((owner, ownerType) => new Object()),
            branchSkip: listener.branchSkip || ((root, obj) => {
            }),
            object: listener.object || ((obj, isContent) => {
            }),
            objectEnd: listener.objectEnd || ((obj, isContent, prev) => {
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
            error: listener.error || ((e) => true),
            end: listener.end || (() => {
            })
        };
    }
}