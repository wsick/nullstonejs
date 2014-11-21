module nullstone.markup.xaml.tests.extensions {
    QUnit.module('Markup:XAML Parser+Extension Tests');

    QUnit.asyncTest("With Extension", () => {
        getDoc("docs/withext.xml", (doc) => {
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
                i++;
                deepEqual(cmds[i], {
                    cmd: 'rt',
                    xmlns: DEFAULT_XMLNS,
                    name: 'Grid',
                    type: cmds[i].type
                }, 'rt Grid');
                i++;
                var grid = cmds[i].obj;
                deepEqual(cmds[i], {
                    cmd: 'or',
                    type: cmds[i - 1].type,
                    obj: grid
                }, 'or Grid');
                i++;
                deepEqual(cmds[i], {
                    cmd: 'co',
                    obj: grid
                }, 'o Grid');
                i++;
                deepEqual(cmds[i], {
                    cmd: 'ps',
                    ownerType: null,
                    propName: 'Tag'
                }, 'ps Tag');
                i++;
                deepEqual(cmds[i], {
                    cmd: 'rt',
                    xmlns: DEFAULT_XMLNS,
                    name: 'Grid',
                    type: cmds[i].type
                }, 'rt Grid');
                i++;
                deepEqual(cmds[i], {
                    cmd: 'o',
                    obj: cmds[i - 1].type
                }, 'o Grid');
                i++;
                deepEqual(cmds[i], {
                    cmd: 'oe',
                    obj: cmds[i - 2].type
                }, 'oe Grid');
                i++;
                deepEqual(cmds[i], {
                    cmd: 'pe',
                    ownerType: null,
                    propName: 'Tag'
                }, 'pe Tag');
                i++;
                deepEqual(cmds[i], {
                    cmd: 'oe',
                    obj: grid
                }, 'oe Grid');
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