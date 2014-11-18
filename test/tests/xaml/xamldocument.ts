module nullstone.tests.xaml.xamldocument {
    QUnit.module("Xaml Document");

    var DEFAULT_XMLNS = "http://schemas.wsick.com/nullstone";
    var X_XMLNS = "http://schemas.wsick.com/nullstone/x";
    var typemgr = new TypeManager(DEFAULT_XMLNS, X_XMLNS);
    var resolver = new nullstone.xaml.XamlDependencyResolver(typemgr);

    QUnit.asyncTest("Simple dependency", () => {
        nullstone.xaml.XamlDocument.getAsync("mock/simple.xaml")
            .then(xd => {
                xd.resolve(resolver)
                    .then(a => {
                        QUnit.start();
                        ok(true, a);

                        var oresolve = {
                            isPrimitive: false,
                            type: undefined
                        };
                        ok(typemgr.resolveType("mock", "AmdClass", oresolve));

                        strictEqual((<any>oresolve.type).name, "AmdClass");
                        var o: any = new (<any>oresolve.type)();
                        strictEqual(o.x, 1);
                    }, err => {
                        QUnit.start();
                        ok(false, err);
                    })
            }, err => {
                QUnit.start();
                ok(false, err);
            });
    });
}