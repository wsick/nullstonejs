import StressTest = require('../../../StressTest');

class Extension extends StressTest {
    parser = new sax.xaml.extensions.ExtensionParser();
    os: any[] = [];

    runIteration () {
        this.parser.parse("{StaticResource RealllllyLong}", null, this.os);
    }
}
export = Extension;