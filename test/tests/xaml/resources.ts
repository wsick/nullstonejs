module nullstone.markup.xaml.tests {
    QUnit.module('Markup:XAML');

    QUnit.asyncTest("Resources", () => {
        getDoc("docs/resources.xml", (doc) => {
            mock.parse(doc.documentElement, (cmds) => {
                QUnit.start();

                //Application
                var i = 0;
                deepEqual(cmds[i], {
                    cmd: 'rt',
                    xmlns: DEFAULT_XMLNS,
                    name: 'Application',
                    type: cmds[i].type
                }, 'rt Application');
                i++;
                var app = cmds[i].obj;
                deepEqual(cmds[i], {
                    cmd: 'or',
                    type: cmds[i - 1].type,
                    obj: app
                }, 'or Application');
                i++;
                deepEqual(cmds[i], {
                    cmd: 'o',
                    obj: app,
                    isContent: true
                }, 'o(c) Application');
                //Application.Resources
                i++;
                var ares = cmds[i].obj;
                deepEqual(cmds[i], {
                    cmd: 'rr',
                    owner: app,
                    ownerType: app.constructor,
                    obj: ares
                }, 'rr Application.Resources');
                i++;
                deepEqual(cmds[i], {
                    cmd: 'o',
                    obj: cmds[i - 1].obj,
                    isContent: false
                }, 'o Resources');
                //Test1
                i++;
                deepEqual(cmds[i], {
                    cmd: 'rt',
                    xmlns: DEFAULT_XMLNS,
                    name: 'Test',
                    type: cmds[i].type
                }, 'rt Test');
                i++;
                var test1 = cmds[i].obj;
                deepEqual(cmds[i], {
                    cmd: 'or',
                    type: cmds[i - 1].type,
                    obj: test1
                }, 'or Test');
                i++;
                deepEqual(cmds[i], {
                    cmd: 'o',
                    obj: test1,
                    isContent: true
                }, 'o(c) Test');
                i++;
                deepEqual(cmds[i], {
                    cmd: 'oe',
                    obj: test1,
                    key: 'Test1',
                    isContent: true
                }, 'oe Test');
                //Test2
                i++;
                deepEqual(cmds[i], {
                    cmd: 'rt',
                    xmlns: DEFAULT_XMLNS,
                    name: 'Test',
                    type: cmds[i].type
                }, 'rt Test');
                i++;
                var test2 = cmds[i].obj;
                deepEqual(cmds[i], {
                    cmd: 'or',
                    type: cmds[i - 1].type,
                    obj: test2
                }, 'or Test');
                i++;
                deepEqual(cmds[i], {
                    cmd: 'o',
                    obj: test2,
                    isContent: true
                }, 'o(c) Test');
                i++;
                deepEqual(cmds[i], {
                    cmd: 'oe',
                    obj: test2,
                    key: 'Test2',
                    isContent: true
                }, 'oe Test');
                //Test3
                i++;
                deepEqual(cmds[i], {
                    cmd: 'rt',
                    xmlns: DEFAULT_XMLNS,
                    name: 'Test',
                    type: cmds[i].type
                }, 'rt Test');
                i++;
                var test3 = cmds[i].obj;
                deepEqual(cmds[i], {
                    cmd: 'or',
                    type: cmds[i - 1].type,
                    obj: test3
                }, 'or Test');
                i++;
                deepEqual(cmds[i], {
                    cmd: 'o',
                    obj: test3,
                    isContent: true
                }, 'o(c) Test');
                i++;
                deepEqual(cmds[i], {
                    cmd: 'oe',
                    obj: test3,
                    key: 'Test3',
                    isContent: true
                }, 'oe Test');
                //End Application.Resources
                i++;
                deepEqual(cmds[i], {
                    cmd: 'oe',
                    obj: ares,
                    key: undefined,
                    isContent: false
                }, 'oe Application.Resources');
                //End Application
                i++;
                deepEqual(cmds[i], {
                    cmd: 'oe',
                    obj: app,
                    key: undefined,
                    isContent: true
                }, 'oe Application');
                strictEqual(cmds.length, i + 1);
            });
        }, (err) => {
            QUnit.start();
            ok(false, err.message);
        });
    });
}