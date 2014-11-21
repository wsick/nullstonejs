module nullstone.markup.xaml.tests {
    QUnit.module('Markup:XAML');

    QUnit.asyncTest("Basic", () => {
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
                    cmd: 'co',
                    obj: app
                }, 'co Application');
                //Application.Resources
                i++;
                deepEqual(cmds[i], {
                    cmd: 'ress',
                    owner: app
                }, 'ress Application');
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
                    cmd: 'co',
                    obj: test1
                }, 'co Test');
                i++;
                deepEqual(cmds[i], {
                    cmd: 'key',
                    key: 'Test1'
                }, 'key Test1');
                i++;
                deepEqual(cmds[i], {
                    cmd: 'oe',
                    obj: test1
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
                    cmd: 'co',
                    obj: test2
                }, 'co Test');
                i++;
                deepEqual(cmds[i], {
                    cmd: 'key',
                    key: 'Test2'
                }, 'key Test2');
                i++;
                deepEqual(cmds[i], {
                    cmd: 'oe',
                    obj: test2
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
                    cmd: 'co',
                    obj: test3
                }, 'co Test');
                i++;
                deepEqual(cmds[i], {
                    cmd: 'key',
                    key: 'Test3'
                }, 'key Test3');
                i++;
                deepEqual(cmds[i], {
                    cmd: 'oe',
                    obj: test3
                }, 'oe Test');
                //End Application.Resources
                i++;
                deepEqual(cmds[i], {
                    cmd: 'rese',
                    owner: app
                }, 'rese Application');
                //End Application
                i++;
                deepEqual(cmds[i], {
                    cmd: 'oe',
                    obj: app
                }, 'oe Application');
                strictEqual(cmds.length, i + 1);
            });
        }, (err) => {
            QUnit.start();
            ok(false, err.message);
        });
    });
}