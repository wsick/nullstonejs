module nullstone.markup.xaml.tests {
    QUnit.module('Markup:XAML');

    QUnit.asyncTest("MultiContent", () => {
        getDoc("docs/multicontent.xml", (doc) => {
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

                //Grid
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
                    cmd: 'name',
                    name: 'LayoutRoot'
                }, 'name Grid');

                //Border 1
                i++;
                deepEqual(cmds[i], {
                    cmd: 'rt',
                    xmlns: DEFAULT_XMLNS,
                    name: 'Border',
                    type: cmds[i].type
                }, 'rt Border');
                i++;
                var brd = cmds[i].obj;
                deepEqual(cmds[i], {
                    cmd: 'or',
                    type: cmds[i - 1].type,
                    obj: brd
                }, 'or Border');
                i++;
                deepEqual(cmds[i], {
                    cmd: 'o',
                    obj: brd,
                    isContent: true
                }, 'o(c) Border');
                i++;
                deepEqual(cmds[i], {
                    cmd: 'oe',
                    obj: brd,
                    isContent: true
                }, 'oe Border');

                //Border 2
                i++;
                deepEqual(cmds[i], {
                    cmd: 'rt',
                    xmlns: DEFAULT_XMLNS,
                    name: 'Border',
                    type: cmds[i].type
                });
                i++;
                var brd = cmds[i].obj;
                deepEqual(cmds[i], {
                    cmd: 'or',
                    type: cmds[i - 1].type,
                    obj: brd
                });
                i++;
                deepEqual(cmds[i], {
                    cmd: 'o',
                    obj: brd,
                    isContent: true
                });
                i++;
                deepEqual(cmds[i], {
                    cmd: 'oe',
                    obj: brd,
                    isContent: true
                });

                //Border 3
                i++;
                deepEqual(cmds[i], {
                    cmd: 'rt',
                    xmlns: DEFAULT_XMLNS,
                    name: 'Border',
                    type: cmds[i].type
                });
                i++;
                var brd = cmds[i].obj;
                deepEqual(cmds[i], {
                    cmd: 'or',
                    type: cmds[i - 1].type,
                    obj: brd
                });
                i++;
                deepEqual(cmds[i], {
                    cmd: 'o',
                    obj: brd,
                    isContent: true
                });
                i++;
                deepEqual(cmds[i], {
                    cmd: 'oe',
                    obj: brd,
                    isContent: true
                });

                //Grid - End
                i++;
                deepEqual(cmds[i], {
                    cmd: 'oe',
                    obj: grid,
                    isContent: true
                });

                //Application - End
                i++;
                deepEqual(cmds[i], {
                    cmd: 'oe',
                    obj: app,
                    isContent: true
                });
                strictEqual(cmds.length, i + 1);
            });
        }, (err) => {
            QUnit.start();
            ok(false, err.message);
        });
    });
}