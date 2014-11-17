module nullstone.tests.conversion {
    QUnit.module("Conversion");

    enum TestEnum {
        Option1,
        Option2,
        Option3
    }

    QUnit.test("Primitives", (assert) => {
        assert.strictEqual(convertAnyToType("1", Number), 1, "Integer conversion");
        assert.strictEqual(convertAnyToType("1.2", Number), 1.2, "Decimal conversion");
    });

    QUnit.test("Enums", (assert) => {
        assert.strictEqual(convertAnyToType("Option1", <any>(new Enum(TestEnum))), TestEnum.Option1);
    });

    QUnit.test("Boolean", (assert) => {
        assert.strictEqual(convertAnyToType("true", Boolean), true);
        assert.strictEqual(convertAnyToType("false", Boolean), false);
        assert.strictEqual(convertAnyToType("True", Boolean), true);
        assert.strictEqual(convertAnyToType("False", Boolean), false);
        assert.strictEqual(convertAnyToType("TRUE", Boolean), true);
        assert.strictEqual(convertAnyToType("FALSE", Boolean), false);
    });

    QUnit.test("String", (assert) => {
        assert.strictEqual(convertAnyToType(1, String), "1");
    });

    QUnit.test("Date", (assert) => {
        var actual = convertAnyToType("Mon Nov 17 2014 13:28:09 GMT-0500 (Eastern Standard Time)", Date).getTime();
        assert.strictEqual(actual, 1416248889000);
    });
}