module nullstone {
    export class DirResolver implements ITypeResolver {
        resolveType (moduleName: string, name: string, /* out */oresolve: IOutType): boolean {
            oresolve.isPrimitive = false;
            oresolve.type = require(moduleName + '/' + name);
            return oresolve.type !== undefined;
        }
    }
}