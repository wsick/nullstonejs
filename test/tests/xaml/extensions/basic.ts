module nullstone.markup.xaml.extensions.tests {
    QUnit.module('Markup:XAML Extension (basic)');

    class StaticResource implements IMarkupExtension {
        ResourceKey: string;

        init (val: string) {
            this.ResourceKey = val;
        }

        transmute (os: any[]): any {
            if (this.ResourceKey === "Two")
                return 2;
            return this;
        }
    }

    class Random implements IMarkupExtension {
        Foo: number;
        init (val: string) {
        }
    }

    var parser = new XamlExtensionParser()
        .onResolveType((xmlns, name) => {
            if (xmlns === DEFAULT_XMLNS && name === "StaticResource")
                return StaticResource;
            if (xmlns === DEFAULT_XMLNS && name === "Random")
                return Random;
            var func = new Function("return function " + name + "() { }");
            return func();
        });
    var mock = {
        resolver: function (): INamespacePrefixResolver {
            return {
                lookupNamespaceURI: function (prefix: string): string {
                    if (prefix === null)
                        return DEFAULT_XMLNS;
                    if (prefix === "x")
                        return DEFAULT_XMLNS_X;
                    return "";
                }
            };
        }
    };

    QUnit.test("StaticResource (implicit)", () => {
        var val = parser.parse("{StaticResource SomeStyle}", mock.resolver(), []);
        var expected = new StaticResource();
        expected.ResourceKey = "SomeStyle";
        deepEqual(val, expected);
    });

    QUnit.test("StaticResource (Property)", () => {
        var val = parser.parse("{StaticResource ResourceKey=Some\\{Style}", mock.resolver(), []);
        var expected = new StaticResource();
        expected.ResourceKey = "Some{Style";
        deepEqual(val, expected);
    });

    QUnit.test("Subextension", () => {
        var val = parser.parse("{Random Foo={StaticResource Two}}", mock.resolver(), []);
        var expected = new Random();
        expected.Foo = 2;
        deepEqual(val, expected);
    });
}