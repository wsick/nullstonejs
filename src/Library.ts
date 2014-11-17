module nullstone {
    export interface ILibrary {
        uri: string;
        rootModule: any;
        loadAsync (): IAsyncRequest<Library>;
        resolveType (moduleName: string, name: string, /* out */oresolve: IOutType): boolean;

        add (name: string, type: any): ILibrary;
        addPrimitive (name: string, type: any): ILibrary;
        addEnum (name: string, enu: any): ILibrary;
    }
    export class Library implements ILibrary {
        private $$libpath: string = null;
        private $$module: any = null;

        private $$primtypes: any = {};
        private $$types: any = {};

        constructor (uri: string) {
            Object.defineProperty(this, "uri", {value: uri, writable: false});
        }

        uri: string;

        get rootModule (): any {
            return this.$$module = this.$$module || require(this.$$libpath);
        }

        setLibPath (path: string) {
            this.$$libpath = path;
        }

        loadAsync (): IAsyncRequest<Library> {
            return createAsync(function (resolve, reject) {
                this.$$libpath = this.$$libpath || 'lib/' + this.uri + '/' + this.uri;
                require([this.$$libpath], (rootModule) => {
                    this.$$module = rootModule;
                    resolve(this);
                });
            });
        }

        resolveType (moduleName: string, name: string, /* out */oresolve: IOutType): boolean {
            if (!moduleName) {
                oresolve.isPrimitive = true;
                if ((oresolve.type = this.$$primtypes[name]) !== undefined)
                    return true;
                oresolve.isPrimitive = false;
                return (oresolve.type = this.$$types[name]) !== undefined;
            }

            oresolve.isPrimitive = false;
            oresolve.type = undefined;
            var curModule = this.rootModule;
            for (var i = 0, tokens = moduleName.split('.'); i < tokens.length && !!curModule; i++) {
                curModule = curModule[tokens[i]];
            }
            if (!curModule)
                return false;
            oresolve.type = curModule[name];
            return oresolve.type !== undefined;
        }

        add (name: string, type: any): ILibrary {
            if (!type)
                throw new Error("A type must be specified when registering '" + name + "'`.");
            Object.defineProperty(type, "$$uri", {value: this.uri, writable: false});
            this.$$types[name] = type;
            return this;
        }

        addPrimitive (name: string, type: any): ILibrary {
            if (!type)
                throw new Error("A type must be specified when registering '" + name + "'`.");
            Object.defineProperty(type, "$$uri", {value: this.uri, writable: false});
            this.$$primtypes[name] = type;
            return this;
        }

        addEnum (name: string, enu: any): ILibrary {
            this.add(name, enu);
            Object.defineProperty(enu, "$$enum", {value: true, writable: false});
            enu.name = name;
            return this;
        }
    }
}