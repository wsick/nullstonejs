module nullstone.tests.uri {
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