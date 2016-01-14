module nullstone.tests.event {
    QUnit.module("event");

    var mock = {
        listener: function () {
            var o = {
                raisecount: 0,
                scope: {},
                func: function (sender, args: IEventArgs) {
                    o.raisecount++;
                }
            };
            return o;
        }
    };

    QUnit.test("Raise", (assert) => {
        var ev = new Event<IEventArgs>();
        var listener = mock.listener();
        ev.on(listener.func, listener.scope);
        ev.raise({}, {});
        assert.strictEqual(listener.raisecount, 1);
    });

    QUnit.test("Off", (assert) => {
        var ev = new Event<IEventArgs>();
        var list1 = mock.listener();
        var list2 = mock.listener();
        ev.on(list1.func, list1.scope);
        ev.on(list2.func, list2.scope);
        ev.on(list1.func, list1.scope);
        ev.raise({}, {});
        assert.strictEqual(list1.raisecount, 2);
        assert.strictEqual(list2.raisecount, 1);

        ev.off(list1.func, list1.scope);
        ev.raise({}, {});
        assert.strictEqual(list1.raisecount, 2);
        assert.strictEqual(list2.raisecount, 2);

        ev.off(list2.func, list2.scope);
        ev.raise({}, {});
        assert.strictEqual(list1.raisecount, 2);
        assert.strictEqual(list2.raisecount, 2);
    });

    QUnit.test("Subscribe:Function", (assert) => {
        var ev = new Event<IEventArgs>();
        var expectedargs = {};

        var hitcount = 0;
        var disp = ev.subscribe((args: IEventArgs) => {
            hitcount++;
            assert.strictEqual(args, expectedargs);
        });

        ev.raise({}, expectedargs);
        assert.strictEqual(hitcount, 1);
        ev.raise({}, expectedargs);
        assert.strictEqual(hitcount, 2);

        disp.dispose();
        ev.raise({}, expectedargs);
        assert.strictEqual(hitcount, 2);
    });

    QUnit.test("Subscribe:Observer", (assert) => {
        var ev = new Event<IEventArgs>();
        var expectedargs = {};

        var hitcount = 0;
        var observer = <IObserver<IEventArgs>>{
            onNext (args: IEventArgs) {
                hitcount++;
                assert.strictEqual(args, expectedargs);
            },
            onCompleted () {
            },
            onError () {
            }
        };
        var disp = ev.subscribe(observer);

        ev.raise({}, expectedargs);
        assert.strictEqual(hitcount, 1);
        ev.raise({}, expectedargs);
        assert.strictEqual(hitcount, 2);

        disp.dispose();
        ev.raise({}, expectedargs);
        assert.strictEqual(hitcount, 2);
    });
}