module nullstone.xaml {
    var parser = new DOMParser();

    export class Xaml extends markup.Markup<Element> {
        static create (uri: string): Xaml;
        static create (uri: Uri): Xaml;
        static create (uri: any): Xaml {
            return markup.createMarkup<Xaml>(Xaml, uri);
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