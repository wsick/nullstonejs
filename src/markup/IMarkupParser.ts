module nullstone.markup {
    export interface IMarkupParser<T> {
        onResolveType (cb?: (uri: string, name: string) => any): IMarkupParser<T>;
        parse(root: T);
    }
    export var NO_PARSER: IMarkupParser<any> = {
        onResolveType (cb?: (uri: string, name: string) => any): IMarkupParser<any> {
            return NO_PARSER;
        },
        parse (root: any) {
        }
    };
}