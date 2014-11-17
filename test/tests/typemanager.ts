module nullstone.tests.typemanager {
    QUnit.module("Type Resolver");

    var DEFAULT_XMLNS = "http://schemas.wsick.com/nullstone";
    var X_XMLNS = "http://schemas.wsick.com/nullstone/x";
    var typemgr = new TypeManager(DEFAULT_XMLNS, X_XMLNS);

    QUnit.test("Resolve primitives", (assert) => {
        var oresolve: IOutType = {
            isPrimitive: false,
            type: undefined
        };
        assert.ok(typemgr.resolveType(X_XMLNS, "String", oresolve));
        assert.strictEqual(oresolve.isPrimitive, true);
        assert.strictEqual(oresolve.type, String);

        assert.ok(typemgr.resolveType(X_XMLNS, "Number", oresolve));
        assert.strictEqual(oresolve.isPrimitive, true);
        assert.strictEqual(oresolve.type, Number);

        assert.ok(typemgr.resolveType(X_XMLNS, "Double", oresolve));
        assert.strictEqual(oresolve.isPrimitive, true);
        assert.strictEqual(oresolve.type, Number);

        assert.ok(typemgr.resolveType(X_XMLNS, "Date", oresolve));
        assert.strictEqual(oresolve.isPrimitive, true);
        assert.strictEqual(oresolve.type, Date);

        assert.ok(typemgr.resolveType(X_XMLNS, "RegExp", oresolve));
        assert.strictEqual(oresolve.isPrimitive, true);
        assert.strictEqual(oresolve.type, RegExp);

        assert.ok(typemgr.resolveType(X_XMLNS, "Boolean", oresolve));
        assert.strictEqual(oresolve.isPrimitive, true);
        assert.strictEqual(oresolve.type, Boolean);

        assert.ok(typemgr.resolveType(X_XMLNS, "Uri", oresolve));
        assert.strictEqual(oresolve.isPrimitive, true);
        assert.strictEqual(oresolve.type, Uri);
    });

    class MockClass {
    }

    QUnit.test("Resolve Custom library type", (assert) => {
        var SOME_NS = "http://some.namespace/";
        typemgr.add(SOME_NS, "MockClass", MockClass);

        var oresolve: IOutType = {
            isPrimitive: false,
            type: undefined
        };
        assert.ok(typemgr.resolveType(SOME_NS, "MockClass", oresolve));
        assert.strictEqual(oresolve.isPrimitive, false);
        assert.strictEqual(oresolve.type, MockClass);
    });
}