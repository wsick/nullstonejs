module nullstone.tests.uri {
    QUnit.module("Uri");

    QUnit.test("ctor", (assert) => {
        var uri1 = new Uri("http://test1/path/to");
        assert.strictEqual(uri1.kind, UriKind.RelativeOrAbsolute);

        uri1 = new Uri("http://test1/path/to", UriKind.Absolute);
        assert.strictEqual(uri1.kind, UriKind.Absolute);

        var uri2 = new Uri(uri1);
        assert.strictEqual(uri2.toString(), uri1.toString());
        assert.strictEqual(uri2.kind, uri1.kind);
    });

    QUnit.test("Scheme", (assert) => {
        var uri = new Uri("http://some.com/path?query=true");
        assert.strictEqual(uri.scheme, "http");

        var uri = new Uri("https://some.com");
        assert.strictEqual(uri.scheme, "https");
    });

    QUnit.test("Host", (assert) => {
        var uri = new Uri("http://some.com/path?query=true");
        assert.strictEqual(uri.host, "some.com");

        var uri = new Uri("https://some.com");
        assert.strictEqual(uri.host, "some.com");

        //TODO: Implement port stripping for host
        /*
         var uri = new Uri("https://some.com:12345/");
         assert.strictEqual(uri.host, "some.com");
         */
    });

    QUnit.test("AbsolutePath", (assert) => {
        var uri = new Uri("http://some.com/path/to");
        assert.strictEqual(uri.absolutePath, "/path/to");

        var uri = new Uri("http://some.com/path?query=true");
        assert.strictEqual(uri.absolutePath, "/path");

        var uri = new Uri("https://some.com");
        assert.strictEqual(uri.absolutePath, "/");
    });

    QUnit.test("Fragment", (assert) => {
        var uri = new Uri("http://some.com/path/to");
        assert.strictEqual(uri.fragment, "");

        var uri = new Uri("http://some.com/path/to#");
        assert.strictEqual(uri.fragment, "#");

        var uri = new Uri("http://some.com/path/to#frag");
        assert.strictEqual(uri.fragment, "#frag");
    });
}