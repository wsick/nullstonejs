module nullstone.markup.xaml.tests {
    var parser = new DOMParser();

    export function getDoc (url: string, cb: (doc: Document) => any, error?: (error: any) => any) {
        function handleError (err) {
            if (!error)
                throw err;
            error(err);
        }

        var xhr = new XMLHttpRequest();
        xhr.onload = () => {
            if (xhr.status === 200 || xhr.status === 0)
                return cb(parser.parseFromString(xhr.responseText, "text/xml"));
            handleError(new Error("Status: " + xhr.status));
        };
        xhr.onerror = () => {
            handleError(new Error("Could not load file."));
        };
        xhr.open("GET", url, true);
        xhr.send();
    }

    export module mock {
        export function parse (el: Element, cb: (cmds: any[]) => any, skipTagName?: string) {
            var cmds = [];
            var parser = new XamlParser()
                .on({
                    resolveType: (xmlns, name) => {
                        var func = new Function("return function " + name + "() { }");
                        var type = func();
                        cmds.push({
                            cmd: 'rt',
                            xmlns: xmlns,
                            name: name,
                            type: type
                        });
                        if (skipTagName && name === skipTagName)
                            parser.skipBranch();
                        return {isPrimitive: false, type: type};
                    },
                    resolveObject: (type) => {
                        var obj = new type();
                        cmds.push({
                            cmd: 'or',
                            type: type,
                            obj: obj
                        });
                        return obj;
                    },
                    resolvePrimitive: (type, text) => {
                        cmds.push({
                            cmd: 'rp',
                            type: type,
                            text: text
                        });
                        return new type(text);
                    },
                    resolveResources: (owner, ownerType) => {
                        var obj = new Object();
                        cmds.push({
                            cmd: 'rr',
                            owner: owner,
                            ownerType: ownerType,
                            obj: obj
                        });
                        return obj;
                    },
                    branchSkip: (root, obj) => {
                        cmds.push({
                            cmd: 'bskip',
                            root: root,
                            obj: obj
                        });
                    },
                    object: (obj, isContent) => {
                        cmds.push({
                            cmd: 'o',
                            obj: obj,
                            isContent: isContent
                        });
                    },
                    objectEnd: (obj, isContent, prev) => {
                        cmds.push({
                            cmd: 'oe',
                            obj: obj,
                            isContent: isContent
                        });
                    },
                    contentText: (text) => {
                        cmds.push({
                            cmd: 'ct',
                            text: text
                        });
                    },
                    name: (name) => {
                        cmds.push({
                            cmd: 'name',
                            name: name
                        });
                    },
                    key: (key) => {
                        cmds.push({
                            cmd: 'key',
                            key: key
                        });
                    },
                    propertyStart: (ownerType, propName) => {
                        cmds.push({
                            cmd: 'ps',
                            ownerType: ownerType,
                            propName: propName
                        });
                    },
                    propertyEnd: (ownerType, propName) => {
                        cmds.push({
                            cmd: 'pe',
                            ownerType: ownerType,
                            propName: propName
                        });
                    },
                    end: () => {
                        cb(cmds);
                    }
                });
            parser.parse(el);
        }
    }
}