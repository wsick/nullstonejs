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
        export function parse (el: Element, cb: (cmds: any[]) => any) {
            var cmds = [];
            var parser = new XamlParser()
                .onResolveType((xmlns, name) => {
                    var func = new Function("return function " + name + "() { }");
                    var type = func();
                    cmds.push({
                        cmd: 'rt',
                        xmlns: xmlns,
                        name: name,
                        type: type
                    });
                    return type;
                }).onResolveObject((type) => {
                    var obj = new type();
                    cmds.push({
                        cmd: 'or',
                        type: type,
                        obj: obj
                    });
                    return obj;
                }).onObject((obj) => {
                    cmds.push({
                        cmd: 'o',
                        obj: obj
                    });
                }).onObjectEnd((obj) => {
                    cmds.push({
                        cmd: 'oe',
                        obj: obj
                    });
                }).onContentObject((obj) => {
                    cmds.push({
                        cmd: 'co',
                        obj: obj
                    });
                }).onContentText((text) => {
                    cmds.push({
                        cmd: 'ct',
                        text: text
                    });
                }).onName((name) => {
                    cmds.push({
                        cmd: 'name',
                        name: name
                    });
                }).onKey((key) => {
                    cmds.push({
                        cmd: 'key',
                        name: key
                    });
                }).onPropertyStart((ownerType, propName) => {
                    cmds.push({
                        cmd: 'ps',
                        ownerType: ownerType,
                        propName: propName
                    });
                }).onPropertyEnd((ownerType, propName) => {
                    cmds.push({
                        cmd: 'pe',
                        ownerType: ownerType,
                        propName: propName
                    });
                }).onEnd(() => {
                    cb(cmds);
                }).parse(el);
        }
    }
}