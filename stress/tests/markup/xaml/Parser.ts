import StressTest = require('../../../StressTest');

var parser = new DOMParser();

class Parser extends StressTest {
    xmlDoc: Document;

    prepare (ready?: () => any): boolean {
        require(['text!docs/Metro.theme.xml'], (doc: string) => {
            this.xmlDoc = parser.parseFromString(doc, "text/xml");
            ready();
        });
        return true;
    }

    runIteration () {
        var parser = new sax.xaml.Parser()
            .parse(this.xmlDoc.documentElement);
    }
}
export = Parser;