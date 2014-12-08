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
                    cmd: 'o',
                    obj: app,
                    isContent: true
                }, 'o(c) Application');
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
                    cmd: 'o',
                    obj: grid,
                    isContent: true
                }, 'o(c) Grid');
                i++;
                deepEqual(cmds[i], {
                    cmd: 'as',
                    ownerType: null,
                    attrName: 'Tag'
                }, 'as Tag');
                i++;
                deepEqual(cmds[i], {
                    cmd: 'rt',
                    xmlns: DEFAULT_XMLNS,
                    name: 'Grid',
                    type: cmds[i].type
                }, 'rt Grid');
                i++;
                deepEqual(cmds[i], {
                    cmd: 'ae',
                    ownerType: null,
                    attrName: 'Tag',
                    obj: cmds[i].obj
                }, 'ae Tag');
                i++;
                deepEqual(cmds[i], {
                    cmd: 'oe',
                    obj: grid,
                    key: undefined,
                    isContent: true
                }, 'oe Grid');
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