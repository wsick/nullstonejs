module nullstone.markup.xaml.tests.invalid {
    QUnit.module('Markup:XAML Invalid Tests');

    QUnit.asyncTest("Invalid XML", () => {
        getDoc("docs/invalid.xml", (doc) => {
            QUnit.start();
            var errored = false;
            var parser = new XamlParser()
                .onError((e) => {
                    errored = true;
                    return true;
                })
                .onEnd(() => {
                    ok(errored);
                })
                .parse(doc.documentElement);
        }, (err) => {
            QUnit.start();
            ok(false, err.message);
        });
    });
}