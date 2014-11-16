module nullstone {
    export interface ILibrary {
        resolve(moduleName: string, name: string, /* out */oresolve: IOutType): boolean;
    }
    export class Library implements ILibrary {
        private $$module: any = null;

        resolve (moduleName: string, name: string, /* out */oresolve: IOutType): boolean {
            oresolve.isPrimitive = false;
            oresolve.type = undefined;
            var curModule = this.$$module;
            for (var i = 0, tokens = moduleName.split('.'); i < tokens.length && !!curModule; i++) {
                curModule = curModule[tokens[i]];
            }
            if (!curModule)
                return false;
            oresolve.type = curModule[name];
            return oresolve.type !== undefined;
        }
    }
}