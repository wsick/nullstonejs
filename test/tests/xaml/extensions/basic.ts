module nullstone.markup.xaml.extensions.tests {
    QUnit.module('xaml.extensions.basic');

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
        Other: string;
        Some: any;
        Impl: any;

        init (val: string) {
        }

        resolveTypeFields (resolver: (full: string) => any) {
            if (typeof this.Impl === "string")
                this.Impl = resolver(this.Impl);
        }
    }

    var oresolve: IOutType = {
        isPrimitive: false,
        type: Object
    };
    var parser = new XamlExtensionParser()
        .onResolveType((xmlns, name) => {
            if (xmlns === DEFAULT_XMLNS && name === "StaticResource") {
                oresolve.type = StaticResource;
            } else if (xmlns === DEFAULT_XMLNS && name === "Random") {
                oresolve.type = Random;
            } else {
                var func = new Function("return function " + name + "() { }");
                oresolve.type = func();
            }
            return oresolve;
        });
    var mock = {
        resolver: function (): INsPrefixResolver {
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
        var val = parser.parse("{Random Foo={StaticResource Two}, Other=3}", mock.resolver(), []);
        var expected = new Random();
        expected.Foo = 2;
        expected.Other = "3";
        deepEqual(val, expected);
    });

    QUnit.test("Single-quote escaped", () => {
        var val = parser.parse("{Random Other='} a\\'s'}", mock.resolver(), []);
        var expected = new Random();
        expected.Other = "} a's";
        deepEqual(val, expected);
    });

    QUnit.test("Nested xtype", () => {
        var val = parser.parse("{Random Some={x:Type Random}}", mock.resolver(), []);
        var expected = new Random();
        expected.Some = Random;
        deepEqual(val, expected);
    });

    QUnit.test("Resolve implicit type", () => {
        var val = parser.parse("{Random Impl=Random}", mock.resolver(), []);
        var expected = new Random();
        expected.Impl = Random;
        deepEqual(val, expected);
    });

    QUnit.test("No parse non-alpha extension", () => {
        var val = parser.parse("{0}", mock.resolver(), []);
        deepEqual(val, "{0}");

        val = parser.parse("{0:d}", mock.resolver(), []);
        deepEqual(val, "{0:d}");
    });

    QUnit.test("Nested non-alpha extension", () => {
        var val = parser.parse("{Random Other={0:d}}", mock.resolver(), []);
        var expected = new Random();
        expected.Other = "{0:d}";
        deepEqual(val, expected);
    });
}