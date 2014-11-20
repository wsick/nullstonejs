module nullstone.xaml {
    var parser = new DOMParser();
    var xcache = new Memoizer<Xaml>((key) => new Xaml(key));

    export class Xaml extends markup.Markup<Element> {
        static create (uri: string): Xaml;
        static create (uri: Uri): Xaml;
        static create (uri: any): Xaml {
            return xcache.memoize(uri.toString());
        }

        createParser () {
            return new sax.xaml.Parser();
        }

        loadRoot (data: string): Element {
            var doc = parser.parseFromString(data, "text/xml");
            return doc.documentElement;
        }
    }
}