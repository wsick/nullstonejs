module nullstone.markup.xaml.tests {
    QUnit.module('xaml:excluder');

    QUnit.asyncTest("Exclude theme's library", () => {
        var tm = new TypeManager("http://schemas.wsick.com/fayde", "http://schemas.wsick.com/fayde/x");
        var xm = XamlMarkup.create("docs/libtheme.xml");
        var hit = false;
        xm.loadAsync()
            .then(() => {
                xm.resolve(tm, (ownerUri, ownerName, propName, val) => {}, (uri, name) => {
                    if (uri === "lib://mylib") {
                        hit = true;
                        return true;
                    }
                    return false;
                }).then(() => {
                    QUnit.start();
                    ok(hit);
                });
            }, (err) => {
                //This will hit if it tries to resolve mylib since mylib is non-existent
                QUnit.start();
                ok(false, err.message);
            });
    });
}