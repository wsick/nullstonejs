module nullstone.tests.uri {
    QUnit.module("uri");

    QUnit.test("ctor", (assert) => {
        var uri1 = new Uri("http://test1/path/to");
        assert.strictEqual(uri1.kind, UriKind.RelativeOrAbsolute);

        uri1 = new Uri("http://test1/path/to", UriKind.Absolute);
        assert.strictEqual(uri1.kind, UriKind.Absolute);

        var uri2 = new Uri(uri1);
        assert.strictEqual(uri2.toString(), uri1.toString());
        assert.strictEqual(uri2.kind, uri1.kind);
    });

    QUnit.test("ctor (relative)", (assert) => {
        var uri1 = new Uri("http://test1/path/to");

        var uri2 = new Uri(uri1, "/page1");
        assert.strictEqual(uri2.originalString, "http://test1/page1");

        uri2 = new Uri(uri1, "page1");
        assert.strictEqual(uri2.originalString, "http://test1/path/page1");

        uri2 = new Uri(uri1, new Uri("/page1"));
        assert.strictEqual(uri2.originalString, "http://test1/page1");

        uri2 = new Uri(uri1, new Uri("page1"));
        assert.strictEqual(uri2.originalString, "http://test1/path/page1");

        uri2 = new Uri(uri1, new Uri("page1?query=true#test"));
        assert.strictEqual(uri2.originalString, "http://test1/path/page1?query=true#test");
    });

    QUnit.test("ctor (relative w/query)", (assert) => {
        var uri1 = new Uri("http://test1/path/to?query=true#test");

        var uri2 = new Uri(uri1, "/page1");
        assert.strictEqual(uri2.originalString, "http://test1/page1");

        uri2 = new Uri(uri1, "page1");
        assert.strictEqual(uri2.originalString, "http://test1/path/page1");

        uri2 = new Uri(uri1, new Uri("/page1"));
        assert.strictEqual(uri2.originalString, "http://test1/page1");

        uri2 = new Uri(uri1, new Uri("page1"));
        assert.strictEqual(uri2.originalString, "http://test1/path/page1");

        uri2 = new Uri(uri1, new Uri("page1?query=true#test"));
        assert.strictEqual(uri2.originalString, "http://test1/path/page1?query=true#test");
    });

    QUnit.test("ctor (relative w/fragment)", (assert) => {
        var uri1 = new Uri("http://test1/path/to#test?query=true");

        var uri2 = new Uri(uri1, "/page1");
        assert.strictEqual(uri2.originalString, "http://test1/page1");

        uri2 = new Uri(uri1, "page1");
        assert.strictEqual(uri2.originalString, "http://test1/path/page1");

        uri2 = new Uri(uri1, new Uri("/page1"));
        assert.strictEqual(uri2.originalString, "http://test1/page1");

        uri2 = new Uri(uri1, new Uri("page1"));
        assert.strictEqual(uri2.originalString, "http://test1/path/page1");

        uri2 = new Uri(uri1, new Uri("page1?query=true#test"));
        assert.strictEqual(uri2.originalString, "http://test1/path/page1?query=true#test");
    });

    QUnit.test("Scheme", (assert) => {
        var uri = new Uri("http://some.com/path?query=true");
        assert.strictEqual(uri.scheme, "http");

        var uri = new Uri("https://some.com");
        assert.strictEqual(uri.scheme, "https");

        var uri = new Uri("lib://blueprint-core$images/gear.png");
        assert.strictEqual(uri.scheme, "lib");

        var uri = new Uri("lib://blueprint-core/controls$images/gear.png");
        assert.strictEqual(uri.scheme, "lib");
    });

    QUnit.test("Host", (assert) => {
        var uri = new Uri("http://some.com/path?query=true");
        assert.strictEqual(uri.host, "some.com");

        var uri = new Uri("https://some.com");
        assert.strictEqual(uri.host, "some.com");

        var uri = new Uri("https://some.com/");
        assert.strictEqual(uri.host, "some.com");

         var uri = new Uri("https://some.com:12345/");
         assert.strictEqual(uri.host, "some.com");

        var uri = new Uri("lib://blueprint-core?query");
        assert.strictEqual(uri.host, "blueprint-core");

        var uri = new Uri("lib://blueprint-core#fragment");
        assert.strictEqual(uri.host, "blueprint-core");

        var uri = new Uri("lib://blueprint-core$images/gear.png");
        assert.strictEqual(uri.host, "blueprint-core");
    });

    QUnit.test("Port", (assert) => {
        var uri = new Uri("http://some.com/path?query=true");
        assert.strictEqual(uri.port, 80);

        var uri = new Uri("https://some.com/path?query=true");
        assert.strictEqual(uri.port, 443);

        var uri = new Uri("http://some.com:8080/path?query=true");
        assert.strictEqual(uri.port, 8080);

        var uri = new Uri("https://some.com:444/path?query=true");
        assert.strictEqual(uri.port, 444);
    });

    QUnit.test("AbsolutePath", (assert) => {
        var uri = new Uri("http://some.com/path/to");
        assert.strictEqual(uri.absolutePath, "/path/to");

        var uri = new Uri("http://some.com/path?query=true");
        assert.strictEqual(uri.absolutePath, "/path");

        var uri = new Uri("https://some.com");
        assert.strictEqual(uri.absolutePath, "/");

        var uri = new Uri("https://some.com/path/to#nothing");
        assert.strictEqual(uri.absolutePath, "/path/to");

        var uri = new Uri("https://some.com/path/to?query=true#nothing");
        assert.strictEqual(uri.absolutePath, "/path/to");

        var uri = new Uri("lib://blueprint-core$images/gear.png");
        assert.strictEqual(uri.absolutePath, "/");

        var uri = new Uri("lib://blueprint-core/controls$images/gear.png");
        assert.strictEqual(uri.absolutePath, "/controls");
    });

    QUnit.test("Fragment", (assert) => {
        var uri = new Uri("http://some.com/path/to");
        assert.strictEqual(uri.fragment, "");

        var uri = new Uri("http://some.com/path/to#");
        assert.strictEqual(uri.fragment, "#");

        var uri = new Uri("http://some.com/path/to#frag");
        assert.strictEqual(uri.fragment, "#frag");

        var uri = new Uri("lib://blueprint-core$images/gear.png");
        assert.strictEqual(uri.fragment, "");

        var uri = new Uri("lib://blueprint-core#fragment$images/gear.png");
        assert.strictEqual(uri.fragment, "#fragment$images/gear.png");

        var uri = new Uri("lib://blueprint-core/controls$images/gear.png#idempotent");
        assert.strictEqual(uri.fragment, "");
    });

    QUnit.test("Resource", (assert) => {
        var uri = new Uri("lib://blueprint-core");
        assert.strictEqual(uri.resource, "");

        var uri = new Uri("lib://blueprint-core/controls");
        assert.strictEqual(uri.resource, "");

        var uri = new Uri("lib://blueprint-core$images/gear.png");
        assert.strictEqual(uri.resource, "$images/gear.png");

        var uri = new Uri("lib://blueprint-core#fragment$images/gear.png");
        assert.strictEqual(uri.resource, "");

        var uri = new Uri("lib://blueprint-core/controls$images/gear.png?query#idempotent");
        assert.strictEqual(uri.resource, "$images/gear.png?query#idempotent");
    });
}