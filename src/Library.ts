module nullstone {
    export interface ILibrary {
        uri: string;
        sourcePath: string;
        exports: string;
        rootModule: any;
        loadAsync (): async.IAsyncRequest<Library>;
        resolveType (moduleName: string, name: string, /* out */oresolve: IOutType): boolean;

        add (type: any, name?: string): ILibrary;
        addPrimitive (type: any, name?: string): ILibrary;
        addEnum (enu: any, name: string): ILibrary;
    }
    export class Library implements ILibrary {
        private $$module: any = null;
        private $$sourcePath: string = null;

        private $$primtypes: any = {};
        private $$types: any = {};

        private $$loaded = false;

        uri: string;
        exports: string;

        get sourcePath (): string {
            return this.$$sourcePath || 'lib/' + this.uri + '/' + this.uri;
        }

        set sourcePath (value: string) {
            if (value.substr(value.length - 3) === '.js')
                value = value.substr(0, value.length - 3);
            this.$$sourcePath = value;
        }

        constructor (uri: string) {
            Object.defineProperty(this, "uri", {value: uri, writable: false});
        }

        get rootModule (): any {
            return this.$$module = this.$$module || require(this.sourcePath);
        }

        loadAsync (): async.IAsyncRequest<Library> {
            //NOTE: If using http library scheme and a custom source path was not set, we assume the library is preloaded
            if (!this.$$sourcePath && this.uri && new Uri(this.uri).scheme === "http")
                this.$$loaded = true;
            if (this.$$loaded)
                return async.resolve(this);
            this.$configModule();
            return async.create((resolve, reject) => {
                (<Function>require)([this.uri], (rootModule) => {
                    this.$$module = rootModule;
                    this.$$loaded = true;
                    resolve(this);
                }, reject);
            });
        }

        private $configModule () {
            var co = <RequireConfig>{
                paths: {},
                shim: {},
                map: {
                    "*": {}
                }
            };
            var srcPath = this.sourcePath;
            co.paths[this.uri] = srcPath;
            co.shim[this.uri] = {
                exports: this.exports
            };
            co.map['*'][srcPath] = this.uri;
            require.config(co);
        }

        resolveType (moduleName: string, name: string, /* out */oresolve: IOutType): boolean {
            if (!moduleName) {
                //Library URI: http://.../
                oresolve.isPrimitive = true;
                if ((oresolve.type = this.$$primtypes[name]) !== undefined)
                    return true;
                oresolve.isPrimitive = false;
                return (oresolve.type = this.$$types[name]) !== undefined;
            }

            //Library URI: lib://.../
            var curModule = this.rootModule;
            oresolve.isPrimitive = false;
            oresolve.type = undefined;
            if (moduleName !== "/") {
                for (var i = 0, tokens = moduleName.substr(1).split('.'); i < tokens.length && !!curModule; i++) {
                    curModule = curModule[tokens[i]];
                }
            }
            if (!curModule)
                return false;
            oresolve.type = curModule[name];
            return oresolve.type !== undefined;
        }

        add (type: any, name?: string): ILibrary {
            if (!type)
                throw new Error("A type must be specified when registering '" + name + "'`.");
            name = name || getTypeName(type);
            if (!name)
                throw new Error("No type name found.");
            Object.defineProperty(type, "$$uri", {value: this.uri, writable: false});
            this.$$types[name] = type;
            return this;
        }

        addPrimitive (type: any, name?: string): ILibrary {
            if (!type)
                throw new Error("A type must be specified when registering '" + name + "'`.");
            name = name || getTypeName(type);
            if (!name)
                throw new Error("No type name found.");
            Object.defineProperty(type, "$$uri", {value: this.uri, writable: false});
            this.$$primtypes[name] = type;
            return this;
        }

        addEnum (enu: any, name: string): ILibrary {
            this.addPrimitive(enu, name);
            Object.defineProperty(enu, "$$enum", {value: true, writable: false});
            enu.name = name;
            return this;
        }
    }
}