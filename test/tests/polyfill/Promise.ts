module nullstone.polyfill.tests {
    QUnit.module("polyfill:Promise");

    QUnit.asyncTest("resolve", () => {
        Promise.resolve({})
            .then(result => {
                QUnit.start();
                ok(true);
            }, err => {
                QUnit.start();
                ok(!false, err);
            });
    });

    QUnit.asyncTest("reject", () => {
        Promise.reject<any>("Errored")
            .then(result => {
                QUnit.start();
                ok(false, "Should not resolve");
            }, err => {
                QUnit.start();
                strictEqual(err, "Errored");
            });
    });

    QUnit.asyncTest("async resolve", () => {
        new Promise((resolve, reject) => {
            setTimeout(() => resolve({}), 1);
        }).then(result => {
                QUnit.start();
                ok(true);
            }, err => {
                QUnit.start();
                ok(!false, err);
            });
    });

    QUnit.asyncTest("async reject", () => {
        new Promise((resolve, reject) => {
            setTimeout(() => reject("Errored"), 1);
        }).then(result => {
                QUnit.start();
                ok(false, "Should not resolve");
            }, err => {
                QUnit.start();
                strictEqual(err, "Errored");
            });
    });

    QUnit.asyncTest("all resolve", () => {
        var proms: Promise<any>[] = [];

        proms.push(Promise.resolve({}));
        proms.push(Promise.resolve({}));
        proms.push(Promise.resolve({}));

        Promise.all(proms)
            .then(res => {
                QUnit.start();
                ok(true);
            }, err => {
                QUnit.start();
                ok(false);
            });
    });

    QUnit.asyncTest("all mix", () => {
        var proms: Promise<any>[] = [];

        proms.push(Promise.reject({}));
        proms.push(Promise.resolve({}));
        proms.push(Promise.reject({}));

        Promise.all(proms)
            .then(res => {
                QUnit.start();
                ok(false);
            }, err => {
                QUnit.start();
                ok(true);
            });
    });

    QUnit.asyncTest("race resolve", () => {
        var prom = Promise.race([
            new Promise((resolve, reject) => setTimeout(() => resolve('a'), 1000)),
            new Promise((resolve, reject) => setTimeout(() => resolve('b'), 1)),
            new Promise((resolve, reject) => setTimeout(() => resolve('c'), 2000)),
            new Promise((resolve, reject) => setTimeout(() => reject('err'), 3000))
        ]);
        prom.then(result => {
            QUnit.start();
            strictEqual(result, 'b');
        }, err => {
            QUnit.start();
            ok(false, "Should not reject.");
        });
    });

    QUnit.asyncTest("race reject", () => {
        var prom = Promise.race([
            new Promise((resolve, reject) => setTimeout(() => resolve('a'), 2000)),
            new Promise((resolve, reject) => setTimeout(() => resolve('b'), 3000)),
            new Promise((resolve, reject) => setTimeout(() => resolve('c'), 4000)),
            new Promise((resolve, reject) => setTimeout(() => reject('err'), 1))
        ]);
        prom.then(result => {
            console.log('succeeded', result);
            QUnit.start();
            ok(false, "Should not resolve.");
        }, err => {
            console.log('errored');
            QUnit.start();
            strictEqual(err, 'err');
        });
    });

    QUnit.asyncTest("tap resolve", () => {
        var result = "result";
        var hitresult = null;
        var hiterr = null;
        Promise.resolve(result)
            .tap(res2 => hitresult = res2, err => hiterr = err)
            .then(res2 => {
                QUnit.start();
                strictEqual(res2, result);
                strictEqual(hitresult, result);
            }, err => {
                QUnit.start();
                ok(false, "Should not reject");
            });
    });

    QUnit.asyncTest("tap reject", () => {
        var err = "err";
        var hitresult = null;
        var hiterr = null;
        Promise.reject<any>(err)
            .tap(res2 => hitresult = res2, err2 => hiterr = err2)
            .then(res2 => {
                QUnit.start();
                ok(false, "Should not resolve");
            }, err2 => {
                QUnit.start();
                strictEqual(err2, err);
                strictEqual(hiterr, err);
            });
    });

    QUnit.asyncTest("tap resolve (subpromise)", () => {
        var result = "result";
        var result2 = "result2";
        var hitresult = null;
        var hiterr = null;
        Promise.resolve(result)
            .tap(res2 => new Promise((resolve, reject) => setTimeout(() => {
                resolve(result2);
                hitresult = result2;
            }, 50)), err => hiterr = err)
            .then(res2 => {
                QUnit.start();
                strictEqual(res2, result);
                strictEqual(hitresult, result2);
            }, err => {
                QUnit.start();
                ok(false, "Should not reject");
            });
    });

    QUnit.asyncTest("then(return Promise)", () => {
        Promise.resolve((resolve, reject) => setTimeout(resolve(), 1))
            .then(() => 2)
            .then(() => Promise.resolve(3))
            .then((result) => {
                QUnit.start();
                strictEqual(3, result);
            }, err => {
                QUnit.start();
                ok(false, "Should not reject");
            });
    });
}