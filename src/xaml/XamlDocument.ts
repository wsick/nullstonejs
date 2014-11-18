module nullstone.xaml {
    var parser = new DOMParser();
    var xds: XamlDocument[] = [];

    export class XamlDocument {
        Document: Document;

        constructor (xaml: string) {
            this.Document = parser.parseFromString(xaml, "text/xml");
        }

        resolve (resolver: IXamlDependencyResolver): async.IAsyncRequest<any> {
            resolver.collect(this.Document.documentElement);
            return resolver.resolve();
        }

        static getAsync (url: string): async.IAsyncRequest<XamlDocument>;
        static getAsync (url: Uri): async.IAsyncRequest<XamlDocument>;
        static getAsync (url: any): async.IAsyncRequest<XamlDocument> {
            var reqUri = "text!" + url.toString();
            return async.create((resolve, reject) => {
                var xd = xds[reqUri];
                if (xd)
                    return resolve(xd);
                (<Function>require)([reqUri], (xaml: string) => {
                    resolve(xd = new XamlDocument(xaml));
                }, reject);
            });
        }
    }
}