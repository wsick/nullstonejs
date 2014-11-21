import StressTest = require('../../../StressTest');

class Extension extends StressTest {
    parser = new nullstone.markup.xaml.XamlExtensionParser();
    os: any[] = [];

    runIteration () {
        this.parser.parse("{StaticResource RealllllyLong}", null, this.os);
    }
}
export = Extension;