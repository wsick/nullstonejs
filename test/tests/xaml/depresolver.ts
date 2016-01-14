module nullstone.markup.xaml.tests {
    QUnit.module('xaml:depresolver');

    QUnit.asyncTest("App with ThemeName", () => {
        var tm = new TypeManager("http://schemas.wsick.com/fayde", "http://schemas.wsick.com/fayde/x");
        var xm = XamlMarkup.create("docs/appwtheme.xml");
        xm.loadAsync()
            .then(() => {
                var resolved: any;
                xm.resolve(tm, (ownerUri, ownerName, propName, val) => {
                    if (ownerName === "Application" && propName === "ThemeName")
                        resolved = val;
                }).then(() => {
                    QUnit.start();
                    strictEqual(resolved, "Metro");
                });
            }, (err) => {
                QUnit.start();
                ok(false, err.message);
            });
    });
}