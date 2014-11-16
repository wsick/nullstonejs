module nullstone {
    export interface ILibrary {
        rootModule: any;
        loadAsync (onLoaded: (rootModule: any) => any);
        resolve (moduleName: string, name: string, /* out */oresolve: IOutType): boolean;
    }
    interface ILibraryHash {
        [id:string]: Library;
    }
    var libraries: ILibraryHash = <any>[];
    export class Library implements ILibrary {
        private $$libpath: string = null;
        private $$module: any = null;

        get rootModule (): any {
            return this.$$module = this.$$module || require(this.$$libpath);
        }

        loadAsync (onLoaded: (rootModule: any) => any) {
            require([this.$$libpath], (rootModule) => {
                onLoaded(this.$$module = rootModule);
            });
        }

        resolve (moduleName: string, name: string, /* out */oresolve: IOutType): boolean {
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

        static register (uri: string, modulePath: string): ILibrary {
            var lib = libraries[uri];
            if (!lib)
                lib = libraries[uri] = new Library();
            lib.$$libpath = modulePath;
            return lib;
        }

        static get (uri: string): ILibrary {
            return libraries[uri];
        }
    }
}