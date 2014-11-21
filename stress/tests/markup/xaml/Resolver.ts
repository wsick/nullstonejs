import StressTest = require('../../../StressTest');
import XamlMarkup = nullstone.markup.xaml.XamlMarkup;
import MarkupDependencyResolver = nullstone.markup.MarkupDependencyResolver;

var typemgr = new nullstone.TypeManager("http://schemas.wsick.com/fayde", "http://schemas.wsick.com/fayde/x");

class Resolver extends StressTest {
    resolver: MarkupDependencyResolver<Element>;
    xm: XamlMarkup;

    prepare (ready?: () => any): boolean {
        this.xm = XamlMarkup.create('docs/Metro.theme.xml');
        this.resolver = new MarkupDependencyResolver<Element>(typemgr, this.xm.createParser());
        this.xm.loadAsync()
            .then(ready, err => {
                console.error(err);
            });
        return true;
    }

    runIteration () {
        this.resolver.collect(this.xm.root);
    }
}
export = Resolver;