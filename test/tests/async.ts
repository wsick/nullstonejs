module nullstone.tests.async {
    QUnit.module("Async");

    QUnit.test("Resolve", (assert) => {
        nullstone.async.create((resolve, reject) => {
            resolve({});
        }).then(result => {
            assert.ok(true);
        }, err => {
            assert.ok(!false, err);
        });
    });

    QUnit.test("Reject", (assert) => {
        nullstone.async.create((resolve, reject) => {
            reject("Errored");
        }).then(result => {
            assert.ok(false, "Should not resolve");
        }, err => {
            assert.strictEqual(err, "Errored");
        });
    });

    QUnit.asyncTest("Asynchronous Resolve", () => {
        nullstone.async.create((resolve, reject) => {
            setTimeout(() => resolve({}), 1);
        }).then(result => {
            QUnit.start();
            ok(true);
        }, err => {
            QUnit.start();
            ok(!false, err);
        });
    });

    QUnit.asyncTest("Asynchronous Reject", () => {
        nullstone.async.create((resolve, reject) => {
            setTimeout(() => reject("Errored"), 1);
        }).then(result => {
            QUnit.start();
            ok(false, "Should not resolve");
        }, err => {
            QUnit.start();
            strictEqual(err, "Errored");
        });
    });
}