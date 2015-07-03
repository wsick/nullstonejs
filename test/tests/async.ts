module nullstone.tests.async {
    QUnit.module("async");

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

    QUnit.asyncTest("Many Resolve", () => {
        var as: nullstone.async.IAsyncRequest<any>[] = [];

        as.push(nullstone.async.resolve({}));
        as.push(nullstone.async.resolve({}));
        as.push(nullstone.async.resolve({}));

        nullstone.async.many(as)
            .then(res => {
                QUnit.start();
                ok(true);
            }, err => {
                QUnit.start();
                ok(false);
            });
    });

    QUnit.asyncTest("Many Resolve", () => {
        var as: nullstone.async.IAsyncRequest<any>[] = [];

        as.push(nullstone.async.reject({}));
        as.push(nullstone.async.resolve({}));
        as.push(nullstone.async.reject({}));

        nullstone.async.many(as)
            .then(res => {
                QUnit.start();
                ok(false);
            }, err => {
                QUnit.start();
                ok(true);
            });
    });
}