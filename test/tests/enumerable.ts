module nullstone.tests.enumerable {
    QUnit.module("IEnumerable");

    QUnit.test("Empty", (assert) => {
        var items = [];
        for (var en = IEnumerable_.empty.getEnumerator(true); en.moveNext();) {
            items.push(en.current);
        }
        assert.deepEqual(items, []);
    });

    QUnit.test("fromArray", (assert) => {
        var items = [];
        for (var en = IEnumerable_.fromArray([1, 2, 3]).getEnumerator(true); en.moveNext();) {
            items.push(en.current);
        }
        assert.deepEqual(items, [3, 2, 1]);
    });

    QUnit.test("toArray", (assert) => {
        var en = IEnumerable_.fromArray([1, 2, 3]);
        assert.deepEqual(IEnumerable_.toArray(en), [1, 2, 3]);
    });
}