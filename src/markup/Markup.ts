module nullstone.markup {
    var mds: Markup<any>[] = [];

    export function createMarkup<T extends Markup<any>>(markupType: Function, uri: string): T;
    export function createMarkup<T extends Markup<any>>(markupType: Function, uri: Uri): T;
    export function createMarkup<T extends Markup<any>>(markupType: Function, uri: any): T {
        var url = uri.toString();
        var md: T = <any>mds[url];
        if (md)
            return md;
        md = new (<any>markupType)();
        md.uri = new Uri(url);
        return md;
    }

    export class Markup<T> {
        uri: Uri;
        root: T;

        constructor () {
        }

        createParser (): IMarkupParser<T> {
            return NO_PARSER;
        }

        resolve (typemgr: ITypeManager): async.IAsyncRequest<any> {
            var resolver = new MarkupDependencyResolver<T>(typemgr, this.createParser());
            resolver.collect(this.root);
            return resolver.resolve();
        }

        loadAsync (): async.IAsyncRequest<Markup<T>> {
            var reqUri = "text!" + this.uri.toString();
            var md = this;
            return async.create((resolve, reject) => {
                (<Function>require)([reqUri], (data: string) => {
                    md.setRoot(md.loadRoot(data));
                    resolve(md);
                }, reject);
            });
        }

        loadRoot (data: string): T {
            return <T><any>data;
        }

        setRoot (markup: T): Markup<T> {
            this.root = markup;
            return this;
        }
    }
}