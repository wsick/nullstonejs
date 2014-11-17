module nullstone {
    export interface ILibrary {
        uri: string;
        rootModule: any;
        loadAsync (onLoaded: (rootModule: any) => any);
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

        loadAsync (onLoaded?: (rootModule: any) => any) {
            this.$$libpath = this.$$libpath || 'lib/' + this.uri + '/' + this.uri;
            require([this.$$libpath], (rootModule) => {
                onLoaded && onLoaded(this.$$module = rootModule);
            });
        }

        resolveType (moduleName: string, name: string, /* out */oresolve: IOutType): boolean {
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
            Object.defineProperty(type, "$$uri", {value: this.uri, writable: false});
            this.$$types[name] = type;
            return this;
        }

        addPrimitive (name: string, type: any): ILibrary {
            Object.defineProperty(type, "$$uri", {value: this.uri, writable: false});
            this.$$primtypes[name] = type;
            return this;
        }

        addEnum (name: string, enu: any): ILibrary {
            Object.defineProperty(enu, "$$enum", {value: true, writable: false});
            enu.name = name;
            return this.add(name, enu);
        }
    }
}